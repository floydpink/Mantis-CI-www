define([
  'ember-data'
], function (DS) {
  var Builds = DS.Model.extend({
    number: DS.attr('string'),
    message: DS.attr('string')
  });

  return  Builds;
});