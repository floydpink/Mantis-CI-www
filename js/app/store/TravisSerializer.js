define([
  'ember-data'
], function (DS) {

  var Serializer = DS.RESTSerializer.extend({
    /*
      dirtyRecordsForAttributeChange: function(dirtySet, record) {
        if (record.constructor === Travis.User) {
          return this._super.apply(this, arguments);
        }
      },
      dirtyRecordsForBelongsToChange: function(dirtySet, record) {
        if (record.constructor === Travis.User) {
          return this._super.apply(this, arguments);
        }
      },
      dirtyRecordsForHasManyChange: function(dirtySet, record) {
        if (record.constructor === Travis.User) {
          return this._super.apply(this, arguments);
        }
      },
    */
    merge : function (record, serialized) {
      var data, state;
      data = record.get('data');
      state = record.get('stateManager.currentState.path');
      if (state !== "rootState.loaded.materializing") {
        record.send('materializingData');
      }
      record.eachAttribute(function (name, attribute) {
        var value;
        value = this.extractAttribute(record.constructor, serialized, name);
        if (value !== void 0) {
          value = this.deserializeValue(value, attribute.type);
          if (value !== data.attributes[name]) {
            record.materializeAttribute(name, value);
            return record.notifyPropertyChange(name);
          }
        }
      }, this);
      record.eachRelationship(function (name, relationship) {
        var key, value;
        if (relationship.kind === 'belongsTo') {
          key = this._keyForBelongsTo(record.constructor, relationship.key);
          value = this.extractBelongsTo(record.constructor, serialized, key);
          if (value !== void 0 && data.belongsTo[name] !== value) {
            //TODO: I have no idea if this is the right way to go about this, but it seems to work
            record.materializeBelongsTo(name, this._convertTuple(relationship.type, value));
            return record.notifyPropertyChange(name);
          }
        } else if (relationship.kind === 'hasMany') {
          key = this._keyForHasMany(record.constructor, relationship.key);
          value = this.extractHasMany(record.constructor, serialized, key);
          if (value !== void 0) {
            //TODO: I have no idea if this is the right way to go about this, but it seems to work
            record.materializeHasMany(name, this._convertTuples(relationship.type, value));
            return record.notifyPropertyChange(name);
          }
        }
      }, this);
      return record.notifyPropertyChange('data');
    }
  });

  return Serializer;

});