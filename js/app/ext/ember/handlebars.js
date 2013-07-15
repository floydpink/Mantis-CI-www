define([
         'jquery',
         'ember',
         'handlebars',
         'ext/Helpers',
         'app/utils',
         'ext/ember/bound-helper'
       ], function ($, Ember, Handlebars, Helpers, utils) {
  var safe;

  safe = function (string) {
    return new Handlebars.SafeString(string);
  };

  Handlebars.registerHelper('tipsy', function (text, tip) {
    return safe('<span class="tool-tip" original-title="' + tip + '">' + text + '</span>');
  });

  Ember.registerBoundHelper('capitalize', function (value) {
    if (value != null) {
      return safe($.capitalize(value));
    } else {
      return '';
    }
  });

  Ember.registerBoundHelper('formatTime', function (value) {
    return safe(Helpers.timeAgoInWords(value) || '-');
  });

  Ember.registerBoundHelper('formatDuration', function (duration) {
    return safe(Helpers.timeInWords(duration));
  });

  Ember.registerBoundHelper('formatCommit', function (commit) {
    if (commit) {
      return safe(Helpers.formatCommit(commit.get('sha'), commit.get('branch')));
    }
  });

  Ember.registerBoundHelper('formatSha', function (sha) {
    return safe(Helpers.formatSha(sha));
  });

  Ember.registerBoundHelper('pathFrom', function (url) {
    return safe(Helpers.pathFrom(url));
  });

  Ember.registerBoundHelper('formatMessage', function (message, options) {
    return safe(Helpers.formatMessage(message, options));
  });

  Ember.registerBoundHelper('formatConfig', function (config) {
    return safe(Helpers.formatConfig(config));
  });

  Ember.registerBoundHelper('formatLog', function () {
    //    var item, parentView, repo;
    //    parentView = this.get('parentView');
    //    repo = parentView.get(options.repo);
    //    item = parentView.get(options.item);
    //    return Helpers.formatLog(log, repo, item) || '';
    utils.debug('EXT/EMBER/HANDLEBARS::registerBoundHelper::formatLog"> NEEDS FIX!!!');
  });

});