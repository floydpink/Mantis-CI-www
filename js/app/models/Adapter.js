define([
  'jquery',
  'ember-data'
], function ($, DS) {

  var Adapter = DS.Adapter.extend({

    find: function (store, type, id) {
      var url = type.url + id;

      $.ajax({
        url: url,
        context: store,
        success: function (response) {
          this.load(type, id, response);
        }
      });
    },

    findAll: function (store, type) {
      var url = type.url;

      $.ajax({
        url: url,
        context: store,
        success: function (response) {
          this.loadMany(type, response);
        }
      });
    }

  });

  Adapter.map('App.Repo', {
    latestBuild: {key: 'last_build_id'}
  });

  return Adapter;

});