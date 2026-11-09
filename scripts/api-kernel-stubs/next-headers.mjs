// Test stub for `next/headers`. The api-kernel tests exercise the handler
// cores and the in-memory registry, not Next's request context. A test that
// wants a signed-in caller supplies one directly (HandlerInput.caller), so the
// cookie jar here is empty on purpose rather than faked.
export async function cookies() {
  return {
    get() {
      return undefined;
    },
    set() {},
    delete() {},
  };
}

export async function headers() {
  return new Map();
}

export async function draftMode() {
  return { isEnabled: false, enable() {}, disable() {} };
}
