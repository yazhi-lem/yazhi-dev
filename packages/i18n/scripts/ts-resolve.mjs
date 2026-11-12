// Lets Node load this package's TypeScript sources directly (Node 26 strips
// types natively) by resolving:
//   - extensionless relative imports, e.g. "./locale" -> "./locale.ts"
//   - the app's tsconfig `paths` aliases, so `src/lib/*` modules that import
//     "@yazhi/i18n" also load in tests:
//        "@yazhi/i18n"    -> packages/i18n/src/index.ts
//        "@yazhi/i18n/x"  -> packages/i18n/src/x.ts
// A data: URL module has an opaque base, so the package root is passed in as
// a string rather than derived from `import.meta.url`.
import { register } from "node:module";
import { pathToFileURL } from "node:url";

const pkgRoot = pathToFileURL(`${new URL(".", import.meta.url).pathname}../src/`).href;

const hook = `
  const SRC = ${JSON.stringify(pkgRoot)};
  export async function resolve(specifier, context, next) {
    if (specifier === "@yazhi/i18n") return next(SRC + "index.ts", context);
    if (specifier.startsWith("@yazhi/i18n/")) {
      return next(SRC + specifier.slice("@yazhi/i18n/".length) + ".ts", context);
    }
    if (specifier.startsWith(".") && !/\\.[cm]?[jt]sx?$/.test(specifier)) {
      try { return await next(specifier + ".ts", context); } catch {}
      try { return await next(specifier + "/index.ts", context); } catch {}
    }
    return next(specifier, context);
  }
`;

register(`data:text/javascript,${encodeURIComponent(hook)}`, import.meta.url);
