/* global console: false */
define([
  'jquery',
  'lib/date.format'
], function ($) {
  "use strict";
  var debugEnabled = false,
      formatMessage = function (message) {
        return 'Mantis CI: ' + new Date().format('dd/mm/yyyy hh:MM:ss:l') + ': ' + message;
      };
  //>>excludeStart('distBuildExclude', pragmas.distBuildExclude);
  debugEnabled = true;
  //>>excludeEnd('distBuildExclude');
  return {
    confirm   : function (message, title, confirmButtonLabel, callbackContext, confirmCallback) {
      if (window.device) {
        // use the phonegap notification API for richer confirm prompt
        window.navigator.notification.confirm(message, function (buttonPressed) {
          if (buttonPressed === 2) {
            $.proxy(confirmCallback, callbackContext)();
          }
        }, title, 'Cancel,' + confirmButtonLabel);
      } else {
        // use the traditional javascript confirm
        if (window.confirm(message)) {
          $.proxy(confirmCallback, callbackContext)();
        }
      }
    },
    debug     : function (message) {
      if (debugEnabled && console.debug) {
        console.debug(formatMessage(message));
      }
    },
    log       : function (message) {
      if (console) {
        console.log(formatMessage(message));
      }
    },
    warn      : function (message) {
      if (console && console.warn) {
        console.warn(formatMessage(message));
      }
    },
    error     : function (message) {
      if (console && console.error) {
        console.error(formatMessage(message));
      }
    },
    logObject : function (obj) {
      if (debugEnabled && console) {
        console.log(obj);
      }
    }
  };

});