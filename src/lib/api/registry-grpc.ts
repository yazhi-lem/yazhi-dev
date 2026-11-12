import "server-only";

/** The gRPC-backed bubble registry — yazhi-api's `YazhiBubbles` service.

    NOT WIRED YET. This file is the seam, not the implementation: every call
    answers the same typed refusal (503 / "not_configured") rather than
    pretending to store anything. getRegistry() only selects it when BOTH
    YAZHI_GRPC_TARGET and YAZHI_REGISTRY_GRPC=1 are set, so the default path
    is always the deterministic in-memory store.

    What "wiring it" means, for whoever picks this up
    --------------------------------------------------
    1. The proto is repos/yazhi-api/services/yazhi/proto/bubbles.proto, package
       yazhi.community.v1, service YazhiBubbles, five unary RPCs:
         PublishBubble(PublishBubbleRequest)   → BubbleVersion
         GetBubble(GetBubbleRequest)           → BubbleVersion
         ListBubbles(ListBubblesRequest)       → ListBubblesResponse
         SubmitReview(SubmitReviewRequest)     → BubbleVersion
         WithdrawBubble(WithdrawBubbleRequest) → WithdrawBubbleResponse
       `google.protobuf.Struct manifest` arrives as a plain JS object once
       @grpc/proto-loader is told `defaults: true` (protobufjs Struct becomes
       {fields: {…}} otherwise — convert it).
    2. Every RPC takes a Circle *session access token* in metadata:
         metadata.set("authorization", `Bearer ${accessToken}`)
       The builder's session lives in the httpOnly `yz_circle_at` cookie
       (src/lib/circle/session.ts). It is not readable outside a Route
       Handler, so wiring this needs either
         (a) a small `sessionAccessToken()` helper added to src/lib/circle/
             (owned by the Lead), read via cookies() inside the handler, or
         (b) a yazhi-api change that accepts a service key for registry reads.
       Never use the raw Circle API key here: a bubble always has a person
       behind it (bubbles.proto comment).
    3. Status/visibility arrive as proto3 ENUM NAMES (with `enums: String`),
       e.g. "BUBBLE_STATUS_IN_REVIEW", "BUBBLE_VISIBILITY_PUBLIC",
       "REVIEW_DECISION_APPROVE". Map them to BubbleStatus / Visibility /
       "approve"|"reject" — snake_case, strip the prefix, lowercase.
    4. Errors: translate gRPC codes like src/lib/circle/client.ts's
       toCallError() — NOT_FOUND → 404 not_found (never 403: a version the
       caller may not see is not enumerable), ALREADY_EXISTS → 409
       version_conflict, PERMISSION_DENIED → 403, INVALID_ARGUMENT → 400,
       UNAVAILABLE/DEADLINE_EXCEEDED → 503 upstream_error.
    5. Timestamps: google.protobuf.Timestamp → ISO 8601 (read {seconds, nanos}
       with `longs: String`, then new Date(Number(seconds) * 1000).toISOString();
       nanoseconds are lost, which is fine for a version row).

    This module imports only types from ./types and ./registry — never
    runtime values from ./registry, which would be a cycle. */

import type { Registry } from "./registry";

const NOT_WIRED =
  "The gRPC bubble registry (yazhi-api YazhiBubbles) is not wired yet. Unset YAZHI_REGISTRY_GRPC to use the in-memory registry, or see src/lib/api/registry-grpc.ts for what wiring it takes.";

/** A Registry that refuses every call with a typed 503 (name "RegistryError",
    status 503, code "not_configured"), so the handler layer reports it in the
    contract's { error, code } shape without special-casing. */
export function grpcRegistry(): Registry {
  const refuse = (): never => {
    const err = new Error(NOT_WIRED) as Error & { status: number; code: string };
    err.name = "RegistryError";
    err.status = 503;
    err.code = "not_configured";
    throw err;
  };
  return {
    kind: "grpc",
    publish: async () => refuse(),
    get: async () => refuse(),
    list: async () => refuse(),
    review: async () => refuse(),
    withdraw: async () => refuse(),
  };
}
