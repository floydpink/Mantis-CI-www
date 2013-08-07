define([
  'jquery',
  'ember',
  'app/utils',
  'app/app',
  'app/phonegap',
  'jquery-cookie'
], function ($, Ember, utils, App, phonegap) {
  "use strict";

  var bootstrap = function () {

    App.phonegap = phonegap;

    document.addEventListener("deviceready", phonegap.deviceReady, true);

    // jQuery ready - DOM loaded
    $(document).ready(function () {

      var oldPushState, oldReplaceState;

      if (window.history.state === void 0) {
        window.history.state = {};
        oldPushState = window.history.pushState;
        window.history.pushState = function (state /*, title, href*/) {
          window.history.state = state;
          return oldPushState.apply(this, arguments);
        };
        oldReplaceState = window.history.replaceState;
        window.history.replaceState = function (state /*, title, href*/) {
          window.history.state = state;
          return oldReplaceState.apply(this, arguments);
        };
      }

      // handle error
      Ember.onerror = function (error) {
        utils.error('Ember Error:');
        utils.logObject(error);
      };

      Ember.RecordArray.reopen({
        _replace         : function (index, removedCount, records) {
          var record, _i, _len;
          if (!this.bufferedRecords) {
            this.bufferedRecords = [];
          }
          if (!this.get('content')) {
            for (_i = 0, _len = records.length; _i < _len; _i++) {
              record = records[_i];
              if (!this.bufferedRecords.contains(record)) {
                this.bufferedRecords.pushObject(record);
              }
            }
            records = [];
          }
          if (removedCount || records.length) {
            return this._super(index, removedCount, records);
          }
        },
        contentDidChange : function () {
          var content, record, _i, _len, _ref;
          if ((content = this.get('content')) && this.bufferedRecords && this.bufferedRecords.length) {
            _ref = this.bufferedRecords;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              record = _ref[_i];
              if (!content.contains(record)) {
                content.pushObject(record);
              }
            }
            return this.bufferedRecords = [];
          }
        }.observes('content')
      });

      //>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
      Ember.LOG_BINDINGS = true;
      //>>excludeEnd('appBuildExclude');

      //kickstart the Ember app
      utils.debug('travis::bootstrap:> calling App.start');
      App.start();
    });

  };

  return { bootstrap : bootstrap };
});
