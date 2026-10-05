import { describe, expectTypeOf, it } from 'vitest'
import FormattedResponse from '../src/index.js'
import type { ErrorResponse, FormattedResponseOptions, HttpStatusCode, StatusResponse, TypedResponse } from '../src/types.js'

describe('promise-flag inference', () => {
  it('defaults to Promise', () => {
    const R = new FormattedResponse()
    expectTypeOf(R.success('M')).toEqualTypeOf<Promise<TypedResponse>>()
  })

  it('infers false from a literal config', () => {
    const R = new FormattedResponse({ promise: false })
    expectTypeOf(R.success('M')).toEqualTypeOf<TypedResponse>()
    expectTypeOf(R.success('M', { a: 1 })).toEqualTypeOf<TypedResponse & { data: { a: number } }>()
  })

  it('stays Promise when the literal config omits `promise`', () => {
    const R = new FormattedResponse({ debug: true })
    expectTypeOf(R.success('M')).toEqualTypeOf<Promise<TypedResponse>>()
  })

  it('falls back to a union for a widened runtime config', () => {
    const cfg: FormattedResponseOptions = { promise: false }
    const R = new FormattedResponse(cfg)
    expectTypeOf(R.success('M')).toEqualTypeOf<TypedResponse | Promise<TypedResponse>>()
  })

  it('honours the per-call promise override in both directions', () => {
    const R = new FormattedResponse({ promise: false })
    expectTypeOf(R.success('M', undefined, true)).toEqualTypeOf<Promise<TypedResponse>>()
    const A = new FormattedResponse()
    expectTypeOf(A.success('M', undefined, false)).toEqualTypeOf<TypedResponse>()
  })

  it('static factories pin the flag at runtime', () => {
    const cfg: FormattedResponseOptions = { promise: false }
    expectTypeOf(FormattedResponse.sync(cfg).success('M')).toEqualTypeOf<TypedResponse>()
    expectTypeOf(FormattedResponse.async(cfg).success('M')).toEqualTypeOf<Promise<TypedResponse>>()
  })

  it('get() never carries a type field', () => {
    const R = new FormattedResponse({ promise: false })
    expectTypeOf(R.get('M')).not.toHaveProperty('type')
  })
})

describe('status methods', () => {
  it('named success methods carry typed data', () => {
    const R = new FormattedResponse({ promise: false })
    expectTypeOf(R.created('M', { id: 1 })).toEqualTypeOf<TypedResponse & { data: { id: number } }>()
    expectTypeOf(new FormattedResponse().noContent('M')).toEqualTypeOf<Promise<TypedResponse>>()
  })

  it('named error methods return ErrorResponse', () => {
    const R = new FormattedResponse({ promise: false })
    expectTypeOf(R.conflict('M', new Error('x'))).toEqualTypeOf<ErrorResponse>()
    expectTypeOf(R.conflict('M', null, true)).toEqualTypeOf<Promise<ErrorResponse>>()
  })

  it('status() follows the promise flag', () => {
    expectTypeOf(new FormattedResponse({ promise: false }).status(418, 'M')).toEqualTypeOf<StatusResponse>()
    expectTypeOf(new FormattedResponse().status(418, 'M')).toEqualTypeOf<Promise<StatusResponse>>()
  })

  it('exposes the HttpStatus table as literal types', () => {
    expectTypeOf(FormattedResponse.HttpStatus.CREATED).toEqualTypeOf<201>()
    expectTypeOf<HttpStatusCode>().toExtend<number>()
  })
})
