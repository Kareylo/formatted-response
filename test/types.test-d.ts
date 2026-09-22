import { describe, expectTypeOf, it } from 'vitest'
import FormattedResponse from '../src/index.js'
import type { FormattedResponseOptions, TypedResponse } from '../src/types.js'

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
