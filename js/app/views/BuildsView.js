define([
  'jquery',
  'ember',
  'hbs!repo/builds'
], function ($, Ember) {
  return Ember.View.extend({
    templateName       : 'repo/builds',
    classNames         : ['build'],
    buildsBinding      : 'controller.builds',
    isPullRequestsList : function () {
      return this.get('controller.tab') === 'pull_requests';
    }.property('controller.tab'),
    toTop              : function () {
      return $(window).scrollTop(0);
    },
    ShowMoreButton     : Ember.View.extend({
      tagName           : 'a',
      classNames        : ['ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-up-d show-more'],
      template          : Ember.Handlebars.compile(
          ' <span class="ui-btn-inner">' +
              '   <span class="ui-btn-text">{{view.label}}</span>' +
              ' </span>'),
      classNameBindings : ['isLoading:ui-disabled'],
      isLoadingBinding  : 'controller.isLoading',
      label             : function () {
        if (this.get('isLoading')) {
          return 'Loading...';
        } else {
          return 'Show More...';
        }
      }.property('isLoading'),
      click             : function () {
        return this.get('controller').showMore();
      }
    })
  });
});