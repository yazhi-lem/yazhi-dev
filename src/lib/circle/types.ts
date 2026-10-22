/** Circle account shapes shared by the /api/circle/* route handlers and the
    browser. Plain data only — safe to import from server and client code.

    A Circle account is a person in the yazhi-api IAM directory. yazhi.dev
    never sees the account's password after sign-in, and never stores or
    shows its raw Circle API key (see src/lib/circle/client.ts). */

export interface CircleAccount {
  accountId: string;
  email: string;
  fullName: string;
  companyId: string;
  createdAt: string;
}

/** GET /api/circle/session */
export type CircleSessionResponse =
  | { signedIn: true; account: CircleAccount }
  | { signedIn: false; configured: boolean; signupOpen: boolean };

/** Error body returned by every /api/circle/* route on failure. */
export interface CircleError {
  error: string;
}
