define([
  'ember',
  'app/utils'
], function (Ember, utils) {

  var get = Ember.get,
      ChunkBuffer = Ember.ArrayProxy.extend({
        timeout               : 5000,
        checkTimeoutFrequency : 1000,
        start                 : 1,
        next                  : 1,
        init                  : function () {
          this._super.apply(this, arguments);
          this.lastInsert = 0;
          this.set('next', this.get('start'));
          this.checkTimeout();
          if (this.get('content.length')) {
            return this.get('queue.content').pushObjects(this.get('content').toArray());
          }
        },
        arrangedContent       : function () {
          return [];
        }.property('content'),
        addObject             : function (obj) {
          return this.get('content').pushObject(obj);
        },
        removeObject          : function (obj) {
          return this.get('content').removeObject(obj);
        },
        replaceContent        : function (idx, amt, objects) {
          return this.get('content').replace(idx, amt, objects);
        },
        queue                 : function () {
          return Ember.ArrayProxy.extend(Ember.SortableMixin, {
            content        : [],
            sortProperties : ['number'],
            sortAscending  : true
          }).create();
        }.property(),
        contentArrayDidChange : function (array, index, removedCount, addedCount) {
          var addedObjects, queue, mapByNumber = function (element) {
            return get(element, 'number');
          };
          this._super.apply(this, arguments);
          if (addedCount) {
            queue = this.get('queue');
            addedObjects = array.slice(index, index + addedCount);
            //utils.debug('Added log parts with numbers:' + addedObjects.map(mapByNumber) + ' current ' + this.get('next'));
            queue.pushObjects(addedObjects);
            this.check();
            return this.inserted();
          }
        },
        check                 : function () {
          var arrangedContent, element, next, queue, toPush;
          queue = this.get('queue');
          next = this.get('next');
          arrangedContent = this.get('arrangedContent');
          toPush = [];
          while (queue.get('firstObject.number') <= next) {
            element = queue.shiftObject();
            if (get(element, 'number') === next) {
              toPush.pushObject(get(element, 'content'));
              next += 1;
            }
          }
          if (toPush.length) {
            arrangedContent.pushObjects(toPush);
          }
          return this.set('next', next);
        },
        inserted              : function () {
          var now;
          now = this.now();
          return this.lastInsert = now;
        },
        checkTimeout          : function () {
          var now;
          now = this.now();
          if (now - this.lastInsert > this.get('timeout')) {
            this.giveUpOnMissingParts();
          }
          return this.set('runLaterId', Ember.run.later(this, this.checkTimeout, this.get('checkTimeoutFrequency')));
        },
        willDestroy           : function () {
          Ember.run.cancel(this.get('runLaterId'));
          return this._super.apply(this, arguments);
        },
        now                   : function () {
          return (new Date()).getTime();
        },
        giveUpOnMissingParts  : function () {
          var number;
          if (number = this.get('queue.firstObject.number')) {
            utils.log('Giving up on missing parts in the buffer, switching to:', number);
            this.set('next', number);
            return this.check();
          }
        }
      });

  return ChunkBuffer;
});