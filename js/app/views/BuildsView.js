define([
  'ember',
  'hbs!repo/builds'
], function (Ember) {
  return Ember.View.extend({
    templateName   : 'repo/builds',
    classNames     : ['build'],
    buildsBinding  : 'controller.builds',
    ShowMoreButton : Ember.View.extend({
      tagName           : 'button',
      classNames        : ['float-right'],
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