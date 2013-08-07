/* global App */
define([
  'ext/TravisAjax',
  'ember-model'
], function (TravisAjax, Ember) {

  var Adapter = Ember.RESTAdapter.extend({
    ajax            : function (url, params, method) {
      return TravisAjax.ajax(url, method || 'get', {
        data : params
      });
    },
    findMany        : function (klass, records, ids) {
      var self, url;
      url = this.buildURL(klass) + '?' + ids.map(function (id) {
        return "ids[]=" + id;
      }).join('&');
      self = this;
      return this.ajax(url).then(function (data) {
        return self.didFindMany(klass, records, data);
      });
    },
    didFindMany     : function (klass, records, data) {
      var collectionKey, dataToLoad;
      collectionKey = Ember.get(klass, 'collectionKey');
      dataToLoad = collectionKey ? data[collectionKey] : data;
      this.sideload(klass, data);
      return records.load(klass, dataToLoad);
    },
    buildURL        : function () {
      return this._super.apply(this, arguments).replace(/\.json$/, '');
    },
    didFind         : function (record, id, data) {
      this.sideload(record.constructor, data);
      return this._super(record, id, data);
    },
    didFindAll      : function (klass, records, data) {
      this.sideload(klass, data);
      return this._super(klass, records, data);
    },
    didFindQuery    : function (klass, records, params, data) {
      this.sideload(klass, data);
      return this._super(klass, records, params, data);
    },
    didCreateRecord : function (record, data) {
      this.sideload(record.constructor, data);
      return this._super(record, data);
    },
    didSaveRecord   : function (record, data) {
      this.sideload(record.constructor, data);
      return this._super(record, data);
    },
    didDeleteRecord : function (record, data) {
      this.sideload(record.constructor, data);
      return this._super(record, data);
    },
    sideload        : function (klass, data) {
      var name, record, records, type, _results,
          findFromCacheOrLoadClosure = function (records) {
            var i, len, results;
            results = [];
            for (i = 0, len = records.length; i < len; i++) {
              record = records[i];
              results.push(type.findFromCacheOrLoad(record));
            }
            return results;
          };
      _results = [];
      for (name in data) {
        records = data[name];
        if (!Ember.isArray(records)) {
          records = [records];
        }
        if ((type = Ember.get(App, 'mappings')[name]) && type !== klass) {
          _results.push(findFromCacheOrLoadClosure(records));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  });

  return Adapter;

});