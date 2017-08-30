/* eslint-disable no-undef */
const FormattedResponse = require('../response')
let Response = new FormattedResponse({promise: false})
const assert = require('assert')

describe('Response Object', function () {
  describe('#response method', function () {
    it(`with 'data' index`, function () {
      const expected = {
        status: 200,
        message: 'WITH.DATA',
        type: 'success',
        data: {text: 'test'}
      }
      assert.deepEqual(Response.response('WITH.DATA', {text: 'test'}, 'success', 200), expected)

      assert.deepEqual(Response.response('WITH.DATA', {data: {text: 'test'}}, 'success', 200), expected)
    })

    it(`without 'data' index`, function () {
      const expected = {
        status: 200,
        message: 'WITHOUT.DATA',
        type: 'success'
      }
      assert.deepEqual(Response.response('WITHOUT.DATA', {}, 'success', 200), expected)

      assert.deepEqual(Response.response('WITHOUT.DATA', null, 'success', 200), expected)

      assert.deepEqual(Response.response('WITHOUT.DATA', undefined, 'success', 200), expected)

      assert.deepEqual(Response.response('WITHOUT.DATA', false, 'success', 200), expected)

      assert.deepEqual(Response.response('WITHOUT.DATA', 0, 'success', 200), expected)
    })
  })

  describe('#get method', function () {
    it(`with 'data' index`, function () {
      const expected = Response.response('WITH.DATA.GET.OK', {data: {text: 'test'}}, undefined, 200)
      assert.deepEqual(Response.get('WITH.DATA', {text: 'test'}), expected)

      assert.deepEqual(Response.get('WITH.DATA', {data: {text: 'test'}}), expected)
    })

    it(`without 'data' index`, function () {
      const expected = Response.response('WITHOUT.DATA.GET.OK', undefined, undefined, 200)
      assert.deepEqual(Response.get('WITHOUT.DATA', undefined), expected)
    })
  })

  describe('#success method', function () {
    it(`with 'data' index`, function () {
      const expected = Response.response('WITH.DATA.OK', {data: {text: 'test'}}, Response.config.types.ok, 200)
      assert.deepEqual(Response.success('WITH.DATA', {text: 'test'}), expected)

      assert.deepEqual(Response.success('WITH.DATA', {data: {text: 'test'}}), expected)
    })

    it(`without 'data' index`, function () {
      const expected = Response.response('WITHOUT.DATA.OK', undefined, Response.config.types.ok, 200)
      assert.deepEqual(Response.success('WITHOUT.DATA', undefined), expected)
    })
  })

  describe('#get method', function () {
    it(`with 'data' index`, function () {
      const expected = Response.response('WITH.DATA.GET.OK', {data: {text: 'test'}}, undefined, 200)
      assert.deepEqual(Response.get('WITH.DATA', {text: 'test'}), expected)

      assert.deepEqual(Response.get('WITH.DATA', {data: {text: 'test'}}), expected)
    })

    it(`without 'data' index`, function () {
      const expected = Response.response('WITHOUT.DATA.GET.OK', undefined, undefined, 200)
      assert.deepEqual(Response.get('WITHOUT.DATA', undefined), expected)
    })
  })

  describe('#error method', function () {
    it(`with debug: true`, function () {
      Response = new FormattedResponse({debug: true})
      const expected = Response.response('WITH.DATA.KO', {error: 'Test error'}, Response.config.types.ko, 400)
      assert.deepEqual(Response.error('WITH.DATA', new Error('Test error')), expected)
    })

    it(`with debug: false`, function () {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.KO', undefined, Response.config.types.ko, 400)
      assert.deepEqual(Response.error('WITHOUT.DATA', new Error('Test error')), expected)
    })
  })

  describe('#warning method', function () {
    it(`with debug: true`, function () {
      Response = new FormattedResponse({debug: true})
      const expected = Response.response('WITH.DATA.WARN', {error: 'Test error'}, Response.config.types.warn, 403)
      assert.deepEqual(Response.warning('WITH.DATA', new Error('Test error')), expected)
    })

    it(`with debug: false`, function () {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.WARN', undefined, Response.config.types.warn, 403)
      assert.deepEqual(Response.warning('WITHOUT.DATA', new Error('Test error')), expected)
    })
  })

  describe('#notFound method', function () {
    it(`with debug: true`, function () {
      Response = new FormattedResponse({debug: true})
      const expected = Response.response('WITH.DATA.ERROR', {error: 'Test error'}, Response.config.types.notFound, 404)
      assert.deepEqual(Response.notFound('WITH.DATA', new Error('Test error')), expected)
    })

    it(`with debug: false`, function () {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.ERROR', undefined, Response.config.types.notFound, 404)
      assert.deepEqual(Response.notFound('WITHOUT.DATA', new Error('Test error')), expected)
    })
  })
})
