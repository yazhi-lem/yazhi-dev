import "server-only";

/** Server-only gRPC client for Circle on yazhi-api.
    THIS FILE IS THE SINGLE INTEGRATION POINT FOR CIRCLE AUTH.

    yazhi-api speaks gRPC (default :50051). Two of its services matter here:

      yazhi.circle.v1.YazhiCircle
        SignIn(email, password)      → CircleSession   (no API key; per-email limited)
        RefreshSession(refresh)      → CircleSession   (single-use refresh token)
        GetSessionAccount()          → CircleAccount   (Bearer <session access token>)

      yazhi.circle.v1.YazhiCircleProvisioning
        CreateCircleAccount(email, password, full_name, company_id)
          → { account, api_key }    (Bearer <yazhi.dev's own app key>)

    Only the messages and RPCs yazhi.dev calls are declared below; field
    numbers match yazhi-api's services/yazhi/proto/circle.proto, so the
    subset is wire-compatible.

    Configuration (server env, never exposed to the browser):
      YAZHI_GRPC_TARGET        host:port of yazhi-api's gRPC server
      YAZHI_GRPC_TLS           "1" to use TLS (required off-loopback)
      YAZHI_CIRCLE_APP_KEY     Circle key of the yazhi.dev app account, scoped
                               to YAZHI_CIRCLE_COMPANY_ID — enables sign-up
      YAZHI_CIRCLE_COMPANY_ID  company new developer accounts are created in */

import * as grpc from "@grpc/grpc-js";
import { fromJSON } from "@grpc/proto-loader";
import * as protobuf from "protobufjs";
import type { CircleAccount } from "./types";

const CIRCLE_PROTO = `
syntax = "proto3";
package yazhi.circle.v1;

service YazhiCircle {
  rpc SignIn(SignInRequest) returns (CircleSession);
  rpc RefreshSession(RefreshSessionRequest) returns (CircleSession);
  rpc GetSessionAccount(GetSessionAccountRequest) returns (CircleAccount);
}

service YazhiCircleProvisioning {
  rpc CreateCircleAccount(CreateCircleAccountRequest) returns (CreateCircleAccountResponse);
}

message CircleAccount {
  string account_id = 1;
  string email = 2;
  string full_name = 3;
  string company_id = 4;
  bool is_active = 5;
  string created_at = 6;
}
message CircleAPIKey {
  string api_key = 1;
  string key_id = 2;
  string created_at = 3;
}
message SignInRequest { string email = 1; string password = 2; }
message RefreshSessionRequest { string refresh_token = 1; }
message GetSessionAccountRequest {}
message CircleSession {
  CircleAccount account = 1;
  string access_token = 2;
  string refresh_token = 3;
  string token_type = 4;
  int32 expires_in = 5;
}
message CreateCircleAccountRequest {
  string email = 1;
  string password = 2;
  string full_name = 3;
  string company_id = 4;
}
message CreateCircleAccountResponse {
  CircleAccount account = 1;
  CircleAPIKey api_key = 2;
}
`;

interface RawAccount {
  account_id: string;
  email: string;
  full_name: string;
  company_id: string;
  is_active: boolean;
  created_at: string;
}

interface RawSession {
  account: RawAccount;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface CircleTokens {
  account: CircleAccount;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** A Circle call failed; `status` is the HTTP status the route should use. */
export class CircleCallError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly grpcCode?: grpc.status
  ) {
    super(message);
    this.name = "CircleCallError";
  }
}

const TARGET = process.env.YAZHI_GRPC_TARGET;
const USE_TLS = process.env.YAZHI_GRPC_TLS === "1";
const APP_KEY = process.env.YAZHI_CIRCLE_APP_KEY;
const COMPANY_ID = process.env.YAZHI_CIRCLE_COMPANY_ID ?? "";
const DEADLINE_MS = 8000;

export function circleConfigured(): boolean {
  return Boolean(TARGET);
}

export function circleSignupOpen(): boolean {
  return Boolean(TARGET && APP_KEY);
}

type Unary = (
  request: object,
  metadata: grpc.Metadata,
  options: grpc.CallOptions,
  callback: (err: grpc.ServiceError | null, response: unknown) => void
) => void;

interface Clients {
  auth: grpc.Client & Record<string, Unary>;
  provisioning: grpc.Client & Record<string, Unary>;
}

let clients: Clients | null = null;

