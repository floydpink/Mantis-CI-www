define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'app/utils'
], function (Ember, DontSetupModelForControllerMixin, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    setupController : function () {
      utils.debug('RepoIndexRoute::setupController:>');
      return this.container.lookup('controller:repo').activate('current');
    },
    renderTemplate  : function () {
      utils.debug('RepoIndexRoute::renderTemplate:>');
      this.container.lookup('controller:build').set('buildMetaLess', true);
      //this.container.lookup('controller:build').set('logMetaLess', true);
      this.render('build', { controller : 'build', outlet : 'pane', into : 'repo'});
    }
  });
});