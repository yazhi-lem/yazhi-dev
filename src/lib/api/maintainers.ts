import "server-only";

/** Who may review bubbles — the `community.maintainer` check for /api/bubbles.

    The contract gates reviews on the Circle role `community.maintainer`.
    Nothing in this repository exposes roles yet: `CircleAccount` is
    { accountId, email, fullName, companyId, createdAt } and the public
    GetSessionAccount RPC carries no roles. So until yazhi-api surfaces them,
    the maintainer list is server configuration:

      YAZHI_MAINTAINERS="acct_123, alice@yazhi.dev"   (comma-separated)

    An entry matches an account's id exactly, or its email
    case-insensitively. **Fail-closed**: with the variable unset or empty,
    nobody is a maintainer and every review answers 403 not_maintainer.

    TODO(roles): replace this with the real IAM check. The server-side source
    is yazhi-api's domain service for community bubbles
    (repos/yazhi-api/domains/community/bubbles.py:120), which tests the
    `community.maintainer` IAM role on the caller's Circle account. When that
    is reachable over gRPC or REST, read the role there and delete this file's
    env fallback — do not grow it. */

export interface MaintainerIdentity {
  accountId: string;
  email?: string | null;
}

/** The configured maintainer entries, trimmed and lower-cased. Re-read per
    call (not cached at module load) so a test or a restart picks up a change. */
export function maintainerEntries(): string[] {
  return (process.env.YAZHI_MAINTAINERS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/** Is this Circle account a maintainer? */
export function isMaintainer(identity: MaintainerIdentity | null | undefined): boolean {
  if (!identity || !identity.accountId) return false;
  const entries = maintainerEntries();
  if (!entries.length) return false;
  const id = identity.accountId.trim().toLowerCase();
  if (entries.includes(id)) return true;
  const email = identity.email?.trim().toLowerCase();
  return Boolean(email && entries.includes(email));
}
