define([
  'jquery'
], function ($) {
  return {
    t : [
    ],
    missingTranslation : function() {
      var key, value;
      key = arguments[arguments.length - 1];
      value = key.split('.').pop();
      return $.titleize(value);
    }
  };
});
