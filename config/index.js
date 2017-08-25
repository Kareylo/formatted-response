'use strict'

module.exports = {
  debug: false,
  promise: true,
  types: {
    ok: 'success',
    ko: 'error',
    warn: 'warning'
  },
  get: {
    ok: '.GET.OK',
    ko: '.GET.KO',
    warn: '.GET.WARN'
  },
  ok: {
    status: 200,
    suffix: '.OK'
  },
  ko: {
    status: 400,
    suffix: '.KO'
  },
  warn: {
    status: 403,
    suffix: '.WARN'
  },
  auth: {
    error: {
      status: 401,
      suffix: '.KO'
    },
    success: {
      status: 200,
      suffix: '.OK'
    }
  },
  dateFields: ['created_at', 'created', 'updated_at', 'updated']
}
