define([
  'ember',
  'app/utils'
], function (Ember, utils) {
  return Ember.Route.extend({
    renderTemplate   : function () {
      utils.debug('AbstractBuildsRoute::renderTemplate:>');
      this.render('builds', { outlet : 'pane', into : 'repo' });
    },
    setupController  : function () {
      utils.debug('AbstractBuildsRoute::setupController:>');
      this.controllerFor('repo').activate(this.get('contentType'));
      this.contentDidChange();
      return this.controllerFor('repo').addObserver(this.get('path'), this, 'contentDidChange');
    },
    deactivate       : function () {
      return this.controllerFor('repo').removeObserver(this.get('path'), this, 'contentDidChange');
    },
    contentDidChange : function () {
      var path;
      path = this.get('path');
      return this.controllerFor('builds').set('content', this.controllerFor('repo').get(path));
    },
    path             : function () {
      var type;
      type = this.get('contentType');
      return "repo." + (type.camelize());
    }.property('contentType')
  });
});

