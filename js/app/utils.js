/* global console: false */
define([
  'lib/date.format'
], function () {

  var debugEnabled = false;
//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  debugEnabled = true;
//>>excludeEnd('appBuildExclude');
  return {
    log:function (message) {
      if (debugEnabled && console) {
        console.log('Travis-CI: ' + (new Date()).format('dd/mm/yyyy hh:MM:ss:l') + ': ' + message);
      }
    }
  };

});