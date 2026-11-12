// Test stub for `next/server`: just enough to construct error responses.
export class NextResponse extends Response {
  static json(body, init = {}) {
    const headers = new Headers(init.headers ?? {});
    headers.set("content-type", "application/json");
    return new NextResponse(JSON.stringify(body), { ...init, headers });
  }
  static redirect(url, status = 307) {
    return new NextResponse(null, { status, headers: { location: String(url) } });
  }
}

export class NextRequest extends Request {}