function getClients(): Clients {
  if (!TARGET) {
    throw new CircleCallError(
      "Circle sign-in is not configured — set YAZHI_GRPC_TARGET to reach yazhi-api.",
      503
    );
  }
  if (clients) return clients;
  const root = protobuf.parse(CIRCLE_PROTO, { keepCase: true }).root;
  const definition = fromJSON(root.toJSON(), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
  });
  const pkg = grpc.loadPackageDefinition(definition) as unknown as {
    yazhi: { circle: { v1: Record<string, grpc.ServiceClientConstructor> } };
  };
  const v1 = pkg.yazhi.circle.v1;
  const creds = USE_TLS ? grpc.credentials.createSsl() : grpc.credentials.createInsecure();
  clients = {
    auth: new v1.YazhiCircle(TARGET, creds) as Clients["auth"],
    provisioning: new v1.YazhiCircleProvisioning(TARGET, creds) as Clients["provisioning"],
  };
  return clients;
}

/** Map a gRPC failure onto an HTTP status and a message safe to show. */
function toCallError(err: grpc.ServiceError): CircleCallError {
  switch (err.code) {
    case grpc.status.UNAUTHENTICATED:
      return new CircleCallError("Email or password is incorrect.", 401, err.code);
    case grpc.status.RESOURCE_EXHAUSTED:
      return new CircleCallError("Too many attempts — wait 15 minutes and try again.", 429, err.code);
    case grpc.status.ALREADY_EXISTS:
      return new CircleCallError("An account with this email already exists — sign in instead.", 409, err.code);
    case grpc.status.INVALID_ARGUMENT:
      return new CircleCallError(err.details || "Check the details and try again.", 400, err.code);
    case grpc.status.PERMISSION_DENIED:
      return new CircleCallError("yazhi.dev is not allowed to create accounts yet.", 503, err.code);
    case grpc.status.UNAVAILABLE:
    case grpc.status.DEADLINE_EXCEEDED:
      return new CircleCallError("yazhi-api is unreachable right now. Try again shortly.", 503, err.code);
    default:
      return new CircleCallError("Circle request failed.", 502, err.code);
  }
}

function call<T>(
  client: Record<string, Unary>,
  method: string,
  request: object,
  bearer?: string
): Promise<T> {
  const metadata = new grpc.Metadata();
  if (bearer) metadata.set("authorization", `Bearer ${bearer}`);
  return new Promise((resolve, reject) => {
    client[method](
      request,
      metadata,
      { deadline: Date.now() + DEADLINE_MS },
      (err, response) => (err ? reject(toCallError(err)) : resolve(response as T))
    );
  });
}

function toAccount(raw: RawAccount): CircleAccount {
  return {
    accountId: raw.account_id,
    email: raw.email,
    fullName: raw.full_name,
    companyId: raw.company_id,
    createdAt: raw.created_at,
  };
}

function toTokens(raw: RawSession): CircleTokens {
  return {
    account: toAccount(raw.account),
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    expiresIn: raw.expires_in,
  };
}

export async function signIn(email: string, password: string): Promise<CircleTokens> {
  const raw = await call<RawSession>(getClients().auth, "SignIn", { email, password });
  return toTokens(raw);
}

export async function refreshSession(refreshToken: string): Promise<CircleTokens> {
  const raw = await call<RawSession>(getClients().auth, "RefreshSession", {
    refresh_token: refreshToken,
  });
  return toTokens(raw);
}

export async function getSessionAccount(accessToken: string): Promise<CircleAccount> {
  const raw = await call<RawAccount>(getClients().auth, "GetSessionAccount", {}, accessToken);
  return toAccount(raw);
}

/** Create a developer's Circle account, then sign them straight in.

    The raw Circle API key yazhi-api returns is deliberately dropped here.
    Today any Circle key may provision and delete accounts in its own
    company (yazhi-api iam_auth.require_company_admin), so handing every
    developer the key for the shared company would let one developer delete
    another. Developers act through their session instead; issuing personal
    API keys waits on the yazhi-api change described in
    docs/PROPOSAL-YAZHI-DEV-V3.md §6. */
export async function createAccountAndSignIn(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<CircleTokens> {
  if (!APP_KEY) {
    throw new CircleCallError("Developer sign-up is not open yet.", 503);
  }
  await call<unknown>(
    getClients().provisioning,
    "CreateCircleAccount",
    {
      email: input.email,
      password: input.password,
      full_name: input.fullName,
      company_id: COMPANY_ID,
    },
    APP_KEY
  );
  return signIn(input.email, input.password);
}
