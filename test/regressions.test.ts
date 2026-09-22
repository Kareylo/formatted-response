import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from '../src/defaults.js'
import { FormattedResponse } from '../src/formatted-response.js'
import FormattedResponseDefault from '../src/index.js'
import { deepMerge } from '../src/internal/merge.js'

describe('v1 regressions', () => {
  it('(a) does not mutate the caller data object', () => {
    const R = new FormattedResponse({ promise: false })
    const payload = { created_at: new Date('2020-01-01T00:00:00Z'), name: 'x' }
    const out = R.success('M', payload)
    expect(payload.created_at).toBeInstanceOf(Date)
    expect(out.data.created_at).toBe('2020-01-01T00:00:00.000Z')
  })

  it('(b) does not throw on a plain object at a dateFields key', () => {
    const R = new FormattedResponse({ promise: false })
    expect(() => R.success('M', { created_at: { nested: 1 } })).not.toThrow()
    expect(R.success('M', { created_at: { nested: 1 } }).data).toEqual({ created_at: { nested: 1 } })
  })

  it('(c) _promise is gone', () => {
    expect((new FormattedResponse() as unknown as Record<string, unknown>)._promise).toBeUndefined()
  })

  it('(e) dateFields is not aliased to the defaults or to the caller config', () => {
    const cfg = { promise: false as const, dateFields: ['created'] }
    const R = new FormattedResponse(cfg)
    expect(R.config.dateFields).not.toBe(cfg.dateFields)
    expect(new FormattedResponse().config.dateFields).not.toBe(DEFAULT_CONFIG.dateFields)
    R.config.dateFields.push('poisoned')
    expect(DEFAULT_CONFIG.dateFields).not.toContain('poisoned')
    expect(cfg.dateFields).not.toContain('poisoned')
  })

  it('(f) preserves non-plain objects at non-dateFields keys', () => {
    const R = new FormattedResponse({ promise: false })
    const when = new Date('2020-01-01T00:00:00Z')
    const map = new Map([['a', 1]])
    const buf = Buffer.from('hi')
    const out = R.success('M', { when, map, buf })
    expect(out.data.when).toBe(when)
    expect(out.data.map).toBe(map)
    expect(out.data.buf).toBe(buf)
    expect(() => JSON.stringify(out)).not.toThrow()
  })

  it('keeps the no-new call shape and instanceof', () => {
    const R = FormattedResponseDefault({ promise: false })
    expect(R).toBeInstanceOf(FormattedResponseDefault)
    expect(R.success('X')).toEqual({ status: 200, message: 'X.OK', type: 'success' })
  })

  it('preserves the quirky error payload placement', () => {
    expect(new FormattedResponse({ promise: false }).error('E', { errors: [{ f: 'a' }] }))
      .toEqual({ status: 400, message: 'E.KO', type: 'error', data: { errors: [{ f: 'a' }] } })
  })

  it('a debug-mode error carries both `error` and `errors` at the top level', () => {
    const err = Object.assign(new Error('boom'), { errors: [{ f: 'a' }] })
    expect(new FormattedResponse({ promise: false, debug: true }).error('E', err))
      .toEqual({ status: 400, message: 'E.KO', type: 'error', error: 'boom', errors: [{ f: 'a' }] })
  })

  it('error()/warning()/notFound() tolerate a missing error argument', () => {
    const R = new FormattedResponse({ promise: false, debug: true })
    expect(R.error('E')).toEqual({ status: 400, message: 'E.KO', type: 'error' })
    expect(R.warning('E')).toEqual({ status: 403, message: 'E.WARN', type: 'warning' })
    expect(R.notFound('E')).toEqual({ status: 404, message: 'E.ERROR', type: 'error' })
  })

  it('FormattedResponse.sync() and .async() pin the flag at runtime, not just in types', () => {
    const S = FormattedResponse.sync({ debug: true })
    expect(S.config.promise).toBe(false)
    expect(S.success('X')).toEqual({ status: 200, message: 'X.OK', type: 'success' })

    const A = FormattedResponse.async({ debug: true })
    expect(A.config.promise).toBe(true)
    return A.success('X').then((result) => {
      expect(result).toEqual({ status: 200, message: 'X.OK', type: 'success' })
    })
  })

  it('deepMerge is a no-op when the source is not a plain object', () => {
    const target = { a: 1 }
    expect(deepMerge(target, null)).toBe(target)
    expect(deepMerge(target, 'not an object')).toBe(target)
    expect(deepMerge(target, [1, 2, 3])).toBe(target)
    expect(target).toEqual({ a: 1 })
  })
})
