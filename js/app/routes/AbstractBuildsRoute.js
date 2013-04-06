define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'app/utils'
], function (Ember, DontSetupModelForControllerMixin, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    renderTemplate  : function () {
      utils.debug('BuildsRoute::renderTemplate:>');
      return this.render('builds', {
        outlet : 'pane',
        into   : 'repo'
      });
    },
    setupController : function () {
      utils.debug('BuildsRoute::setupController:>');
      return this.container.lookup('controller:repo').activate(this.get('contentType'));
    }
  });
});

