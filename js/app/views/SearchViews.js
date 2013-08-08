define([
  'ember',
  'hbs!search'
], function (Ember) {
  var SearchViews = {
    SearchboxView : Ember.TextField.extend({
      attributeBindings : ['name', 'data-type', 'placeholder'],
      'elementId'       : 'search',
      'name'            : 'search',
      'data-type'       : 'search',
      'placeholder'     : 'Search all repositories',
      'classNames'      : ['ui-input-text', 'ui-body-c'],
      keyDown           : function (e) {
        if (e.keyCode === 13) {
          this.get('controller').send('enterPressedOnSearch', this);
        }
      }
    }),
    SearchView    : Ember.View.extend({
      templateName : 'search'
    })
  };

  return SearchViews;
});