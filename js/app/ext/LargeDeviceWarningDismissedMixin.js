define([
  'ember',
], function (Ember) {
  var LargeDeviceWarningDismissedMixin = Ember.Mixin.create({
    needs                              : ['application'],
    largeDeviceWarningDismissedBinding : 'controllers.application.largeDeviceWarningDismissed'
  });

  return LargeDeviceWarningDismissedMixin;
});