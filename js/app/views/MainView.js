define([
  'jquery',
  'ember',
  'ext/Helpers',
  'hbs!main'
], function ($, Ember, Helpers) {
  return Ember.View.extend({
    layoutName          : 'main',
    attributeBindings   : ['data-role', 'class', 'style'],
    'data-role'         : 'page',
    'class'             : 'ui-page ui-body-d ui-page-active',
    'style'             : 'min-height: 100%;',
    didInsertElement    : Helpers.styleActiveNavbarButton,
    currentRouteBinding : 'App.currentPath',
    backVisible         : function () {
      //show the back button everywhere except the recentRepos page
      return this.get('currentRoute') !== 'repos.index';
    }.property('currentRoute'),
    goBack              : function () {
      window.history.back();
    }
  });
});
