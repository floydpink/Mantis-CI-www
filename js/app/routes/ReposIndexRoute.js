define([
  'ember',
  'ext/SetupLastBuildMixin',
  'app/utils'
], function (Ember, SetupLastBuildMixin, utils) {
  return Ember.Route.extend(SetupLastBuildMixin, {
    setupController : function () {
      utils.debug('ReposIndexRoute::setupController:>');
      this._super.apply(this, arguments);
      this.controllerFor('repos.index').activate();
    },
    renderTemplate  : function () {
      utils.debug('ReposIndexRoute::renderTemplate:>');
      this.render('repos/index', {outlet : 'repolist'});
    }
  });
});