/* global console: false */
define([
  'lib/date.format'
], function () {

  var debugEnabled = false,
    formatMessage = function(message){
      return 'Travis-CI: ' + (new Date()).format('dd/mm/yyyy hh:MM:ss:l') + ': ' + message;
    };
//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  debugEnabled = true;
//>>excludeEnd('appBuildExclude');
  return {
    debug: function (message) {
      if (debugEnabled && console) {
        console.log(formatMessage(message));
      }
    }
  };

});