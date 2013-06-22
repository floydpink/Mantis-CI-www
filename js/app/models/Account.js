define([
         'ember-data',
         'models/TravisModel'
       ], function (DS, TravisModel) {
  return TravisModel.extend({
                              primaryKey : 'login',
                              login      : DS.attr('string'),
                              name       : DS.attr('string'),
                              type       : DS.attr('string'),
                              reposCount : DS.attr('number'),
                              urlGithub  : function () {
                                return "http://github.com/" + (this.get('login'));
                              }.property()
                            });
});