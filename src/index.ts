import { FormattedResponse as FormattedResponseClass } from './formatted-response.js'
import type { FormattedResponseConstructor, FormattedResponseOptions } from './types.js'

/**
 * A TS `class` throws when called without `new`. v1 supported both call shapes
 * (`new FormattedResponse(cfg)` and `FormattedResponse(cfg)`), so this Proxy
 * forwards `apply` to `construct`. A plain wrapper function would break
 * `instanceof`, since a constructor that returns an object overrides `this`.
 */
const FormattedResponse = new Proxy(FormattedResponseClass, {
  apply: (Target, _thisArg, args: [FormattedResponseOptions?]) => new Target(...args)
}) as unknown as FormattedResponseConstructor

// This entry deliberately exposes ONLY the default export at runtime (no named
// exports, not even `export type`) so tsdown's `cjsDefault` rewrites the CJS
// output to `module.exports = FormattedResponse` and the generated `.d.cts` to
// `export = FormattedResponse`. Public types live at the `formatted-response/types`
// subpath instead — see src/types.ts.
export default FormattedResponse
