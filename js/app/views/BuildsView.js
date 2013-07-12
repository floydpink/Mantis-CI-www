define([
  'ember',
  'hbs!repo/builds'
], function (Ember) {
  return Ember.View.extend({
    templateName       : 'repo/builds',
    classNames         : ['build'],
    buildsBinding      : 'controller.builds',
    isPullRequestsList : function () {
      return this.get('controller.tab') === 'pull_requests';
    }.property('controller.tab'),
    ShowMoreButton     : Ember.View.extend({
      tagName           : 'button',
      classNameBindings : ['isLoading'],
      attributeBindings : ['disabled'],
      isLoadingBinding  : 'controller.builds.isLoading',
      template          : Ember.Handlebars.compile('{{view.label}}'),
      disabledBinding   : 'isLoading',
      label             : function () {
        if (this.get('isLoading')) {
          return 'Loading';
        } else {
          return 'Show more';
        }
      }.property('isLoading'),
      click             : function () {
        return this.get('controller').showMore();
      }
    })
  });
});