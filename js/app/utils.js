/* global console: false */
define([
  'jquery',
  'lib/date.format'
], function ($) {
  "use strict";
  var debugEnabled = false,
      formatMessage = function (message) {
        return 'Travis-CI: ' + new Date().format('dd/mm/yyyy hh:MM:ss:l') + ': ' + message;
      };
  //>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  debugEnabled = true;
  //>>excludeEnd('appBuildExclude');
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
    warn      : function (message) {
      if (console && console.warn) {
        console.warn(formatMessage(message));
      }
    },
    log       : function (message) {
      if (console) {
        console.log(formatMessage(message));
      }
    },
    logObject : function (obj) {
      if (debugEnabled && console) {
        console.log(obj);
      }
    }
  };

});