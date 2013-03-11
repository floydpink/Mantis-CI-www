define([
  'ember-data'
], function (DS) {

  var Build = DS.Model.extend({
    author_email: DS.attr('string'),
    author_name: DS.attr('string'),
    message: DS.attr('string'),
    number: DS.attr('string'),
    state: DS.attr('string')
  });

  Build.reopenClass({
    'url': 'https://api.travis-ci.org/builds/'
  });

  return Build;
});