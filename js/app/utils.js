/* global console: false */
define([
         'lib/date.format'
       ], function () {
  "use strict";
  var debugEnabled = false,
      formatMessage = function (message) {
        return 'Travis-CI: ' + new Date().format('dd/mm/yyyy hh:MM:ss:l') + ': ' + message;
      };
//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  debugEnabled = true;
//>>excludeEnd('appBuildExclude');
  return {
    debug     : function (message) {
      if (debugEnabled && console) {
        console.log('DEBUG: ' + formatMessage(message));
      }
    },
    warn      : function (message) {
      if (console && console) {
        console.log('WARN:  ' + formatMessage(message));
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