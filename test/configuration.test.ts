import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from '../src/defaults.js'
import { FormattedResponse } from '../src/formatted-response.js'

describe('Configuration', () => {
  it('should return the default configuration', () => {
    expect(new FormattedResponse({}).config).toEqual(DEFAULT_CONFIG)
    expect(new FormattedResponse().config).toEqual(DEFAULT_CONFIG)
    expect(new FormattedResponse(undefined).config).toEqual(DEFAULT_CONFIG)
    expect(new FormattedResponse(null).config).toEqual(DEFAULT_CONFIG)
  })

  it('should deep merge the given config with the default config', () => {
    let config: Record<string, unknown> = {
      dateFields: ['created', 'locked']
    }

    let expected = {
      debug: false,
      promise: true,
      types: { ok: 'success', ko: 'error', warn: 'warning', notFound: 'error' },
      get: { ok: '.GET.OK', ko: '.GET.KO', warn: '.GET.WARN' },
      ok: { status: 200, suffix: '.OK' },
      ko: { status: 400, suffix: '.KO' },
      warn: { status: 403, suffix: '.WARN' },
      notFound: { status: 404, suffix: '.ERROR' },
      auth: { error: { status: 401, suffix: '.KO' }, success: { status: 200, suffix: '.OK' } },
      dateFields: ['created', 'locked']
    }

    expect(new FormattedResponse(config).config).toEqual(expected)

    config = {
      debug: true,
      dateFields: ['created', 'locked'],
      ok: { status: 318, suffix: 'TEAPOT' }
    }

    expected = {
      debug: true,
      promise: true,
      types: { ok: 'success', ko: 'error', warn: 'warning', notFound: 'error' },
      get: { ok: '.GET.OK', ko: '.GET.KO', warn: '.GET.WARN' },
      ok: { status: 318, suffix: 'TEAPOT' },
      ko: { status: 400, suffix: '.KO' },
      warn: { status: 403, suffix: '.WARN' },
      notFound: { status: 404, suffix: '.ERROR' },
      auth: { error: { status: 401, suffix: '.KO' }, success: { status: 200, suffix: '.OK' } },
      dateFields: ['created', 'locked']
    }

    expect(new FormattedResponse(config).config).toEqual(expected)
    expect(new FormattedResponse().config).toEqual(DEFAULT_CONFIG)
  })
})
