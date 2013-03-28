define([
  'jquery',
  'ember',
  'ember-data',
  'store/TravisAdapter',
  'models/Job',
  'models/Build',
  'models/Repo',
  'models/Commit',
  'models/Log',
  'app/utils'
], function ($, Ember, DS, RestAdapter, Job, Build, Repo, Commit, Log, utils) {

  var coerceId = function (id) {
        if (id === null) {
          return null;
        } else {
          return id + '';
        }
      },
      __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      };

  var Store = DS.Store.extend({
    revision             : 12,
    adapter              : RestAdapter.create(),
    init                 : function () {
      this._super.apply(this, arguments);
      this._loadedData = {};
      return this.clientIdToComplete = {};
    },
    load                 : function () {
      var result;
      result = this._super.apply(this, arguments);
      if (result && result.clientId && this.clientIdToComplete[result.clientId] === void 0) {
        this.clientIdToComplete[result.clientId] = true;
      }
      return result;
    },
    loadMany             : function (type) {
      var array, result, _i, _len, _ref;
      result = this._super.apply(this, arguments);
      _ref = this.typeMapFor(type).recordArrays;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        array = _ref[_i];
        array.set('isLoaded', true);
      }
      return result;
    },
    merge                : function (type, data, incomplete) {
      var clientId, id, record, result, savedData, typeMap;
      id = coerceId(data.id);
      typeMap = this.typeMapFor(type);
      clientId = typeMap.idToCid[id];
      record = this.recordCache[clientId];
      if (record) {
        this.get('adapter').merge(this, record, data);
      } else {
        if ((savedData = this.clientIdToData[clientId]) && (savedData.id != null)) {
          $.extend(savedData, data);
        } else {
          result = this.load(type, data, {
            id : data.id
          });
          if (result && result.clientId) {
            clientId = result.clientId;
            if (incomplete) {
              this.clientIdToComplete[result.clientId] = false;
            }
          }
        }
      }
      return {
        clientId : clientId,
        id       : id
      };
    },
    isInStore            : function (type, id) {
      return !!this.typeMapFor(type).idToCid[id];
    },
    receive              : function (event, data) {
      var build, commit, job, mappings, name, type, _ref;
      _ref = event.split(':'), name = _ref[0], type = _ref[1];
      mappings = this.adapter.get('mappings');
      type = mappings[name];
      if (event === 'build:started' && data.build.commit) {
        build = data.build;
        commit = {
          id              : build.commit_id,
          author_email    : build.author_email,
          author_name     : build.author_name,
          branch          : build.branch,
          committed_at    : build.committed_at,
          committer_email : build.committer_email,
          committer_name  : build.committer_name,
          compare_url     : build.compare_url,
          message         : build.message,
          sha             : build.commit
        };
        delete data.build.commit;
        this.loadIncomplete(Commit, commit);
      }
      if (event === 'job:log') {
        if (Log.DEBUG) {
          utils.debug('store: received job:log event', data);
        }
        data = data.job;
        job = this.find(Job, data.id);
        return job.appendLog({
          number  : parseInt(data.number, 10),
          content : data._log,
          final   : data.final
        });
      } else if (data[type.singularName()]) {
        return this._loadOne(this, type, data);
      } else if (data[type.pluralName()]) {
        return this._loadMany(this, type, data);
      } else {
        if (!type) {
          throw "can't load data for " + name;
        }
      }
    },
    _loadOne             : function (store, type, json) {
      var result, root;
      root = type.singularName();
      if (type === Build && (json.repository || json.repo)) {
        this.loadIncomplete(Repo, json.repository || json.repo);
      }
      result = this.loadIncomplete(type, json[root]);
      if (result.id) {
        return this.find(type, result.id);
      }
    },
    addLoadedData        : function (type, clientId, hash) {
      var id, loadedData, serializer, _base = this._loadedData, _base1, _name = type.toString();
      id = hash.id;
      if (!(_base)[_name]) {
        _base[_name] = {};
      }
      loadedData = ((_base1 = this._loadedData[type])[clientId] || (_base1[clientId] = []));
      serializer = this.get('adapter.serializer');
      Ember.get(type, 'attributes').forEach(function (name) {
        var value;
        value = this.extractAttribute(type, hash, name);
        if (value !== void 0) {
          if (!loadedData.contains(name)) {
            return loadedData.pushObject(name);
          }
        }
      }, serializer);
      return Ember.get(type, 'relationshipsByName').forEach(function (name, relationship) {
        var key, value;
        key = this._keyForBelongsTo(type, relationship.key);
        value = this.extractBelongsTo(type, hash, key);
        if (value !== void 0) {
          if (!loadedData.contains(name)) {
            return loadedData.pushObject(name);
          }
        }
      }, serializer);
    },
    isDataLoadedFor      : function (type, clientId, key) {
      var data, recordsData;
      if (recordsData = this._loadedData[type.toString()]) {
        if (data = recordsData[clientId]) {
          return data.contains(key);
        }
      }
    },
    loadIncomplete       : function (type, hash, options) {
      var cidToData, clientId, id, result, typeMap;
      if (options == null) {
        options = {};
      }
      id = coerceId(hash.id);
      typeMap = this.typeMapFor(type);
      cidToData = this.clientIdToData;
      clientId = typeMap.idToCid[id];
      if (clientId && cidToData[clientId] && options.skipIfExists) {
        return;
      }
      result = this.merge(type, hash, true);
      if (result && result.clientId) {
        this.addLoadedData(type, result.clientId, hash);
      }
      return result;
    },
    materializeRecord    : function (type, clientId) {
      var record;
      record = this._super.apply(this, arguments);
      if (this.clientIdToComplete[clientId] !== void 0 && !this.clientIdToComplete[clientId]) {
        record.set('incomplete', true);
      } else {
        record.set('incomplete', false);
      }
      return record;
    },
    _loadMany            : function (store, type, json) {
      var root;
      root = type.pluralName();
      this.adapter.sideload(store, type, json, root);
      return this.loadMany(type, json[root]);
    },
    _updateRelationships : function (type, data) {
      var _this = this;
      return Ember.get(type, 'relationshipsByName').forEach(function (key, meta) {
        var clientId, dataProxy, id, ids, parent, state, _ref = data.id;
        if (meta.kind === 'belongsTo') {
          id = data["" + key + "_id"];
          if (clientId = _this.typeMapFor(meta.type).idToCid[id]) {
            if (parent = _this.findByClientId(meta.type, clientId, id)) {
              dataProxy = parent.get('data');
              if (ids = dataProxy['hasMany'][type.pluralName()]) {
                if (__indexOf.call(ids, _ref) < 0) {
                  state = parent.get('stateManager.currentState.path');
                  if (state !== "rootState.loaded.materializing") {
                    parent.send('materializingData');
                  }
                  ids.pushObject(data.id);
                  return parent.notifyPropertyChange('data');
                }
              }
            }
          }
        }
      });
    }
  });

  return Store;

});
