define([
  'ember',
  'models/Build',
  'app/utils'
], function (Ember, Build, utils) {
  return Ember.Route.extend({
    model : function (params) {
      utils.debug('BuildsRoute::model:> params: ' + JSON.stringify(params));
      return Build.find(params['id']);
    }
  });
});