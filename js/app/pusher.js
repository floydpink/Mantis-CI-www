/* global App */
define([
         'ext/jquery.ext',
         'ember',
         'pusher',
         'models/Job',
         'app/utils'
       ], function ($, Ember, Pusher, Job, utils) {

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
    active_channels : [],
    init            : function (key) {
      Pusher.warn = this.warn.bind(this);
      this.pusher = new Pusher(key, {
        encrypted : TravisPusher.ENCRYPTED
      });
      if (TravisPusher.CHANNELS) {
        return this.subscribeAll(TravisPusher.CHANNELS);
      }
    },
    subscribeAll    : function (channels) {
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
    subscribe       : function (channel) {
      var _ref,
          _this = this;
      utils.log("subscribing to " + channel);
      channel = this.prefix(channel);
      if (!((_ref = this.pusher) != null ? _ref.channel(channel) : void 0)) {
        return this.pusher.subscribe(channel).bind_all(function (event, data) {
          return _this.receive(event, data);
        });
      }
    },
    unsubscribe     : function (channel) {
      var _ref;
      utils.log("unsubscribing from " + channel);
      channel = this.prefix(channel);
      if ((_ref = this.pusher) != null ? _ref.channel(channel) : void 0) {
        return this.pusher.unsubscribe(channel);
      }
    },
    prefix          : function (channel) {
      return "" + TravisPusher.CHANNEL_PREFIX + channel;
    },
    receive         : function (event, data) {
      if (event.substr(0, 6) === 'pusher') {
        return;
      }
      if (data.id) {
        data = this.normalize(event, data);
      }
      if (event === 'job:created' || event === 'job:requeued') {
        if (App.store.isInStore(Job, data.job.id)) {
          Job.find(data.job.id).clearLog();
        }
      }
      return Ember.run.next(function () {
        return App.store.receive(event, data);
      });
    },
    normalize       : function (event, data) {
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
    warn            : function (type, warning) {
      if (!this.ignoreWarning(warning)) {
        return utils.warn(warning);
      }
    },
    ignoreWarning   : function (warning) {
      var message, _ref;
      if (message = (_ref = warning.data) != null ? _ref.message : void 0) {
        return message.indexOf('Existing subscription') === 0 || message.indexOf('No current subscription') === 0;
      }
    }
  });

  return TravisPusher;
});