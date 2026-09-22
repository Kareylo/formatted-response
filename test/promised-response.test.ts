import { describe, expect, it } from 'vitest'
import { FormattedResponse } from '../src/formatted-response.js'

describe('Promised Response Object', () => {
  let Response = new FormattedResponse({ promise: true })

  describe('#response method', () => {
    it('with \'data\' index', async () => {
      const expected = {
        status: 200,
        message: 'WITH.DATA',
        type: 'success',
        data: { text: 'test' }
      }
      expect(await Response.response('WITH.DATA', { text: 'test' }, 'success', 200)).toEqual(expected)
      expect(await Response.response('WITH.DATA', { data: { text: 'test' } }, 'success', 200)).toEqual(expected)
    })

    it('without \'data\' index', async () => {
      const expected = {
        status: 200,
        message: 'WITHOUT.DATA',
        type: 'success'
      }
      expect(await Response.response('WITHOUT.DATA', {}, 'success', 200)).toEqual(expected)
      expect(await Response.response('WITHOUT.DATA', null, 'success', 200)).toEqual(expected)
      expect(await Response.response('WITHOUT.DATA', undefined, 'success', 200)).toEqual(expected)
      expect(await Response.response('WITHOUT.DATA', false, 'success', 200)).toEqual(expected)
      expect(await Response.response('WITHOUT.DATA', 0, 'success', 200)).toEqual(expected)
    })
  })

  describe('#get method', () => {
    it('with \'data\' index', async () => {
      const expected = Response.response('WITH.DATA.GET.OK', { data: { text: 'test' } }, undefined, 200, false)
      expect(await Response.get('WITH.DATA', { text: 'test' })).toEqual(expected)
      expect(await Response.get('WITH.DATA', { data: { text: 'test' } })).toEqual(expected)
    })

    it('without \'data\' index', async () => {
      const expected = Response.response('WITHOUT.DATA.GET.OK', undefined, undefined, 200, false)
      expect(await Response.get('WITHOUT.DATA', undefined)).toEqual(expected)
    })
  })

  describe('#success method', () => {
    it('with \'data\' index', async () => {
      const expected = Response.response('WITH.DATA.OK', { data: { text: 'test' } }, Response.config.types.ok, 200, false)
      expect(await Response.success('WITH.DATA', { text: 'test' })).toEqual(expected)
      expect(await Response.success('WITH.DATA', { data: { text: 'test' } })).toEqual(expected)
    })

    it('without \'data\' index', async () => {
      const expected = Response.response('WITHOUT.DATA.OK', undefined, Response.config.types.ok, 200, false)
      expect(await Response.success('WITHOUT.DATA', undefined)).toEqual(expected)
    })
  })

  describe('#error method', () => {
    it('with debug: true', async () => {
      Response = new FormattedResponse({ debug: true })
      const expected = Response.response('WITH.DATA.KO', { error: 'Test error' }, Response.config.types.ko, 400, false)
      expect(await Response.error('WITH.DATA', new Error('Test error'))).toEqual(expected)
    })

    it('with debug: false', async () => {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.KO', undefined, Response.config.types.ko, 400, false)
      expect(await Response.error('WITHOUT.DATA', new Error('Test error'))).toEqual(expected)
    })
  })

  describe('#warning method', () => {
    it('with debug: true', async () => {
      Response = new FormattedResponse({ debug: true })
      const expected = Response.response('WITH.DATA.WARN', { error: 'Test error' }, Response.config.types.warn, 403, false)
      expect(await Response.warning('WITH.DATA', new Error('Test error'))).toEqual(expected)
    })

    it('with debug: false', async () => {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.WARN', undefined, Response.config.types.warn, 403, false)
      expect(await Response.warning('WITHOUT.DATA', new Error('Test error'))).toEqual(expected)
    })
  })

  describe('#notFound method', () => {
    it('with debug: true', async () => {
      Response = new FormattedResponse({ debug: true })
      const expected = Response.response('WITH.DATA.ERROR', { error: 'Test error' }, Response.config.types.notFound, 404, false)
      expect(await Response.notFound('WITH.DATA', new Error('Test error'))).toEqual(expected)
    })

    it('with debug: false', async () => {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.ERROR', undefined, Response.config.types.notFound, 404, false)
      expect(await Response.notFound('WITHOUT.DATA', new Error('Test error'))).toEqual(expected)
    })
  })
})
