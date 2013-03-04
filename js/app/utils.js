/* global console: false */
define([
  'lib/date.format'
], function () {

  return {
    log:function (message) {
      if (console) {
        console.log('Travis-CI: ' + (new Date()).format('dd/mm/yyyy hh:MM:ss:l') + ': ' + message);
      }
    }
  };

});