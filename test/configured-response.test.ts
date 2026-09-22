import { describe, expect, it } from 'vitest'
import { FormattedResponse } from '../src/formatted-response.js'

describe('Configured Response Object', () => {
  const baseConfig = {
    promise: false as const,
    types: {
      ok: 'alert-success',
      ko: 'alert-danger',
      warn: 'alert-warning',
      notFound: 'alert-notFound'
    },
    dateFields: ['created', 'updated']
  }
  let Response = new FormattedResponse(baseConfig)

  describe('#response method', () => {
    it('with \'data\' index', () => {
      const expected = {
        status: 200,
        message: 'WITH.DATA',
        type: 'success',
        data: { text: 'test' }
      }
      expect(Response.response('WITH.DATA', { text: 'test' }, 'success', 200)).toEqual(expected)
      expect(Response.response('WITH.DATA', { data: { text: 'test' } }, 'success', 200)).toEqual(expected)
    })

    it('without \'data\' index', () => {
      const expected = {
        status: 200,
        message: 'WITHOUT.DATA',
        type: 'success'
      }
      expect(Response.response('WITHOUT.DATA', {}, 'success', 200)).toEqual(expected)
      expect(Response.response('WITHOUT.DATA', null, 'success', 200)).toEqual(expected)
      expect(Response.response('WITHOUT.DATA', undefined, 'success', 200)).toEqual(expected)
      expect(Response.response('WITHOUT.DATA', false, 'success', 200)).toEqual(expected)
      expect(Response.response('WITHOUT.DATA', 0, 'success', 200)).toEqual(expected)
    })
  })

  describe('#get method', () => {
    it('with \'data\' index', () => {
      const expected = Response.response('WITH.DATA.GET.OK', { data: { text: 'test' } }, undefined, 200)
      expect(Response.get('WITH.DATA', { text: 'test' })).toEqual(expected)
      expect(Response.get('WITH.DATA', { data: { text: 'test' } })).toEqual(expected)
    })

    it('without \'data\' index', () => {
      const expected = Response.response('WITHOUT.DATA.GET.OK', undefined, undefined, 200)
      expect(Response.get('WITHOUT.DATA', undefined)).toEqual(expected)
    })
  })

  describe('#success method', () => {
    it('with \'data\' index', () => {
      const expected = Response.response('WITH.DATA.OK', { data: { text: 'test' } }, Response.config.types.ok, 200)
      expect(Response.success('WITH.DATA', { text: 'test' })).toEqual(expected)
      expect(Response.success('WITH.DATA', { data: { text: 'test' } })).toEqual(expected)
    })

    it('without \'data\' index', () => {
      const expected = Response.response('WITHOUT.DATA.OK', undefined, Response.config.types.ok, 200)
      expect(Response.success('WITHOUT.DATA', undefined)).toEqual(expected)
    })
  })

  describe('#error method', () => {
    it('with debug: true', () => {
      Response = new FormattedResponse({ ...baseConfig, debug: true })
      const expected = Response.response('WITH.DATA.KO', { error: 'Test error' }, Response.config.types.ko, 400)
      expect(Response.error('WITH.DATA', new Error('Test error'))).toEqual(expected)
    })

    it('with debug: false', () => {
      Response = new FormattedResponse(baseConfig)
      const expected = Response.response('WITHOUT.DATA.KO', undefined, Response.config.types.ko, 400)
      expect(Response.error('WITHOUT.DATA', new Error('Test error'))).toEqual(expected)
    })
  })

  describe('#warning method', () => {
    it('with debug: true', () => {
      Response = new FormattedResponse({ ...baseConfig, debug: true })
      const expected = Response.response('WITH.DATA.WARN', { error: 'Test error' }, Response.config.types.warn, 403)
      expect(Response.warning('WITH.DATA', new Error('Test error'))).toEqual(expected)
    })

    it('with debug: false', () => {
      Response = new FormattedResponse(baseConfig)
      const expected = Response.response('WITHOUT.DATA.WARN', undefined, Response.config.types.warn, 403)
      expect(Response.warning('WITHOUT.DATA', new Error('Test error'))).toEqual(expected)
    })
  })

  describe('#notFound method', () => {
    it('with debug: true', () => {
      Response = new FormattedResponse({ ...baseConfig, debug: true })
      const expected = Response.response('WITH.DATA.ERROR', { error: 'Test error' }, Response.config.types.notFound, 404)
      expect(Response.notFound('WITH.DATA', new Error('Test error'))).toEqual(expected)
    })

    it('with debug: false', () => {
      Response = new FormattedResponse(baseConfig)
      const expected = Response.response('WITHOUT.DATA.ERROR', undefined, Response.config.types.notFound, 404)
      expect(Response.notFound('WITHOUT.DATA', new Error('Test error'))).toEqual(expected)
    })
  })
})
