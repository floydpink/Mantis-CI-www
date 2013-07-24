define([
  'ember'
], function (Ember) {
  var LimitedArray = Ember.ArrayProxy.extend({
    limit                  : 10,
    isLoadedBinding        : 'content.isLoaded',
    init                   : function () {
      return this._super.apply(this, arguments);
    },
    arrangedContent        : function () {
      var content;
      content = this.get('content');
      if (this.get('disabled')) {
        return content;
      } else if (content) {
        return content.slice(0, this.get('limit'));
      }
    }.property('content', 'limit', 'disabled'),
    totalLength            : function () {
      return this.get('content.length');
    }.property('content.length'),
    leftLength             : function () {
      var limit, totalLength;
      totalLength = this.get('totalLength');
      limit = this.get('limit');
      if (this.get('disabled') || totalLength <= limit) {
        return 0;
      } else {
        return totalLength - limit;
      }
    }.property('totalLength', 'limit', 'disabled'),
    isMore                 : function () {
      return !this.get('disabled') && this.get('leftLength') > 0;
    }.property('leftLength'),
    showAll                : function () {
      return this.set('disabled', true);
    },
    contentArrayWillChange : function (array, index, removedCount) {
      var arrangedContent, removedObjects;
      this._super.apply(this, arguments);
      if (this.get('disabled')) {
        return;
      }
      if (removedCount) {
        arrangedContent = this.get('arrangedContent');
        removedObjects = array.slice(index, index + removedCount);
        return arrangedContent.removeObjects(removedObjects);
      }
    },
    contentArrayDidChange  : function (array, index, removedCount, addedCount) {
      var addedObjects, limit;
      this._super.apply(this, arguments);
      if (this.get('disabled')) {
        return;
      }
      limit = this.get('limit');
      if (addedCount) {
        if (index < limit) {
          addedObjects = array.slice(index, index + addedCount);
          this.get('arrangedContent').replace(index, 0, addedObjects);
        }
      }
      return this.balanceArray();
    },
    balanceArray           : function () {
      var arrangedContent, content, count, length, limit, next, _results, notInArrangedContent;
      limit = this.get('limit');
      arrangedContent = this.get('arrangedContent');
      length = arrangedContent.get('length');
      content = this.get('content');
      if (length > limit) {
        return arrangedContent.replace(limit, length - limit);
      } else if (length < limit && content.get('length') > length) {
        count = limit - length;
        _results = [];
        notInArrangedContent = function (object) {
          return !arrangedContent.contains(object);
        };
        while (count > 0) {
          if (next = content.find(notInArrangedContent)) {
            arrangedContent.pushObject(next);
          }
          _results.push(count -= 1);
        }
        return _results;
      }
    }
  });

  return LimitedArray;

});