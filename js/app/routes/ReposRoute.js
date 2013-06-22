define([
         'ember',
         'ext/DontSetupModelForControllerMixin',
         'models/Repo',
         'app/utils'
       ], function (Ember, DontSetupModelForControllerMixin, Repo, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    setupController : function (controller) {
      utils.debug('ReposRoute::setupController:>');
      controller.set('search', '');
      this.container.lookup('controller:repos').activate();
    }
  });
});