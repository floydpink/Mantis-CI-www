define([
  'ember'
], function (Ember) {
  return Ember.ArrayController.extend({

    isInfoVisible: true,

    toggleInfo: function () {
      this.set('isInfoVisible', !this.get('isInfoVisible'));
    }

  });
});