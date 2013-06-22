define([
         'ember'
       ], function (Ember) {
  return Ember.TextField.extend({
                                  attributeBindings : ['id', 'name', 'data-type', 'placeholder'],
                                  'id'              : 'search',
                                  'name'            : 'search',
                                  'data-type'       : 'search',
                                  'placeholder'     : 'Search repositories',
                                  'classNames'      : ['ui-input-text', 'ui-body-c']
                                });
});