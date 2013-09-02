define([
  'ember-model'
], function (Ember) {
  return Ember.RecordArray.extend({
    isLoaded                : false,
    isLoading               : false,
    load                    : function (array) {
      var observer, self;
      this.set('isLoading', true);
      self = this;
      observer = function () {
        var content;
        if (this.get('isLoaded')) {
          content = self.get('content');
          array.removeObserver('isLoaded', observer);
          array.forEach(function (record) {
            if (!self.contains(record)) {
              return self.pushObject(record);
            }
          });
          self.set('isLoading', false);
          return self.set('isLoaded', true);
        }
      };
      return array.addObserver('isLoaded', observer);
    },
    observe                 : function (collection, filterWith) {
      this.set('filterWith', filterWith);
      return collection.addArrayObserver(this, {
        willChange : 'observedArrayWillChange',
        didChange  : 'observedArraydidChange'
      });
    },
    observedArrayWillChange : function () {
    },
    observedArraydidChange  : function (array, index, removedCount, addedCount) {
      var addedObjects, object, _i, _len, _results;
      addedObjects = array.slice(index, index + addedCount);
      _results = [];
      for (_i = 0, _len = addedObjects.length; _i < _len; _i++) {
        object = addedObjects[_i];
        if (this.get('filterWith').call(this, object)) {
          _results.push(this.pushObject(object));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    pushObject              : function (record) {
      return this.get('content').pushObject(record);
    }
  });

});
