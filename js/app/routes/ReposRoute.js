define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'ext/SetupLastBuildMixin',
  'models/Repo',
  'app/utils'
], function (Ember, DontSetupModelForControllerMixin, SetupLastBuildMixin, Repo, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, SetupLastBuildMixin, {
    setupController: function (controller) {
      utils.debug('ReposRoute::setupController:>');
      this._super.apply(this, arguments);
      controller.set('search', '');
      //this.container.lookup('controller:repos').activate();
      this.controllerFor('repos').activate();
    }
  });
});