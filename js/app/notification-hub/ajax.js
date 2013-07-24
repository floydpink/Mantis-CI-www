define([
  'jquery',
  'app/utils'
], function ($, utils) {
  var hubBaseUrl = 'http://localhost:3000/api',
      defaultSettings = {
        dataType : 'json'
      },
      ajax = function (path, method, options) {

        utils.debug('ajax::ajax::> method: ' + method);
        options = options || {};

        options.url = hubBaseUrl + path;
        options.type = method.toUpperCase();

        options.error = function () {
          utils.log('Error in ajax.ajax from jQuery ajax:> ');
          utils.logObject(arguments);
        };

        if (options.data && method !== 'GET') {
          options.data = JSON.stringify(options.data);
        }

        if (method !== 'GET' && method !== 'HEAD') {
          options.contentType = options.contentType || 'application/json; charset=utf-8';
        }

        return $.ajax($.extend(options, defaultSettings));

      };

  $.support.cors = true;

  return {
    putJson    : function (path, data, callback) {
      utils.debug('ajax::putJson:>');
      return ajax(path, 'put', {
        data    : data,
        success : callback
      });
    },
    deleteJson : function (path, data, callback) {
      utils.debug('ajax::deleteJson:>');
      return ajax(path, 'delete', {
        data    : data,
        success : callback
      });
    }
  };
});