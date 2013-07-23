define([
  'ember'
], function (Ember) {
  return Ember.TextField.extend({
    attributeBindings: ['name', 'data-type', 'placeholder'],
    'elementId'      : 'search',
    'name'           : 'search',
    'data-type'      : 'search',
    'placeholder'    : 'Search all repositories',
    'classNames'     : ['ui-input-text', 'ui-body-c'],
    keyDown          : function (e) {
      if (e.keyCode === 13) {
        this.get('controller').send('enterPressedOnSearch', this);
      }
    }
  });
});