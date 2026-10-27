// Lets Node load the package's TypeScript sources directly (type stripping)
// by resolving extensionless relative imports, e.g. "./keys" → "./keys.ts".
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(specifier, context, next) {
        if (specifier.startsWith(".") && !/\\.[cm]?[jt]sx?$/.test(specifier)) {
          try { return await next(specifier + ".ts", context); } catch {}
        }
        return next(specifier, context);
      }
    `),
  import.meta.url
);
