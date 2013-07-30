define([
  'ember',
  'ext/SetupLastBuildMixin',
  'models/Repo',
  'app/utils'
], function (Ember, SetupLastBuildMixin, Repo, utils) {
  return Ember.Route.extend(SetupLastBuildMixin, {
    setupController : function (controller) {
      utils.debug('ReposRoute::setupController:> start');
      this._super.apply(this, arguments);
      //this.controllerFor('repos').activate();
      // For us the line below does the same job, so commenting out the last line
      controller.set('search', '');
      utils.debug('ReposRoute::setupController:> end');
    }
  });
});