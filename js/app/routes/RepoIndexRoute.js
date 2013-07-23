define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'ext/SetupLastBuildMixin',
  'app/utils'
], function (Ember, DontSetupModelForControllerMixin, SetupLastBuildMixin, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, SetupLastBuildMixin, {
    setupController: function () {
      utils.debug('RepoIndexRoute::setupController:>');
      this._super.apply(this, arguments);
      this.container.lookup('controller:repo').activate('current');
    },
    renderTemplate : function () {
      utils.debug('RepoIndexRoute::renderTemplate:>');
      this.container.lookup('controller:build').set('buildMetaLess', true);
      this.render('build', { controller: 'build', outlet: 'pane', into: 'repo'});
    }
  });
});