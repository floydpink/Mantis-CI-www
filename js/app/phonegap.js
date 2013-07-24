/* global Media:true */
define([
  'jquery',
  'hub/notification',
  'app/utils'
], function ($, notification, utils) {
  var pushNotification,
      device = {},
      extractDeviceDetails = function (device) {
        device.deviceId = (device.platform + '-' + device.uuid).replace(/\s+/g, '~');
        device.phonegapDevice = {
          name     : device.name,
          platform : device.platform,
          cordova  : device.cordova,
          version  : device.version,
          model    : device.model
        };
        utils.debug('phonegapDeviceId : ' + device.deviceId);
      },
      gcmRegistrationSuccess = function (result) {
        navigator.notification.alert('gcmRegistrationSuccess result = ' + result);
        utils.debug('gcmRegistrationSuccess Result: ');
        utils.logObject(result);
      },
      apnRegistrationSuccess = function (result) {
        //populate the deviceToken
        device.iOS = {
          enabled     : result.enabled,
          deviceToken : result.deviceToken
        };
        utils.debug('TODO: PUT /travis-notification/api/device with the iOS device:');
        utils.logObject(JSON.stringify(device));
        notification.registerDevice(device);
      },
      registrationError = function (error) {
        navigator.notification.alert('error = ' + error);
        utils.log('!! registrationError Error: ');
        utils.logObject(error);
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
          pushNotification.setApplicationIconBadgeNumber(gcmRegistrationSuccess, registrationError, event.badge);
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
              utils.debug("regID = " + e.regID);
              //populate the registrationId
              device.android = {
                registrationId : e.regID
              };
              utils.debug('TODO: PUT /travis-notification/api/device with the Android device:');
              utils.logObject(JSON.stringify(device));
              notification.registerDevice(device);
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
        extractDeviceDetails(window.device);

        utils.debug('Registering the device for Push Notifications');
        pushNotification = window.plugins.pushNotification;
        if (pushNotification) {
          if (device.phonegapDevice.platform.toLowerCase() === 'android') {
            pushNotification.register(gcmRegistrationSuccess, registrationError, {"senderID" : "173801457554", "ecb" : "App.phonegap.onNotificationGCM"});
          } else {
            pushNotification.register(apnRegistrationSuccess, registrationError, {"badge" : "true", "sound" : "true", "alert" : "true", "ecb" : "App.phonegap.onNotificationAPN"});
          }
        }

      };

  return  {
    deviceReady       : deviceReady,
    device            : device,
    onNotificationGCM : onNotificationGCM,
    onNotificationAPN : onNotificationAPN
  };

});