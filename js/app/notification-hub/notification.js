define([
  'hub/ajax',
  'app/utils'
], function (ajax, utils) {
  return {
    registerDevice : function (device) {
      ajax.putJson('/devices/' + device.deviceId, device, function () {
        utils.log('putJson successful!');
        utils.logObject(arguments);
      });
    }
  };
});