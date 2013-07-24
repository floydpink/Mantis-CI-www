define([
  'jquery',
  'ember',
  'ext/TravisUrls',
  'app/utils'
], function ($, Em, TravisUrls, utils) {
  $.support.cors = true;

  var ajax = Em.Object.create({
    DEFAULT_OPTIONS : {
      accepts : {
        json : 'application/json; version=2'
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
      endpoint = TravisUrls.apiEndpoint;
      options = options || {};
      /*
       if (token = Travis.sessionStorage.getItem('travis.token')) {
       options.headers || (options.headers = {});
       (_base = options.headers)['Authorization'] || (_base['Authorization'] = "token " + token);
       }
       */
      url = options.url = endpoint + url;
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
      //return $.ajax($.extend(options, ajax.DEFAULT_OPTIONS));

      var accepts, delimeter, key, name, params, promise, reject, resolve, value, xhr, _ref, _ref1, _ref2;

      options = $.extend(options, ajax.DEFAULT_OPTIONS);

      /*
      if (Travis.testing) {
        return $.ajax(options);
      }
      */

      if (!options.error) {
        options.error = function () {
          utils.error('TravisAjax::error:> ');
          utils.logObject(arguments);
        };
      }

      if (options.data && (method === "GET" || method === "HEAD")) {
        params = $.param(options.data);
        delimeter = url.indexOf('?') === -1 ? '?' : '&';
        url = url + delimeter + params;
      }

      xhr = new XMLHttpRequest();

      xhr.open(method, url);

      if (options.accepts && (((_ref = options.headers) != null ? _ref.accept : void 0) == null)) {
        accepts = [];
        _ref1 = options.accepts;
        for (key in _ref1) {
          value = _ref1[key];
          accepts.pushObject(value);
        }
        xhr.setRequestHeader('Accept', accepts.join(', '));
      }

      if (options.headers) {
        _ref2 = options.headers;
        for (name in _ref2) {
          value = _ref2[name];
          xhr.setRequestHeader(name, value);
        }
      }

      if (options.contentType) {
        xhr.setRequestHeader('Content-Type', options.contentType);
      }

      resolve = null;

      reject = null;

      promise = new Em.RSVP.Promise(function (_resolve, _reject) {
        resolve = _resolve;
        return reject = _reject;
      });

      xhr.onreadystatechange = function () {
        var contentType, data, e;
        if (xhr.readyState === 4) {
          contentType = xhr.getResponseHeader('Content-Type');
          data = (function () {
            if (contentType && contentType.match(/application\/json/)) {
              try {
                return $.parseJSON(xhr.responseText);
              } catch (_error) {
                e = _error;
                utils.log('error while parsing a response', method, options.url, xhr.responseText);
              }
            } else {
              return xhr.responseText;
            }
          })();
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
            return options.success.call(options.context, data, xhr.status, xhr);
          } else {
            reject(xhr);
            return options.error.call(data, xhr.status, xhr);
          }
        }
      };

      xhr.send(options.data);

      return promise;
    }
  });

  return ajax;
});