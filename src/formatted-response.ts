import { DEFAULT_CONFIG } from './defaults.js'
import { defaultSuffix, HttpStatus } from './http-status.js'
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
  StatusResponse,
  TypedResponse
} from './types.js'

export class FormattedResponse<P extends boolean = true> {
  readonly config: FormattedResponseConfig

  static readonly defaults: Readonly<FormattedResponseConfig> = DEFAULT_CONFIG

  /** Status codes by registry name: `FormattedResponse.HttpStatus.CREATED === 201`. */
  static readonly HttpStatus = HttpStatus

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

  /**
   * Any status code from 100 to 599. The suffix and `type` come from
   * `config.statuses[code]`, else from the IANA name (`.CONFLICT`) and the
   * code class (`types.ok` below 400, `types.ko` from 400 up). From 400 up,
   * the third argument is parsed as an error, exactly like `error()`.
   */
  status<Q extends boolean> (code: number, message: string, data: unknown, promise: Q): Resolved<Q, StatusResponse>
  status (code: number, message: string, data?: unknown): Resolved<P, StatusResponse>
  status (code: number, message: string, data?: unknown, promise?: boolean): unknown {
    if (!Number.isInteger(code) || code < 100 || code > 599) {
      throw new RangeError(`Invalid HTTP status code: ${String(code)}`)
    }
    const usePromise = promise ?? this.config.promise
    const override = this.config.statuses?.[code]
    const isError = code >= 400
    const suffix = override?.suffix ?? defaultSuffix(code)
    const type = override?.type ?? (isError ? this.config.types.ko : this.config.types.ok)
    const payload = isError
      ? parseErrors(typeof data === 'object' ? data : undefined, this.config.debug)
      : data
    return this.response(message + suffix, payload, type, code, usePromise)
  }

  created<D, Q extends boolean> (message: string, data: D | undefined, promise: Q): Resolved<Q, TypedResponse & DataPart<D>>
  created<D = undefined> (message: string, data?: D): Resolved<P, TypedResponse & DataPart<D>>
  created (message: string, data?: unknown, promise?: boolean): unknown {
    return this.status(HttpStatus.CREATED, message, data, promise ?? this.config.promise)
  }

  accepted<D, Q extends boolean> (message: string, data: D | undefined, promise: Q): Resolved<Q, TypedResponse & DataPart<D>>
  accepted<D = undefined> (message: string, data?: D): Resolved<P, TypedResponse & DataPart<D>>
  accepted (message: string, data?: unknown, promise?: boolean): unknown {
    return this.status(HttpStatus.ACCEPTED, message, data, promise ?? this.config.promise)
  }

  noContent<D, Q extends boolean> (message: string, data: D | undefined, promise: Q): Resolved<Q, TypedResponse & DataPart<D>>
  noContent<D = undefined> (message: string, data?: D): Resolved<P, TypedResponse & DataPart<D>>
  noContent (message: string, data?: unknown, promise?: boolean): unknown {
    return this.status(HttpStatus.NO_CONTENT, message, data, promise ?? this.config.promise)
  }

  badRequest<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  badRequest (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  badRequest (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.BAD_REQUEST, message, error, promise ?? this.config.promise)
  }

  unauthorized<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  unauthorized (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  unauthorized (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.UNAUTHORIZED, message, error, promise ?? this.config.promise)
  }

  forbidden<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  forbidden (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  forbidden (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.FORBIDDEN, message, error, promise ?? this.config.promise)
  }

  conflict<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  conflict (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  conflict (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.CONFLICT, message, error, promise ?? this.config.promise)
  }

  unprocessableContent<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  unprocessableContent (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  unprocessableContent (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.UNPROCESSABLE_CONTENT, message, error, promise ?? this.config.promise)
  }

  tooManyRequests<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  tooManyRequests (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  tooManyRequests (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.TOO_MANY_REQUESTS, message, error, promise ?? this.config.promise)
  }

  internalServerError<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  internalServerError (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  internalServerError (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.INTERNAL_SERVER_ERROR, message, error, promise ?? this.config.promise)
  }

  serviceUnavailable<Q extends boolean> (message: string, error: ErrorInput, promise: Q): Resolved<Q, ErrorResponse>
  serviceUnavailable (message: string, error?: ErrorInput): Resolved<P, ErrorResponse>
  serviceUnavailable (message: string, error?: ErrorInput, promise?: boolean): unknown {
    return this.status(HttpStatus.SERVICE_UNAVAILABLE, message, error, promise ?? this.config.promise)
  }
}
