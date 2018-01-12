'use strict'

const _config = require('../config')

// const Promise = require('bluebird')

/**
 * Response Object
 * @param config
 * @constructor
 */
function Response (config) {
  if (!(this instanceof Response)) {
    return new Response(config)
  }

  this.config = {}
  this.ObjDeepMerge(this.config, _config, config)

  return this
}

Response.prototype = {

  /**
   * Check if item is an Object
   * @param item
   * @returns {*|boolean}
   */
  _isObject: function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item))
  },

  /**
   * Check if given item is a date
   * @param item
   * @param key
   * @return {boolean}
   */
  _isDate: function (item, key) {
    return typeof item[key] === 'object' && item[key] !== null && this.config.dateFields.indexOf(key) !== -1
  },

  /**
   * Deep Merge multiple objects
   * @param target
   * @param sources
   * @returns {*}
   * @constructor
   */
  ObjDeepMerge: function (target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()

    if (this._isObject(target) && this._isObject(source)) {
      for (const key in source) {
        if (this.config.dateFields && this._isDate(source, key)) {
          source[key] = source[key].toISOString() || source[key]
        }
        if (this._isObject(source[key])) {
          if (!target[key]) Object.assign(target, {[key]: {}})
          this.ObjDeepMerge(target[key], source[key])
        } else {
          Object.assign(target, {[key]: source[key]})
        }
      }
    }

    return this.ObjDeepMerge(target, ...sources)
  },

  /**
   * Create a promise with data
   * @param obj
   * @return {Promise}
   * @private
   */
  _promise: function (obj) {
    return new Promise((resolve, reject) => {
      try {
        resolve(obj)
      } catch (e) {
        reject(e)
      }
    })
    // return Promise.resolve(obj)
  },

  /**
   * Generate response with correct format as a Promise or an Object
   * @param message
   * @param data
   * @param type
   * @param status
   * @param promise
   * @return {*}
   */
  response: function (message, data, type, status, promise = this.config.promise) {
    let obj = {
      status: status,
      message: message
    }

    if (type) {
      obj.type = type
    }

    if (data && Object.keys(data).length > 0) {
      if (!data.data && !data.error) {
        data = {data: data}
      }
      obj = this.ObjDeepMerge(obj, data)
    }

    return promise ? Promise.resolve(obj) : obj
  },

  /**
   * Generate response for .GET. messages
   * @param message
   * @param data
   * @param promise
   * @return {*}
   */
  get: function (message, data, promise = this.config.promise) {
    return this.response(message + this.config.get.ok, data, false, this.config.ok.status, promise)
  },

  /**
   * Generate success response
   * @param message
   * @param data
   * @param promise
   * @return {*}
   */
  success: function (message, data, promise = this.config.promise) {
    return this.response(message + this.config.ok.suffix, data, this.config.types.ok, this.config.ok.status, promise)
  },

  /**
   * Generate error response
   * @param message
   * @param error
   * @param promise
   * @return {*}
   */
  error: function (message, error, promise = this.config.promise) {
    return this.response(message + this.config.ko.suffix, this._parseErrors(error), this.config.types.ko, this.config.ko.status, promise)
  },

  /**
   * Generate warning response
   * @param message
   * @param error
   * @param promise
   * @return {*}
   */
  warning: function (message, error, promise = this.config.promise) {
    return this.response(message + this.config.warn.suffix, this._parseErrors(error), this.config.types.warn, this.config.warn.status, promise)
  },

  /**
   * Generate warning response
   * @param message
   * @param error
   * @param promise
   * @return {*}
   */
  notFound: function (message, error, promise = this.config.promise) {
    return this.response(message + this.config.notFound.suffix, this._parseErrors(error), this.config.types.notFound, this.config.notFound.status, promise)
  },

  _parseErrors: function (error) {
    const errors = {}
    if (error) {
      if (error.message && this.config.debug) {
        errors.error = error.message
      }
      if (error.errors) {
        errors.errors = error.errors
      }
    }
    return errors
  }
}

module.exports = Response
