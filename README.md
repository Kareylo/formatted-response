# formatted-response

Create formatted, consistently-shaped JSON responses for your application — synchronously or as promises. Zero runtime dependencies. Written in TypeScript, published as dual ESM + CommonJS.

## Features

- Zero runtime dependencies
- Fully typed — the `success`/`error`/`warning`/... methods infer whether they return a value or a `Promise` of one, from your config
- Works with `require()`, `import`, and TypeScript out of the box
- Node.js ≥ 20.19

## Installation

```bash
npm install formatted-response
# or
yarn add formatted-response
```

## Usage

### ESM

```js
import FormattedResponse from 'formatted-response'

const response = new FormattedResponse()

// response.promise defaults to true, so this returns a Promise
const payload = await response.success('MY.DATA', { myData: 'My data!' })
// => { status: 200, message: 'MY.DATA.OK', type: 'success', data: { myData: 'My data!' } }
```

### CommonJS

```js
const FormattedResponse = require('formatted-response')

const response = new FormattedResponse({ promise: false })

console.log(response.success('MY.DATA', { myData: 'My data!' }))
// => { status: 200, message: 'MY.DATA.OK', type: 'success', data: { myData: 'My data!' } }
```

### TypeScript

The return type of every method is inferred from `promise` in the config you pass the constructor — no casts needed for the common case:

```ts
import FormattedResponse from 'formatted-response'

const sync = new FormattedResponse({ promise: false })
sync.success('M') // ResponsePayload — synchronous

const async_ = new FormattedResponse() // promise: true is the default
async_.success('M') // Promise<ResponsePayload>
```

Inference works from a config object *literal*. If your config comes from a variable typed as `FormattedResponseOptions`, TypeScript can no longer know which branch you're on at compile time, and the return type falls back to `ResponsePayload | Promise<ResponsePayload>`. Three ways around that, in order of preference:

```ts
// 1. Best — a runtime-guaranteed factory
const R = FormattedResponse.sync(runtimeConfig)   // always ResponsePayload
const A = FormattedResponse.async(runtimeConfig)  // always Promise<ResponsePayload>

// 2. `as const` on the literal
const cfg = { promise: false } as const
const R = new FormattedResponse(cfg)

// 3. The universal escape hatch — works whether or not it's actually a Promise
const r = await response.success('SAVED', { id: 1 })
```

Both `new FormattedResponse(config)` and `FormattedResponse(config)` (without `new`) work, for compatibility with 1.x — `instanceof` checks still succeed either way.

## API

Every method's last argument is an optional `promise: boolean`, which overrides the instance's `config.promise` for that one call.

| Method | Adds to `message` | `status` | `type` |
|---|---|---|---|
| `response(message, data, type, status, promise?)` | *(nothing — full control)* | as given | as given |
| `get(message, data?, promise?)` | `config.get.ok` | `config.ok.status` | *(none)* |
| `success(message, data?, promise?)` | `config.ok.suffix` | `config.ok.status` | `config.types.ok` |
| `error(message, error?, promise?)` | `config.ko.suffix` | `config.ko.status` | `config.types.ko` |
| `warning(message, error?, promise?)` | `config.warn.suffix` | `config.warn.status` | `config.types.warn` |
| `notFound(message, error?, promise?)` | `config.notFound.suffix` | `config.notFound.status` | `config.types.notFound` |

```ts
const response = new FormattedResponse({ promise: false })

response.success('MY.DATA', { myData: 'My data!' })
// => { status: 200, message: 'MY.DATA.OK', type: 'success', data: { myData: 'My data!' } }

response.get('MY.DATA', { myData: 'My data!' })
// => { status: 200, message: 'MY.DATA.GET.OK', data: { myData: 'My data!' } }

response.error('MY.DATA', new Error('My Error!'))
// => { status: 400, message: 'MY.DATA.KO', type: 'error' }
// (the `error` message itself is only included when `debug: true` — see Configuration)

response.warning('MY.DATA', new Error('My Error!'))
// => { status: 403, message: 'MY.DATA.WARN', type: 'warning' }

response.notFound('MY.DATA', new Error('My Error!'))
// => { status: 404, message: 'MY.DATA.ERROR', type: 'error' }

response.response('MY.DATA', { myData: 'My data!' }, 'my-type', 200)
// => { status: 200, message: 'MY.DATA', type: 'my-type', data: { myData: 'My data!' } }
```

`data` is nested under a `data` key automatically, unless it already has a `data` or `error` key of its own, in which case it's spread at the top level:

