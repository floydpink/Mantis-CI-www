define([
  'jquery',
  'ember',
  'ember-data',
  'app/utils'
], function ($, Ember, DS, utils) {

  var headers = {
        Accept : 'application/vnd.travis-ci.2+json, */*; q=0.01'
      }, rootContainer = {
        'App.Repo' : 'repos'
      }, formatQuery = function (query) {
        var querystring = '';
        for (var q in query) {
          querystring += q + '=' + query[q] + '&';
        }
        if (querystring) {
          querystring = querystring.slice(0, -1);
        }
        return querystring;
      },
      ajax = function (url, store, success) {
        $.ajax({
          url     : url,
          headers : headers,
          context : store,
          success : success
        });

      };

  var Adapter = DS.Adapter.extend({

    find : function (store, type, id) {
      utils.debug('Adapter::find:> Store (' + store + '), type (' + type + '), and id (' + id + ').');
      var url = type.url + id;
      ajax(url, store, function (response) {
        this.load(type, id, response);
      });

    },

    findAll : function (store, type) {
      utils.debug('Adapter::findAll:> Store (' + store + '), and type (' + type + ').');
      var url = type.url;
      ajax(url, store, function (response) {
        this.loadMany(type, response[rootContainer[type]]);
      });
    },

    findQuery : function (store, type, query, modelArray) {
      var url = type.url,
          rootObject = rootContainer[type];

      if ('slug' in query) {
        url += '/' + query.slug;
        if ('repos' === rootObject) {
          rootObject = 'repo';
        }
      } else {
        url += '?' + formatQuery(query);
      }

      ajax(url, store, function (response) {
        var root = response[rootObject];
        if (rootObject === 'repo') {
          root = [root];
        }
        modelArray.load(root);
      });
    }

  });

  Adapter.map('App.Repo', {
    lastBuild : {key : 'last_build_id'}
  });

  return Adapter;

});