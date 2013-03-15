define([
  'jquery',
  'ember-data',
  'app/utils'
], function ($, DS, utils) {
  var headers = {
    Accept: 'application/vnd.travis-ci.2+json, */*; q=0.01'
  }, rootContainer = {
    'App.Repo': 'repos'
  };


  var Adapter = DS.Adapter.extend({

    find: function (store, type, id) {
      utils.debug('Adapter::find:> Store (' + store + '), type (' + type + '), and id (' + id + ').');
      var url = type.url + id;

      $.ajax({
        url: url,
        headers: headers,
        context: store,
        success: function (response) {
          this.load(type, id, response);
        }
      });
    },

    findAll: function (store, type) {
      utils.debug('Adapter::findAll:> Store (' + store + '), and type (' + type + ').');
      var url = type.url;

      $.ajax({
        url: url,
        headers: headers,
        context: store,
        success: function (response) {
          this.loadMany(type, response[rootContainer[type]]);
        }
      });
    }

  });

  Adapter.map('App.Repo', {
    lastBuild: {key: 'last_build_id'}
  });

  return Adapter;

});