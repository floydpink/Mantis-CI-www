define([
  'ember',
  'ext/SetupLastBuildMixin',
  'app/utils'
], function (Ember, SetupLastBuildMixin, utils) {
  return Ember.Route.extend({
    model           : function (params) {
      var phrase = params.phrase;
      utils.debug('SearchRoute::model:> phrase: ' + phrase);
      this.controllerFor('repos').set('search', phrase);
      return phrase;
    },
    setupController : function (controller, model) {
      utils.debug('SearchRoute::setupController:> model: ' + model);
      utils.logObject(model);
      this.controllerFor('search').activate(model);
    },
    renderTemplate  : function () {
      utils.debug('SearchRoute::renderTemplate:>');
      this.render('search', {outlet : 'repolist'});
    }
  });
});