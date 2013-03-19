define([
  'jquery',
  'ember'
], function ($, Em) {
  $.support.cors = true;

  var ajax = Em.Object.create({
    DEFAULT_OPTIONS : {
      accepts : {
        json : 'application/vnd.travis-ci.2+json'
      }
    },
    get             : function (url, callback) {
      return this.ajax(url, 'get', {
        success : callback
      });
    },
    post            : function (url, data, callback) {
      return this.ajax(url, 'post', {
        data    : data,
        success : callback
      });
    },
    ajax            : function (url, method, options) {
      var endpoint;
      method = method.toUpperCase();
      endpoint = 'https://api.travis-ci.org';
      options = options || {};
      /*
       if (token = Travis.sessionStorage.getItem('travis.token')) {
       options.headers || (options.headers = {});
       (_base = options.headers)['Authorization'] || (_base['Authorization'] = "token " + token);
       }
       */
      options.url = "" + endpoint + url;
      options.type = method;
      options.dataType = options.dataType || 'json';
      options.context = this;
      if (options.data && method !== 'GET') {
        options.data = JSON.stringify(options.data);
      }
      if (method !== 'GET' && method !== 'HEAD') {
        options.contentType = options.contentType || 'application/json; charset=utf-8';
      }
      /*
       success = options.success || (function () {
       });
       options.success = function (data) {
       if (data != null ? data.flash : void 0) {
       Travis.lookup('controller:flash').loadFlashes(data.flash);
       }
       if (data != null) {
       delete data.flash;
       }
       return success.apply(_this, arguments);
       };
       error = options.error || (function () {
       });
       options.error = function (data) {
       if (data != null ? data.flash : void 0) {
       Travis.lookup('controller:flash').pushObject(data.flash);
       }
       if (data != null) {
       delete data.flash;
       }
       return error.apply(_this, arguments);
       };
       */
      return $.ajax($.extend(options, ajax.DEFAULT_OPTIONS));
    }
  });

  return ajax;
});