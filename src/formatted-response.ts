import { DEFAULT_CONFIG } from './defaults.js'
import { parseErrors } from './internal/errors.js'
import { deepMerge } from './internal/merge.js'
import type {
  BaseResponse,
  DataPart,
  ErrorInput,
  ErrorResponse,
  FormattedResponseConfig,
  FormattedResponseOptions,
  Resolved,
  TypedResponse
} from './types.js'

export class FormattedResponse<P extends boolean = true> {
  readonly config: FormattedResponseConfig

  static readonly defaults: Readonly<FormattedResponseConfig> = DEFAULT_CONFIG

  /** Builds an instance pinned to synchronous responses, regardless of what the config literal says. */
  static sync (config?: FormattedResponseOptions | null): FormattedResponse<false> {
    return new FormattedResponse<false>({ ...config, promise: false })
  }

  /** Builds an instance pinned to promise-returning responses, regardless of what the config literal says. */
  static async (config?: FormattedResponseOptions | null): FormattedResponse<true> {
    return new FormattedResponse<true>({ ...config, promise: true })
  }

  constructor (config?: FormattedResponseOptions<P> | null) {
    const merged = deepMerge({}, DEFAULT_CONFIG) as unknown as FormattedResponseConfig
    if (config != null) deepMerge(merged as unknown as Record<string, unknown>, config, merged.dateFields)
    this.config = merged
  }

  response<D, Q extends boolean> (
    message: string, data: D, type: string | false | null | undefined, status: number, promise: Q
  ): Resolved<Q, BaseResponse & { type?: string } & DataPart<D>>
  response<D = undefined> (
    message: string, data?: D, type?: string | false | null, status?: number
  ): Resolved<P, BaseResponse & { type?: string } & DataPart<D>>
  response (message: string, data?: unknown, type?: string | false | null, status?: number, promise?: boolean): unknown {
    const usePromise = promise ?? this.config.promise
    let obj: Record<string, unknown> = { status, message }

    if (type) obj.type = type

    if (data && Object.keys(data).length > 0) {
      const rec = data as Record<string, unknown>
      const payload: unknown = (rec.data || rec.error) ? data : { data }
      obj = deepMerge(obj, payload, this.config.dateFields)
    }

    return usePromise ? Promise.resolve(obj) : obj
  }

  get<D, Q extends boolean> (message: string, data: D | undefined, promise: Q): Resolved<Q, BaseResponse & DataPart<D>>
  get<D = undefined> (message: string, data?: D): Resolved<P, BaseResponse & DataPart<D>>
  get (message: string, data?: unknown, promise?: boolean): unknown {
    const usePromise = promise ?? this.config.promise
    return this.response(message + this.config.get.ok, data, false, this.config.ok.status, usePromise)
  }

  success<D, Q extends boolean> (message: string, data: D | undefined, promise: Q): Resolved<Q, TypedResponse & DataPart<D>>
  success<D = undefined> (message: string, data?: D): Resolved<P, TypedResponse & DataPart<D>>
  success (message: string, data?: unknown, promise?: boolean): unknown {
    const usePromise = promise ?? this.config.promise
    return this.response(message + this.config.ok.suffix, data, this.config.types.ok, this.config.ok.status, usePromise)
  }

  error<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  error (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  error (message: string, error?: ErrorInput, promise?: boolean): unknown {
    const usePromise = promise ?? this.config.promise
    return this.response(
      message + this.config.ko.suffix, parseErrors(error, this.config.debug), this.config.types.ko, this.config.ko.status, usePromise
    )
  }

  warning<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  warning (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  warning (message: string, error?: ErrorInput, promise?: boolean): unknown {
    const usePromise = promise ?? this.config.promise
    return this.response(
      message + this.config.warn.suffix, parseErrors(error, this.config.debug), this.config.types.warn, this.config.warn.status, usePromise
    )
  }

  notFound<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  notFound (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  notFound (message: string, error?: ErrorInput, promise?: boolean): unknown {
    const usePromise = promise ?? this.config.promise
    return this.response(
      message + this.config.notFound.suffix, parseErrors(error, this.config.debug), this.config.types.notFound, this.config.notFound.status, usePromise
    )
  }
}
