define([
  'ext/jquery.ext',
  'ember',
  'ext/TravisUrls',
  'app/utils'
], function ($, Ember, TravisUrls, utils) {

  var RepoController = Ember.Controller.extend({
    bindings              : [],
    gitHubUrl             : function () {
      return TravisUrls.githubRepo(this.get('repo.slug'));
    }.property('repo.slug'),
    shortDescription      : function () {
      utils.debug('RepoController::shortDescription:>');
      var description = this.get('repo.description'),
          shortDescription = $.truncate(description || '', 80),
          isDescriptionLong = description !== shortDescription;
      return isDescriptionLong ? shortDescription : '';
    }.property('repo.description'),
    fullDescriptionVisible: function () {
      utils.debug('RepoController::descriptionToggle:>');
      return !this.get('shortDescription');
    }.property('shortDescription'),
    toggleDescription     : function () {
      this.toggleProperty('fullDescriptionVisible');
      return false;
    },
    activate              : function (action) {
      utils.debug('RepoController::activate:> action: ' + action);
      this._unbind();
      return this["view" + ($.camelize(action))]();
    },
    viewCurrent           : function () {
      utils.debug('RepoController::viewCurrent:>');
      return this._bind('build', 'repo.lastBuild');
    },
    viewBuild             : function () {
      utils.debug('RepoController::viewBuild:>');
    },
    _bind                 : function (to, from) {
      utils.debug('RepoController::_bind> to: ' + to + ' from: ' + from);
      return this.bindings.push(Ember.oneWay(this, to, from));
    },
    _unbind               : function () {
      var binding, _i, _len, _ref;
      _ref = this.bindings;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        binding.disconnect(this);
      }
      return this.bindings.clear();
    }
  });

  return  RepoController;

});