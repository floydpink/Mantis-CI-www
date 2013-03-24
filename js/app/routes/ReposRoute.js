define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    setupController: function (controller) {
      utils.debug('ReposRoute::setupController:>');
      controller.set('search', '');
      this.container.lookup('controller:repos').activate();
    }
  });
});