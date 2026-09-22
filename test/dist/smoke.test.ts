import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import esmDefault from '../../dist/index.js'

const require = createRequire(import.meta.url)
const cjs = require('../../dist/index.cjs')

describe('built output', () => {
  it('CJS require() returns the constructor itself, not { default }', () => {
    expect(typeof cjs).toBe('function')
    expect((cjs as { default?: unknown }).default).toBeUndefined()
    expect(cjs).not.toHaveProperty('__esModule')
  })

  it('CJS works with new — the v1 call shape', () => {
    const R = new (cjs as new (c: unknown) => { success: (m: string) => unknown })({ promise: false })
    expect(R.success('MY.DATA')).toEqual({ status: 200, message: 'MY.DATA.OK', type: 'success' })
  })

  it('CJS works without new — the v1 call shape', () => {
    const R = (cjs as (c: unknown) => { success: (m: string) => unknown })({ promise: false })
    expect(R.success('MY.DATA')).toEqual({ status: 200, message: 'MY.DATA.OK', type: 'success' })
    expect(R).toBeInstanceOf(cjs as new (c: unknown) => unknown)
  })

  it('ESM default import works', () => {
    expect(typeof esmDefault).toBe('function')
    const R = new esmDefault({ promise: false })
    expect(R.success('MY.DATA')).toEqual({ status: 200, message: 'MY.DATA.OK', type: 'success' })
  })

  it('ESM and CJS builds agree', () => {
    const a = new esmDefault({ promise: false }).error('X', new Error('e'))
    const b = new (cjs as new (c: unknown) => { error: (m: string, e: Error) => unknown })(
      { promise: false }
    ).error('X', new Error('e'))
    expect(a).toEqual(b)
  })

  it('deprecated ./config subpath still resolves', () => {
    const config = require('../../dist/config.cjs')
    expect(config).toMatchObject({ promise: true, debug: false })
  })
})
