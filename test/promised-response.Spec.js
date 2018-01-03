/* eslint-disable no-undef */
const FormattedResponse = require('../response')
let Response = new FormattedResponse({promise: true})
const assert = require('assert')

describe('Promised Response Object', function () {
  describe('#response method', function () {
    it(`with 'data' index`, function () {
      const expected = {
        status: 200,
        message: 'WITH.DATA',
        type: 'success',
        data: {text: 'test'}
      }
      return Response.response('WITH.DATA', {text: 'test'}, 'success', 200)
        .then(resp => {
          assert.deepEqual(resp, expected)
          return Response.response('WITH.DATA', {data: {text: 'test'}}, 'success', 200)
        })
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })

    it(`without 'data' index`, function () {
      const expected = {
        status: 200,
        message: 'WITHOUT.DATA',
        type: 'success'
      }
      return Response.response('WITHOUT.DATA', {}, 'success', 200)
        .then(resp => {
          assert.deepEqual(resp, expected)
          return Response.response('WITHOUT.DATA', null, 'success', 200)
        })
        .then(resp => {
          assert.deepEqual(resp, expected)
          return Response.response('WITHOUT.DATA', undefined, 'success', 200)
        })
        .then(resp => {
          assert.deepEqual(resp, expected)
          return Response.response('WITHOUT.DATA', false, 'success', 200)
        })
        .then(resp => {
          assert.deepEqual(resp, expected)
          return Response.response('WITHOUT.DATA', 0, 'success', 200)
        })
    })
  })

  describe('#get method', function () {
    it(`with 'data' index`, function () {
      const expected = Response.response('WITH.DATA.GET.OK', {data: {text: 'test'}}, undefined, 200, false)
      return Response.get('WITH.DATA', {text: 'test'})
        .then(resp => {
          assert.deepEqual(resp, expected)
          return Response.get('WITH.DATA', {data: {text: 'test'}})
        })
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })

    it(`without 'data' index`, function () {
      const expected = Response.response('WITHOUT.DATA.GET.OK', undefined, undefined, 200, false)
      return Response.get('WITHOUT.DATA', undefined)
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })
  })

  describe('#success method', function () {
    it(`with 'data' index`, function () {
      const expected = Response.response('WITH.DATA.OK', {data: {text: 'test'}}, Response.config.types.ok, 200, false)
      return Response.success('WITH.DATA', {text: 'test'})
        .then(resp => {
          assert.deepEqual(resp, expected)
          return Response.success('WITH.DATA', {data: {text: 'test'}})
        })
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })

    it(`without 'data' index`, function () {
      const expected = Response.response('WITHOUT.DATA.OK', undefined, Response.config.types.ok, 200, false)
      return Response.success('WITHOUT.DATA', undefined)
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })
  })

  describe('#error method', function () {
    it(`with debug: true`, function () {
      Response = new FormattedResponse({debug: true})
      const expected = Response.response('WITH.DATA.KO', {error: 'Test error'}, Response.config.types.ko, 400, false)
      return Response.error('WITH.DATA', new Error('Test error'))
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })

    it(`with debug: false`, function () {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.KO', undefined, Response.config.types.ko, 400, false)
      return Response.error('WITHOUT.DATA', new Error('Test error'))
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })
  })

  describe('#warning method', function () {
    it(`with debug: true`, function () {
      Response = new FormattedResponse({debug: true})
      const expected = Response.response('WITH.DATA.WARN', {error: 'Test error'}, Response.config.types.warn, 403, false)
      return Response.warning('WITH.DATA', new Error('Test error'))
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })

    it(`with debug: false`, function () {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.WARN', undefined, Response.config.types.warn, 403, false)
      return Response.warning('WITHOUT.DATA', new Error('Test error'))
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })
  })

  describe('#notFound method', function () {
    it(`with debug: true`, function () {
      Response = new FormattedResponse({debug: true})
      const expected = Response.response('WITH.DATA.ERROR', {error: 'Test error'}, Response.config.types.notFound, 404, false)
      return Response.notFound('WITH.DATA', new Error('Test error'))
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })

    it(`with debug: false`, function () {
      Response = new FormattedResponse()
      const expected = Response.response('WITHOUT.DATA.ERROR', undefined, Response.config.types.notFound, 404, false)
      return Response.notFound('WITHOUT.DATA', new Error('Test error'))
        .then(resp => {
          assert.deepEqual(resp, expected)
        })
    })
  })
})
