define([
  'ember',
  'app/utils'
], function (Ember, utils) {
  return Ember.Route.extend({
    renderTemplate  : function () {
      utils.debug('BuildsRoute::renderTemplate:>');
      return this.render('builds', {
        outlet : 'pane',
        into   : 'repo'
      });
    },
    setupController : function () {
      utils.debug('BuildsRoute::setupController:>');
      return this.container.lookup('controller:repo').activate('builds');
    }
  });
});