define([
  'ember',
  'app/utils'
], function (Ember, utils) {
  var IndexRoute = Ember.Route.extend({
    enter:function(){
      utils.debug('In Index Route enter');
    },
    redirect: function () {
      utils.debug('In Index Route redirect');
      this.transitionTo('repos');
    }
  });
  return IndexRoute;
});