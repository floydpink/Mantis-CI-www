/* global Media:true */
define([
         'jquery',
         'app/utils',
       ], function ($, utils) {
  var pushNotification,
      phonegapDeviceId,
      successHandler = function (result) {
        // result contains any message sent from the plugin call
        navigator.notification.alert('result = ' + result);
        utils.debug('successHandler Result: ');
        utils.logObject(result);
      },
      errorHandler = function (error) {
        // result contains any error description text returned from the plugin call
        navigator.notification.alert('error = ' + error);
        utils.debug('errorHandler Error: ');
        utils.logObject(error);
      },
      tokenHandler = function (result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        navigator.notification.alert('device token = ' + result);
        utils.debug('tokenHandler Result: ');
        utils.logObject(result);
        var device = {
          deviceid     : phonegapDeviceId,
          deviceStatus : result
        };
        navigator.notification.alert(JSON.stringify(device));
        utils.debug('TODO: PUT /travis-notification/api/device with the iOS device:');
        utils.logObject(JSON.stringify(device));
      },
      onNotificationAPN = function (event) {
        // iOS
        utils.debug('onNotificationAPN Event: ');
        utils.logObject(event);
        utils.logObject(JSON.stringify(event));
        if (event.alert) {
          navigator.notification.alert(event.alert);
        }
        if (event.sound) {
          var snd = new Media(event.sound);
          snd.play();
        }
        if (event.badge) {
          pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        }
      },
      onNotificationGCM = function (e) {
        // Android
        utils.debug('onNotificationGCM Event: ');
        utils.logObject(e);
        utils.logObject(JSON.stringify(e));
        utils.debug('EVT Recieved: ' + e.event);

        switch (e.event) {
          case 'registered':
            if (e.regid.length > 0) {
              utils.debug('Registed EVT => RegistrationId' + e.regid);
              // Your GCM push server needs to know the regID before it can push to this device
              // here is where you might want to send it the regID for later use.
              utils.debug("regID = " + e.regID);
              var device = {
                deviceid     : phonegapDeviceId,
                deviceStatus : e
              };
              navigator.notification.alert(JSON.stringify(device));
              utils.debug('TODO: PUT /travis-notification/api/device with the Android device:');
              utils.logObject(JSON.stringify(device));
            }
            break;
          case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
              utils.debug('Message EVT => Foreground Notification');
              if (e.soundname) {
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/" + e.soundname);
                my_media.play();
              }
            }
            else {   // otherwise we were launched because the user touched a notification in the notification tray.
              if (e.coldstart) {
                utils.debug('Message EVT => Coldstart Notification');
              } else {
                utils.debug('Message EVT => Background Notification');
              }
            }
            utils.debug('Payload Message is: ' + e.payload.message);
            utils.debug('Payload Message Count is: ' + e.payload.msgcnt);
            break;
          case 'error':
            utils.debug('Error EVT => Error message: ' + e.msg);
            break;
          default:
            utils.debug('Unknown EVT => (We should not see this!)');
            break;
        }
      },
      deviceReady = function () {
        utils.debug('Bind a[rel=external] clicks to open in InAppBrowser');
        // bind click events for anchor[rel=external] elements to redirect to PhoneGap InAppBrowser syntax
        $(document).on('click', 'a[rel=external]', function () {
          utils.debug('Opening external url: ' + $(this).attr('href'));
          window.open($(this).attr('href'), '_system');
          return false;
        });

        utils.debug('Capturing the device id from Phonegap API');
        var device = window.device,
            deviceId = device.platform + '-' + device.model + '-' + device.uuid;
        phonegapDeviceId = deviceId.replace(/\s+/g, '~');
        utils.debug('phonegapDeviceId : ' + phonegapDeviceId);

        utils.debug('Registering the device for Push Notifications');
        pushNotification = window.plugins.pushNotification;
        if (pushNotification) {
          if (device.platform.toLowerCase() === 'android') {
            pushNotification.register(successHandler, errorHandler, {"senderID" : "173801457554", "ecb" : "App.phonegap.onNotificationGCM"});
          } else {
            pushNotification.register(tokenHandler, errorHandler, {"badge" : "true", "sound" : "true", "alert" : "true", "ecb" : "App.phonegap.onNotificationAPN"});
          }
        }

      };

  var phonegap = {
    deviceId          : phonegapDeviceId,
    deviceReady       : deviceReady,
    onNotificationGCM : onNotificationGCM,
    onNotificationAPN : onNotificationAPN
  };

  return  phonegap;

});