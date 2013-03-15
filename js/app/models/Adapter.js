define([
  'jquery',
  'ember-data',
  'app/utils'
], function ($, DS, utils) {

  var Adapter = DS.Adapter.extend({

    find: function (store, type, id) {
      utils.debug('Adapter::find:> Store (' + store +'), type ('+ type +'), and id ('+ id +').');
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
      utils.debug('Adapter::findAll:> Store (' + store +'), and type ('+ type +').');
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