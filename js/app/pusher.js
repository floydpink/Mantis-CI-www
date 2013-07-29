/* global App */
define([
  'ext/jquery.ext',
  'ember',
  'visibility',
  'pusher',
  'models/Job',
  'app/utils'
], function ($, Ember, Visibility, Pusher, Job, utils) {

  var TravisPusher = function (key) {
    this.init(key);
    return this;
  };

  $.extend(TravisPusher, {
    CHANNELS       : ['common'],
    CHANNEL_PREFIX : '',
    ENCRYPTED      : false
  });

  $.extend(TravisPusher.prototype, {
    active_channels              : [],
    callbacksToProcess           : [],
    init                         : function (key) {
      var self = this;
      Pusher.warn = this.warn.bind(this);
      this.pusher = new Pusher(key, {
        encrypted : TravisPusher.ENCRYPTED
      });
      if (TravisPusher.CHANNELS) {
        this.subscribeAll(TravisPusher.CHANNELS);
      }
      Visibility.change(function (e, state) {
        if (state === 'visible') {
          self.processSavedCallbacks();
        }
      });
      utils.debug('pusher::init:> setting up the setInterval');
      setInterval(this.processSavedCallbacks.bind(this), this.processingIntervalWhenHidden);
    },
    subscribeAll                 : function (channels) {
      var channel, name, _i, _len,
          self = this,
          receiver = function (event, data) {
            return self.receive(event, data);
          };
      for (_i = 0, _len = channels.length; _i < _len; _i++) {
        channel = channels[_i];
        name = this.prefix(channel);
        if (!this.pusher.channels.find(name)) {
          channel = this.pusher.channels.add(name, this);
          channel.bind_all(receiver);
        }
      }
      return this.pusher.subscribeAll([]);
    },
    subscribe                    : function (channel) {
      var pusherRef,
          self = this;
      utils.debug("subscribing to " + channel);
      channel = this.prefix(channel);
      if (!((pusherRef = this.pusher) != null ? pusherRef.channel(channel) : void 0)) {
        this.pusher.subscribe(channel).bind_all(function (event, data) {
          self.receive(event, data);
        });
      }
    },
    unsubscribe                  : function (channel) {
      var _ref;
      utils.debug("unsubscribing from " + channel);
      channel = this.prefix(channel);
      if ((_ref = this.pusher) != null ? _ref.channel(channel) : void 0) {
        return this.pusher.unsubscribe(channel);
      }
    },
    prefix                       : function (channel) {
      return TravisPusher.CHANNEL_PREFIX + channel;
    },
    //process pusher messages in batches every 5 minutes when the page is hidden
    processingIntervalWhenHidden : 1000 * 60 * 5,
    receive                      : function (event, data) {
      if (event.substr(0, 6) === 'pusher') {
        return;
      }
      if (data.id) {
        data = this.normalize(event, data);
      }
      this.processWhenVisible(function () {
        if (event === 'job:created' || event === 'job:requeued') {
          if (Job.isRecordLoaded(data.job.id)) {
            Job.find(data.job.id).clearLog();
          }
        }
        Ember.run.next(function () {
          App.receive(event, data);
        });
      });
    },
    processSavedCallbacks        : function () {
      var callback;
      utils.debug('pusher::processSavedCallbacks:> Calling ' + this.callbacksToProcess.length + ' callbacks');
      while (callback = this.callbacksToProcess.shiftObject()) {
        callback.call(this);
      }
    },
    processLater                 : function (callback) {
      return this.callbacksToProcess.pushObject(callback);
    },
    processWhenVisible           : function (callback) {
      if (Visibility.hidden() && Visibility.isSupported()) {
        return this.processLater(callback);
      } else {
        return callback.call(this);
      }
    },
    normalize                    : function (event, data) {
      switch (event) {
        case 'build:started':
        case 'build:finished':
          return data;
        case 'job:created':
        case 'job:started':
        case 'job:requeued':
        case 'job:finished':
        case 'job:log':
          if (data.queue) {
            data.queue = data.queue.replace('builds.', '');
          }
          return {
            job : data
          };
        case 'worker:added':
        case 'worker:updated':
        case 'worker:removed':
          return {
            worker : data
          };
      }
    },
    warn                         : function (type, warning) {
      if (!this.ignoreWarning(warning)) {
        return utils.warn(warning);
      }
    },
    ignoreWarning                : function (warning) {
      var message, _ref;
      if (message = (_ref = warning.data) != null ? _ref.message : void 0) {
        return message.indexOf('Existing subscription') === 0 || message.indexOf('No current subscription') === 0;
      }
    }
  });

  return TravisPusher;
});