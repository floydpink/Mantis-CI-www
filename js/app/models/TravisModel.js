define([
  'jquery',
  'ember-model',
  'app/utils'
], function ($, Ember, utils) {

  Array.prototype.diff = function (a) {
    return this.filter(function (i) {
      return a.indexOf(i) <= -1;
    });
  };

  var localDebug = function (message) {
        if (false) {
          utils.debug(message);
        }
      },
      TravisModel = Ember.Model.extend({
        id                   : Ember.attr('number'),
        init                 : function () {
          localDebug('TravisModel::init:>');
          this._super.apply(this, arguments);
          return this;
        },
        merge                : function (hash) {
          localDebug('TravisModel::merge:>');
          var data;
          data = this.get('_data');
          Ember.merge(data, hash);
          return this.notifyPropertyChange('_data');
        },
        dataKey              : function (key) {
          localDebug('TravisModel::dataKey:>');
          var meta, type, _ref;
          meta = this.constructor.metaForProperty(key);
          if (meta.isRelationship && (((_ref = meta.options) != null ? _ref.key : void 0) == null)) {
            type = meta.type;
            if (typeof type === "string") {
              type = Ember.get(Ember.lookup, type);
            }
            if (meta.kind === 'belongsTo') {
              return type.singularName() + '_id';
            } else {
              return type.singularName() + '_ids';
            }
          }
          return this._super(key);
        },
        load                 : function (id, hash) {
          localDebug('TravisModel::load:>');
          var attributes, dataKey, diff, incomplete, key, loadedProperties, properties, relationships, _i, _j, _len, _len1;
          this.loadedAttributes = [];
          this.loadedRelationships = [];
          attributes = this.attributes || [];
          relationships = this.relationships || [];
          for (_i = 0, _len = attributes.length; _i < _len; _i++) {
            key = attributes[_i];
            dataKey = this.dataKey(key);
            if (hash.hasOwnProperty(dataKey)) {
              this.loadedAttributes.pushObject(key);
            }
          }
          for (_j = 0, _len1 = relationships.length; _j < _len1; _j++) {
            key = relationships[_j];
            dataKey = this.dataKey(key);
            if (hash.hasOwnProperty(dataKey)) {
              this.loadedRelationships.pushObject(key);
            }
          }
          incomplete = Ember.EnumerableUtils.intersection(this.loadedAttributes, attributes).length !== attributes.length || Ember.EnumerableUtils.intersection(this.loadedRelationships, relationships).length !== relationships.length;
          if (incomplete) {
            properties = attributes.concat(relationships);
            loadedProperties = this.loadedAttributes.concat(this.loadedRelationships);
            diff = properties.diff(loadedProperties);
            /*
            console.log(this.constructor, 'with id', id, 'loaded as incomplete, info:', {
              diff       : diff,
              attributes : loadedProperties,
              data       : hash
            });
            */
          }
          this.set('incomplete', incomplete);
          return this._super(id, hash);
        },
        getAttr              : function (key) {
          localDebug('TravisModel::getAttr:>');
          this.needsCompletionCheck(key);
          return this._super.apply(this, arguments);
        },
        getBelongsTo         : function (key, type, meta) {
          localDebug('TravisModel::getBelongsTo:>');
          if (!key) {
            key = type.singularName() + '_id';
          }
          this.needsCompletionCheck(key);
          return this._super(key, type, meta);
        },
        getHasMany           : function (key, type, meta) {
          localDebug('TravisModel::getHasMany:>');
          if (!key) {
            key = type.singularName() + '_ids';
          }
          this.needsCompletionCheck(key);
          return this._super(key, type, meta);
        },
        needsCompletionCheck : function (key) {
          localDebug('TravisModel::needsCompletionCheck:>');
          if (key && (this.isAttribute(key) || this.isRelationship(key)) && this.get('incomplete') && !this.isPropertyLoaded(key)) {
            return this.loadTheRest(key);
          }
        },
        isAttribute          : function (name) {
          localDebug('TravisModel::isAttribute:>');
          return this.attributes.contains(name);
        },
        isRelationship       : function (name) {
          localDebug('TravisModel::isRelationship:>');
          return this.relationships.contains(name);
        },
        loadTheRest          : function (key) {
          localDebug('TravisModel::loadTheRest:>');
          var message;
          if (!key || key === 'undefined') {
            return;
          }
          message = "Load missing fields for " + (this.constructor.toString()) + " because of missing key '" + key + "', cid: " + (this.get('clientId')) + ", id: " + (this.get('id'));
          if (this.isAttribute('state') && key !== 'state') {
            message += ", in state: " + (this.get('state'));
          }
          localDebug(message);
          if (this.get('isCompleting')) {
            return;
          }
          this.set('isCompleting', true);
          return this.reload();
        },
        select               : function () {
          localDebug('TravisModel::select:>');
          return this.constructor.select(this.get('id'));
        },
        isPropertyLoaded     : function (name) {
          localDebug('TravisModel::isPropertyLoaded:>');
          return this.loadedAttributes.contains(name) || this.loadedRelationships.contains(name);
        }
      });

  TravisModel.reopenClass({
    select         : function (id) {
      localDebug('TravisModel::select (reopened):>');
      return this.find().forEach(function (record) {
        return record.set('selected', record.get('id') === id);
      });
    },
    buildURL       : function (suffix) {
      localDebug('TravisModel::buildURL:>');
      var base, url;
      base = this.url || this.pluralName();
      Ember.assert('Base URL (' + base + ') must not start with slash', !base || base.toString().charAt(0) !== '/');
      Ember.assert('URL suffix (' + suffix + ') must not start with slash', !suffix || suffix.toString().charAt(0) !== '/');
      url = [base];
      if (suffix !== void 0) {
        url.push(suffix);
      }
      return url.join('/');
    },
    singularName   : function () {
      localDebug('TravisModel::singularName:>');
      var name, parts;
      parts = this.toString().split('.');
      name = parts[parts.length - 1];
      return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
    },
    pluralName     : function () {
      localDebug('TravisModel::pluralName:>');
      return this.singularName() + 's';
    },
    collectionKey  : function () {
      return this.pluralName();
    }.property(),
    rootKey        : function () {
      return this.singularName();
    }.property(),
    isModel        : function () {
      return true;
    }.property(),
    isRecordLoaded : function (id) {
      return !!this._referenceForId(id).record;
    },
    camelizeKeys   : true
  });

  return TravisModel;
});