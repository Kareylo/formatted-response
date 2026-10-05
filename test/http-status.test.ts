import { describe, expect, it } from 'vitest'
import { FormattedResponse } from '../src/formatted-response.js'
import { defaultSuffix, HttpStatus } from '../src/http-status.js'
import FormattedResponseDefault from '../src/index.js'

describe('HTTP status codes', () => {
  const R = new FormattedResponse({ promise: false })

  describe('HttpStatus table', () => {
    it('is exposed on the class and on the default export', () => {
      expect(FormattedResponse.HttpStatus).toBe(HttpStatus)
      expect(FormattedResponseDefault.HttpStatus).toBe(HttpStatus)
    })

    it('maps every name to a unique code in 100–599', () => {
      const codes = Object.values(HttpStatus)
      expect(new Set(codes).size).toBe(codes.length)
      for (const code of codes) {
        expect(code).toBeGreaterThanOrEqual(100)
        expect(code).toBeLessThanOrEqual(599)
      }
    })

    it('derives the default suffix from the registry name', () => {
      expect(defaultSuffix(201)).toBe('.CREATED')
      expect(defaultSuffix(418)).toBe('.IM_A_TEAPOT')
      expect(defaultSuffix(306)).toBe('')
      expect(defaultSuffix(299)).toBe('')
    })
  })

  describe('#status method', () => {
    it('treats data as data below 400', () => {
      expect(R.status(201, 'USER', { id: 1 })).toEqual({
        status: 201, message: 'USER.CREATED', type: 'success', data: { id: 1 }
      })
      expect(R.status(302, 'MOVED')).toEqual({ status: 302, message: 'MOVED.FOUND', type: 'success' })
      expect(R.status(100, 'GO')).toEqual({ status: 100, message: 'GO.CONTINUE', type: 'success' })
    })

    it('treats data as an error from 400 up', () => {
      const err = new Error('boom')
      expect(R.status(409, 'USER', err)).toEqual({ status: 409, message: 'USER.CONFLICT', type: 'error' })
      const D = new FormattedResponse({ debug: true, promise: false })
      expect(D.status(500, 'USER', err)).toEqual({
        status: 500, message: 'USER.INTERNAL_SERVER_ERROR', type: 'error', error: 'boom'
      })
    })

    it('ignores a non-object error argument from 400 up', () => {
      expect(R.status(400, 'X', 'oops')).toEqual({ status: 400, message: 'X.BAD_REQUEST', type: 'error' })
    })

    it('accepts an unregistered code with no suffix', () => {
      expect(R.status(299, 'X')).toEqual({ status: 299, message: 'X', type: 'success' })
      expect(R.status(599, 'X')).toEqual({ status: 599, message: 'X', type: 'error' })
    })

    it('throws on a code outside 100–599', () => {
      expect(() => R.status(99, 'X')).toThrow(RangeError)
      expect(() => R.status(600, 'X')).toThrow(RangeError)
      expect(() => R.status(200.5, 'X')).toThrow(RangeError)
      expect(() => R.status(Number.NaN, 'X')).toThrow(RangeError)
    })

    it('uses the configured types', () => {
      const T = new FormattedResponse({ promise: false, types: { ok: 'alert-success', ko: 'alert-danger' } })
      expect(T.status(202, 'X').type).toBe('alert-success')
      expect(T.status(503, 'X').type).toBe('alert-danger')
    })

    it('applies per-code overrides from config.statuses', () => {
      const O = new FormattedResponse({
        promise: false,
        statuses: { 409: { suffix: '.TAKEN' }, 429: { type: 'warning' } }
      })
      expect(O.status(409, 'EMAIL')).toEqual({ status: 409, message: 'EMAIL.TAKEN', type: 'error' })
      expect(O.tooManyRequests('API')).toEqual({ status: 429, message: 'API.TOO_MANY_REQUESTS', type: 'warning' })
    })

    it('honours the promise flag', async () => {
      const A = new FormattedResponse()
      await expect(A.status(201, 'X')).resolves.toEqual({ status: 201, message: 'X.CREATED', type: 'success' })
      expect(A.status(201, 'X', undefined, false)).toEqual({ status: 201, message: 'X.CREATED', type: 'success' })
    })
  })

  describe('named methods', () => {
    it.each([
      ['created', 201, '.CREATED'],
      ['accepted', 202, '.ACCEPTED'],
      ['noContent', 204, '.NO_CONTENT']
    ] as const)('%s() returns %i with data', (method, status, suffix) => {
      expect(R[method]('X', { a: 1 })).toEqual({ status, message: `X${suffix}`, type: 'success', data: { a: 1 } })
    })

    it.each([
      ['badRequest', 400, '.BAD_REQUEST'],
      ['unauthorized', 401, '.UNAUTHORIZED'],
      ['forbidden', 403, '.FORBIDDEN'],
      ['conflict', 409, '.CONFLICT'],
      ['unprocessableContent', 422, '.UNPROCESSABLE_CONTENT'],
      ['tooManyRequests', 429, '.TOO_MANY_REQUESTS'],
      ['internalServerError', 500, '.INTERNAL_SERVER_ERROR'],
      ['serviceUnavailable', 503, '.SERVICE_UNAVAILABLE']
    ] as const)('%s() returns %i with a parsed error', (method, status, suffix) => {
      const err = Object.assign(new Error('boom'), { errors: ['e'] })
      expect(R[method]('X', err)).toEqual({ status, message: `X${suffix}`, type: 'error', data: { errors: ['e'] } })
    })

    it('honours the promise override', async () => {
      await expect(R.created('X', undefined, true)).resolves.toEqual({ status: 201, message: 'X.CREATED', type: 'success' })
      await expect(R.conflict('X', null, true)).resolves.toEqual({ status: 409, message: 'X.CONFLICT', type: 'error' })
    })

    it('leaves the existing methods unchanged', () => {
      expect(R.error('X')).toEqual({ status: 400, message: 'X.KO', type: 'error' })
      expect(R.warning('X')).toEqual({ status: 403, message: 'X.WARN', type: 'warning' })
      expect(R.notFound('X')).toEqual({ status: 404, message: 'X.ERROR', type: 'error' })
    })
  })
})