```ts
response.success('X', { count: 1 })              // => {..., data: { count: 1 }}
response.success('X', { data: { count: 1 } })     // => {..., data: { count: 1 }}  (same result)
response.response('X', { data: { a: 1 }, extra: 2 }, 't', 200)
// => { status: 200, message: 'X', type: 't', data: { a: 1 }, extra: 2 }
```

## Configuration

All defaults live in `FormattedResponse.defaults` (or the deprecated `formatted-response/config` subpath). Pass a partial override to the constructor — it's deep-merged over the defaults.

```ts
const response = new FormattedResponse({
  debug: true,
  promise: false,
  types: { ok: 'alert-success', ko: 'alert-danger', warn: 'alert-warning', notFound: 'alert-notFound' },
  get: { ok: '.GET.SUCCESS', ko: '.GET.ERROR', warn: '.GET.WARNING' },
  ok: { status: 200, suffix: '.SUCCESS' },
  ko: { status: 400, suffix: '.ERROR' },
  warn: { status: 403, suffix: '.WARNING' },
  notFound: { status: 404, suffix: '.ERROR' },
  dateFields: ['created_at', 'created', 'updated_at', 'updated']
})
```

| Key | Default | Meaning |
|---|---|---|
| `debug` | `false` | When `true`, `error`/`warning`/`notFound` include the underlying `Error`'s `message` under an `error` key |
| `promise` | `true` | Default return mode for every method — synchronous value vs `Promise` |
| `types.{ok,ko,warn,notFound}` | `success` / `error` / `warning` / `error` | The `type` field emitted by `success`/`error`/`warning`/`notFound` |
| `get.ok` | `.GET.OK` | Suffix appended to `message` by `get()` |
| `ok.{status,suffix}` | `200` / `.OK` | Used by `success()` |
| `ko.{status,suffix}` | `400` / `.KO` | Used by `error()` |
| `warn.{status,suffix}` | `403` / `.WARN` | Used by `warning()` |
| `notFound.{status,suffix}` | `404` / `.ERROR` | Used by `notFound()` |
| `dateFields` | `['created_at', 'created', 'updated_at', 'updated']` | Keys in `data` whose value, if a real `Date`, is converted to an ISO string |

`get.ko`, `get.warn`, and `auth.*` are accepted in the config shape for backwards compatibility but are **not read by any method** — reserved for future use.

## Types

The package ships full TypeScript types at the package root, plus at the `formatted-response/types` subpath for advanced usage:

```ts
import type {
  FormattedResponseConfig,   // the fully-resolved config
  FormattedResponseOptions,  // partial config accepted by the constructor
  BaseResponse, TypedResponse, ErrorResponse,  // response payload shapes
  ErrorInput,                // what error()/warning()/notFound() accept
  Resolved                   // the sync/promise resolution helper
} from 'formatted-response/types'
```

## Migration from 1.x

**Breaking changes in 2.0.0:**

1. **Node ≥ 20.19 is required.**
2. `ObjDeepMerge`, `_isObject`, `_isDate`, `_promise`, and `_parseErrors` are no longer public on the prototype. They were internal helpers (four of them `_`-prefixed already); if you depended on them, they're easy to reimplement — see [`src/internal/merge.ts`](src/internal/merge.ts).
3. **`data` passed into `success`/`error`/etc. is no longer mutated.** In 1.x, converting a `dateFields` value to an ISO string wrote back into your own object; it no longer does.
4. **Non-plain objects at keys not listed in `dateFields`** (`Date`, `Map`, `Set`, `Buffer`, class instances) **are now preserved by reference** instead of being silently flattened to `{}` — this fixes a crash on `Buffer` values and a silent data-loss bug on `Date`/`Map` values, but it does change output for anyone who was relying on the old flattening behavior.
5. `config.dateFields` is now copied per instance instead of being shared by reference with the defaults — mutating it on one instance no longer poisons every other instance in the process.
6. `require('formatted-response/config')` still works but is deprecated; use `FormattedResponse.defaults` instead.
7. Only the documented entry points (`.`, `./config`, `./types`) are importable — deep paths like `formatted-response/src/response` no longer resolve.

Everything else — the method signatures, the default config values, the message/status/type shapes — is unchanged.

## Contributing

Issues and PRs welcome at [github.com/Kareylo/formatted-response](https://github.com/Kareylo/formatted-response).

```bash
npm install   # or: yarn install
npm run verify   # lint + typecheck + test + build + package checks
```

## License

MIT © Corentin Nazé
