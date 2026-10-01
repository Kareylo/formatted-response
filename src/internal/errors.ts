import type { ErrorInput } from '../types.js'

export interface ParsedError {
  error?: string
  errors?: unknown
}

export function parseErrors (error: ErrorInput, debug: boolean, exposeErrors: boolean): ParsedError {
  const parsed: ParsedError = {}
  if (!error) return parsed

  if (error.message && debug) {
    parsed.error = error.message
  }
  if ((debug || exposeErrors) && 'errors' in error && error.errors !== undefined) {
    parsed.errors = error.errors
  }
  return parsed
}
