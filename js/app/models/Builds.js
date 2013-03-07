define([
  'ember-data'
], function (DS) {
  return DS.Model.extend({
    number: DS.attr('string'),
    message: DS.attr('string')
  });
});