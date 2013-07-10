define([
         'hub/ajax'
       ], function (ajax) {
  return {
    registerDevice : function (device) {
      ajax.putJson('/devices/' + device.deviceId, device, function () {
        utils.log('putJson successful!');
        utils.logObject(arguments);
      });
    }
  };
});