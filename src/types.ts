export interface StatusConfig {
  status: number
  suffix: string
}

export interface FormattedResponseConfig {
  debug: boolean
  promise: boolean
  types: { ok: string, ko: string, warn: string, notFound: string }
  /** Only `get.ok` is read by the library. `ko`/`warn` are kept for config compatibility. */
  get: { ok: string, ko: string, warn: string }
  ok: StatusConfig
  ko: StatusConfig
  warn: StatusConfig
  notFound: StatusConfig
  /** @deprecated Never read by the library. Kept so v1 configs keep type-checking. */
  auth: { error: StatusConfig, success: StatusConfig }
  dateFields: string[]
}

export type DeepPartial<T>
  = T extends readonly unknown[] ? T
    : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T

/**
 * Constructor input. `promise` is split out of the deep-partial config so it is
 * the sole inference site for the class's `P` type parameter.
 */
export type FormattedResponseOptions<P extends boolean = boolean>
  = DeepPartial<Omit<FormattedResponseConfig, 'promise'>> & { promise?: P }

/**
 * The whole trick behind the sync/promise duality. `P` is a naked type parameter,
 * so `Resolved<boolean, T>` distributes over `true | false`, collapsing to
 * `Promise<T> | T` — the graceful fallback, for free.
 */
export type Resolved<P extends boolean, T> = P extends true ? Promise<T> : T

export interface BaseResponse {
  status: number
  message: string
}

export interface TypedResponse extends BaseResponse {
  type: string
}

/**
 * Mirrors the runtime rule in `response()`: a falsy/empty `data` contributes
 * nothing, and a payload that already owns a `data` or `error` key is spread
 * at the top level instead of being nested under `data`.
 */
export type DataPart<D>
  = [D] extends [null | undefined | false | 0 | ''] ? unknown
    : D extends { data: unknown } ? D
      : D extends { error: unknown } ? D
        : { data: D }

export interface ErrorResponse extends TypedResponse {
  /** present only when `config.debug` is true and the error has a `message` */
  error?: string
  /** present when the error carries an `errors` property, regardless of `debug` */
  errors?: unknown
  /** the `debug: false` + `error.errors` path nests them here instead */
  data?: { errors?: unknown }
}

export type ErrorInput = Error | { message?: string, errors?: unknown } | null | undefined

// Kept type-only to avoid a runtime import cycle with formatted-response.ts.
export type { FormattedResponse as FormattedResponseInstance } from './formatted-response.js'
import type { FormattedResponse as FormattedResponseClass } from './formatted-response.js'

export interface FormattedResponseConstructor {
  new<P extends boolean = true> (config?: FormattedResponseOptions<P> | null): FormattedResponseClass<P>
  /** @deprecated Calling without `new` is supported for v1 compatibility. Prefer `new`. */
  <P extends boolean = true> (config?: FormattedResponseOptions<P> | null): FormattedResponseClass<P>
  readonly prototype: FormattedResponseClass<boolean>
  readonly defaults: Readonly<FormattedResponseConfig>
  sync (config?: FormattedResponseOptions | null): FormattedResponseClass<false>
  async (config?: FormattedResponseOptions | null): FormattedResponseClass<true>
}
