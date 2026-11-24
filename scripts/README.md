# scripts/

Development, test and deployment helpers. Run them from the repo root.

| Script | What it does |
|---|---|
| `deploy.sh` | Builds the site and packages a static deployment into `.deployments/` (CI uses it to make a build record; it does not publish) |
| `i18n-extract.mjs` | Derives `docs/i18n/CATALOGUE.json` from source; `--check` fails on catalogue problems |
| `gen-hindi-review.mjs` | Regenerates the machine-draft Hindi review in `archives/` |
| `gen-locale-switcher.mjs` | Regenerates `src/components/ui/locale-switcher-strings.ts` |
| `api-kernel.hooks.mjs` | Node module hooks (path aliases and stubs) for the API-kernel tests |
| `api-kernel.test.mjs` | Tests for the pure parts of the Yazhi API kernel |
| `api-kernel-stubs/` | Test stubs for Next request context and Circle sessions |

```sh
# catalogue check
npm run i18n:check

# API-kernel tests (Node 22+; the hook supplies the path aliases)
node --import ./scripts/api-kernel.hooks.mjs --test scripts/api-kernel.test.mjs

# regenerate the Hindi review and the locale switcher strings
node scripts/gen-locale-switcher.mjs
node --experimental-strip-types --import ./packages/i18n/scripts/register.mjs scripts/gen-hindi-review.mjs
```
