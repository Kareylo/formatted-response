/* eslint-disable no-undef */
const assert = require('assert')
const FormattedResponse = require('../response')
const CONFIG = require('../config')

describe('Configuration', function () {
  it('should return the default configuration', function () {
    const _config = {}
    let Response

    Response = new FormattedResponse(_config)
    assert.deepEqual(Response.config, CONFIG)

    Response = new FormattedResponse()
    assert.deepEqual(Response.config, CONFIG)

    Response = new FormattedResponse(undefined)
    assert.deepEqual(Response.config, CONFIG)

    Response = new FormattedResponse(null)
    assert.deepEqual(Response.config, CONFIG)
  })

  it('should deep merge the given config with the default config', function () {
    let _config
    let expected
    let Response

    _config = {
      dateFields: ['created', 'locked']
    }

    expected = {
      debug: false,
      promise: true,
      types: {ok: 'success', ko: 'error', warn: 'warning', notFound: 'error'},
      get: {ok: '.GET.OK', ko: '.GET.KO', warn: '.GET.WARN'},
      ok: {status: 200, suffix: '.OK'},
      ko: {status: 400, suffix: '.KO'},
      warn: {status: 403, suffix: '.WARN'},
      notFound: {status: 404, suffix: '.ERROR'},
      auth: {error: {status: 401, suffix: '.KO'}, success: {status: 200, suffix: '.OK'}},
      dateFields: ['created', 'locked']
    }

    Response = new FormattedResponse(_config)
    assert.deepEqual(Response.config, expected)

    _config = {
      debug: true,
      dateFields: ['created', 'locked'],
      ok: {status: 318, suffix: 'TEAPOT'}
    }

    expected = {
      debug: true,
      promise: true,
      types: {ok: 'success', ko: 'error', warn: 'warning', notFound: 'error'},
      get: {ok: '.GET.OK', ko: '.GET.KO', warn: '.GET.WARN'},
      ok: {status: 318, suffix: 'TEAPOT'},
      ko: {status: 400, suffix: '.KO'},
      warn: {status: 403, suffix: '.WARN'},
      notFound: {status: 404, suffix: '.ERROR'},
      auth: {error: {status: 401, suffix: '.KO'}, success: {status: 200, suffix: '.OK'}},
      dateFields: ['created', 'locked']
    }

    Response = new FormattedResponse(_config)
    assert.deepEqual(Response.config, expected)

    Response = new FormattedResponse()
    assert.deepEqual(Response.config, CONFIG)
  })
})
