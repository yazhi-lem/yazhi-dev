/**
 * Node 26 module hooks for the API-kernel tests.
 *
 * Node strips TypeScript types natively, but it does not know about the
 * repository's tsconfig path aliases. This hook teaches it the two the kernel
 * needs:
 *
 *   @yazhi/bubble        → packages/bubble/src/index.ts
 *   @yazhi/bubble/<path> → packages/bubble/src/<path>  (+ ".ts" if no extension)
 *
 * and answers one or two marker packages that exist only to make the bundler
 * refuse a client import:
 *
 *   server-only   → resolves to an empty module; the tests call the handler
 *                   cores directly, which is exactly the server side.
 *
 * Usage:
 *   node --import ./scripts/api-kernel.hooks.mjs --test scripts/api-kernel.test.mjs
 *
 * (Registered as `api-kernel:test` in package.json when the Lead agrees.)
 */

import { registerHooks } from "node:module";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_SRC = path.join(REPO, "packages/bubble/src");

function firstExisting(candidates) {
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    if (statSync(candidate).isDirectory()) {
      const index = path.join(candidate, "index.ts");
      if (existsSync(index)) return index;
      continue;
    }
    return candidate;
  }
  return null;
}

/** A directory import ("./foo") means "./foo.ts" or "./foo/index.ts". */
function withExtension(url) {
  if (!url.startsWith("file:")) return url;
  const file = fileURLToPath(url);
  if (path.extname(file)) return url;
  const resolved = firstExisting([`${file}.ts`, `${file}.tsx`, `${file}.mjs`, `${file}.js`, file]);
  return resolved ? pathToFileURL(resolved).href : url;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/circle/session" || specifier === "@/lib/circle/client") {
      return { url: pathToFileURL(path.join(REPO, "scripts/api-kernel-stubs", "circle.mjs")).href, shortCircuit: true };
    }
    if (specifier === "next/headers" || specifier === "next/server") {
      const stub = specifier === "next/headers" ? "next-headers.mjs" : "next-server.mjs";
      return { url: pathToFileURL(path.join(REPO, "scripts/api-kernel-stubs", stub)).href, shortCircuit: true };
    }
    if (specifier === "server-only") {
      return { url: pathToFileURL(path.join(REPO, "node_modules/server-only/empty.js")).href, shortCircuit: true };
    }
    if (specifier === "@yazhi/bubble") {
      return { url: pathToFileURL(path.join(PACKAGE_SRC, "index.ts")).href, shortCircuit: true };
    }
    if (specifier.startsWith("@yazhi/bubble/")) {
      const rest = specifier.slice("@yazhi/bubble/".length);
      const file = firstExisting([path.join(PACKAGE_SRC, rest), path.join(PACKAGE_SRC, `${rest}.ts`)]);
      if (!file) throw new Error(`api-kernel hooks: cannot resolve ${specifier}`);
      return { url: pathToFileURL(file).href, shortCircuit: true };
    }
    if (specifier.startsWith("@/")) {
      const rest = specifier.slice(2);
      const file = firstExisting([path.join(REPO, "src", rest), path.join(REPO, "src", `${rest}.ts`)]);
      if (!file) throw new Error(`api-kernel hooks: cannot resolve ${specifier}`);
      return { url: pathToFileURL(file).href, shortCircuit: true };
    }
    // Relative imports in TypeScript are written without an extension
    // ("../types", "./core"); Node wants the real file. Resolve them here
    // rather than after nextResolve, which throws on the bare path.
    if (specifier.startsWith(".") && context.parentURL) {
      const bare = new URL(specifier, context.parentURL);
      const file = firstExisting([
        fileURLToPath(bare),
        `${fileURLToPath(bare)}.ts`,
        `${fileURLToPath(bare)}.tsx`,
        `${fileURLToPath(bare)}.mjs`,
        `${fileURLToPath(bare)}.js`,
        path.join(fileURLToPath(bare), "index.ts"),
      ]);
      if (!file) throw new Error(`api-kernel hooks: cannot resolve ${specifier} from ${context.parentURL}`);
      return { url: pathToFileURL(file).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
