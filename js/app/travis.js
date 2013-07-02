/* global Media:true */
define([
         'jquery',
         'app/utils',
         'app/app',
         'jquery-cookie'
       ], function ($, utils, App) {
  "use strict";

  var bootstrap = function () {
    var pushNotification,
    // result contains any message sent from the plugin call
        successHandler = function (result) {
          navigator.notification.alert('result = ' + result);
          utils.debug('successHandler Result: ');
          utils.logObject(result);
        },
    // result contains any error description text returned from the plugin call
        errorHandler = function (error) {
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
            deviceid     : App.device,
            deviceStatus : result
          };
          navigator.notification.alert(JSON.stringify(device));
          utils.debug('TODO: PUT /travis-notification/api/device with the iOS device:');
          utils.logObject(JSON.stringify(device));
        },
    // iOS
        /* jshint unused:false */
        onNotificationAPN = function (event) {
          utils.debug('onNotificationAPN Event: ');
          utils.logObject(event);
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
    // Android
        /* jshint unused:false */
        onNotificationGCM = function (e) {
          utils.debug('onNotificationGCM Event: ');
          utils.logObject(e);
          utils.debug('<li>EVENT -> RECEIVED:' + e.event + '</li>');

          switch (e.event) {
            case 'registered':
              if (e.regid.length > 0) {
                utils.debug('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                utils.debug("regID = " + e.regID);
                var device = {
                  deviceid     : App.device,
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
                utils.debug('<li>--INLINE NOTIFICATION--' + '</li>');

                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/" + e.soundname);
                my_media.play();
              }
              else {   // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                  utils.debug('<li>--COLDSTART NOTIFICATION--' + '</li>');
                } else {
                  utils.debug('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
              }
              utils.debug('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
              utils.debug('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
              break;
            case 'error':
              utils.debug('<li>ERROR -> MSG:' + e.msg + '</li>');
              break;
            default:
              utils.debug('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
              break;
          }
        };

    // If this is a Phonegap device, capture its unique id
    document.addEventListener("deviceready", function () {

      utils.debug('Capturing the device id from Phonegap API');
      var device = window.device,
          deviceId = device.platform + '-' + device.version + '-' + device.model + '-' + device.uuid;
      App.device = deviceId.replace(/\s+/g, '~');
      utils.debug('App.device : ' + App.device);

      utils.debug('Registering the device for Push Notifications');
      pushNotification = window.plugins.pushNotification;
      if (pushNotification) {

        if (device.platform.toLowerCase() === 'android') {
          pushNotification.register(successHandler, errorHandler, {"senderID" : "173801457554", "ecb" : "onNotificationGCM"});
        } else {
          pushNotification.register(tokenHandler, errorHandler, {"badge" : "true", "sound" : "true", "alert" : "true", "ecb" : "onNotificationAPN"});
        }

      }
    }, true);

    // jQuery ready - DOM loaded
    $(document).ready(function () {
      if (window.device) {
        // bind click events for anchor[rel=external] elements to redirect to PhoneGap InAppBrowser syntax
        $(document).on('click', 'a[rel=external]', function () {
          window.open($(this).attr('href'), '_system');
          return false;
        });
      }

      //kickstart Ember app readiness
      utils.debug('travis::bootstrap:> App advanceReadiness');
      App.advanceReadiness();
    });

  };

  return { bootstrap : bootstrap };
});
