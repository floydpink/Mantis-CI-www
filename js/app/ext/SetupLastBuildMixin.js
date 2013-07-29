define([
  'ember',
  'app/utils'
], function (Ember, utils) {
  var SetupLastBuild = Ember.Mixin.create({
    setupController    : function () {
      utils.debug('SetupLastBuild::setupController:>');
      this.lastBuildDidChange();
      this.controllerFor('repo').addObserver('repo.lastBuild', this, 'lastBuildDidChange');
      this.repoDidLoad();
      this.controllerFor('repo').addObserver('repo.isLoaded', this, 'repoDidLoad');
    },
    deactivate         : function () {
      utils.debug('SetupLastBuild::deactivate:>');
      this._super.apply(this, arguments);
      this.controllerFor('repo').removeObserver('repo.lastBuild', this, 'lastBuildDidChange');
    },
    repoDidLoad        : function () {
      utils.debug('SetupLastBuild::repoDidLoad:>');
      var repo;
      repo = this.controllerFor('repo').get('repo');
      if (repo && repo.get('isLoaded') && !repo.get('lastBuild')) {
        return this.render('builds/not_found', {
          outlet : 'pane',
          into   : 'repo'
        });
      }
    },
    lastBuildDidChange : function () {
      utils.debug('SetupLastBuild::lastBuildDidChange:>');
      var build;
      build = this.controllerFor('repo').get('repo.lastBuild');
      this.controllerFor('build').set('build', build);
    }
  });

  return SetupLastBuild;
});
