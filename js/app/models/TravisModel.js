/* global App */
define([
  'jquery',
  'ember',
  'ember-data',
  'store/TravisStore',
  'app/utils'
], function ($, Ember, DS, Store, utils) {

  var TravisModel = DS.Model.extend({
    init                 : function () {
      this.loadedAttributes = [];
      return this._super.apply(this, arguments);
    },
    getAttr              : function (key) {
      this.needsCompletionCheck(key);
      return this._super.apply(this, arguments);
    },
    getBelongsTo         : function (key) {
      this.needsCompletionCheck(key);
      return this._super.apply(this, arguments);
    },
    getHasMany           : function (key) {
      this.needsCompletionCheck(key);
      return this._super.apply(this, arguments);
    },
    needsCompletionCheck : function (key) {
      if (key && (this.constructor.isAttribute(key) || this.constructor.isRelationship(key)) && this.get('incomplete') && !this.isAttributeLoaded(key)) {
        return this.loadTheRest(key);
      }
    },
    update               : function (attrs) {
      var _this = this;
      $.each(attrs, function (key, value) {
        if (key !== 'id') {
          return _this.set(key, value);
        }
      });
      return this;
    },
    isAttributeLoaded    : function (name) {
      return this.get('store').isDataLoadedFor(this.constructor, this.get('clientId'), name);
    },
    isComplete           : function () {
      if (this.get('incomplete')) {
        this.loadTheRest();
        return false;
      } else {
        this.set('isCompleting', false);
        return this.get('isLoaded');
      }
    }.property('incomplete', 'isLoaded'),
    loadTheRest          : function (key) {
      var message;
      if (!key || key === 'undefined') {
        return;
      }
      message = "Load missing fields for " + (this.constructor.toString()) + " because of missing key '" + key + "', cid: " + (this.get('clientId')) + ", id: " + (this.get('id'));
      if (this.constructor.isAttribute('state') && key !== 'state') {
        message += ", in state: " + (this.get('state'));
      }
      utils.debug(message);
      if (this.get('isCompleting')) {
        return;
      }
      this.set('isCompleting', true);
      if (!this.get('stateManager.currentState.path').match(/^rootState.loaded.materializing/)) {
        this.reload();
      }
      return this.set('incomplete', false);
    },
    select               : function () {
      return this.constructor.select(this.get('id'));
    }
  });

  TravisModel.reopenClass({
    find                    : function () {
      if (arguments.length === 0) {
        utils.debug('TravisModel::find:> without args for ' + this);
        return App.store.findAll(this);
      } else {
        utils.debug('TravisModel::find:> with ' + arguments.length + ' args for ' + this);
        return this._super.apply(this, arguments);
      }
    },
    filter                  : function (callback) {
      utils.debug('TravisModel::filter:> for ' + this);
      return App.store.filter(this, callback);
    },
    load                    : function (attrs) {
      utils.debug('TravisModel::load:> for ' + this);
      return App.store.load(this, attrs);
    },
    select                  : function (id) {
      utils.debug('TravisModel::select:> for ' + this);
      return this.find().forEach(function (record) {
        return record.set('selected', record.get('id') === id);
      });
    },
    buildURL                : function (suffix) {
      utils.debug('TravisModel::buildURL:> for ' + this);
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
    singularName            : function () {
      var name, parts;
      parts = this.toString().split('.');
      name = parts[parts.length - 1];
      return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
    },
    pluralName              : function () {
      utils.debug('TravisModel::pluralName:> for ' + this);
      return App.store.adapter.pluralize(this.singularName());
    },
    isAttribute             : function (name) {
      return Ember.get(this, 'attributes').has(name);
    },
    isRelationship          : function (name) {
      //utils.debug('TravisModel::isRelationship:> for ' + this);
      return Ember.get(this, 'relationshipsByName').has(name);
    },
    isHasManyRelationship   : function (name) {
      utils.debug('TravisModel::isHasManyRelationship:> for ' + this);
      var relationship;
      if (relationship = Ember.get(this, 'relationshipsByName').get(name)) {
        return relationship.kind === 'hasMany';
      }
    },
    isBelongsToRelationship : function (name) {
      utils.debug('TravisModel::isBelongsToRelationship:> for ' + this);
      var relationship;
      if (relationship = Ember.get(this, 'relationshipsByName').get(name)) {
        return relationship.kind === 'belongsTo';
      }
    }
  });

  return TravisModel;
});