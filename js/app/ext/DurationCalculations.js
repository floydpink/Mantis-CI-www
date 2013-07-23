define([
  'ember',
  'ext/Helpers'
], function (Ember, Helpers) {
  return Ember.Mixin.create({
    duration   : function () {
      var duration;
      if (duration = this.get('_duration')) {
        return duration;
      } else {
        return Helpers.durationFrom(this.get('startedAt'), this.get('finishedAt'));
      }
    }.property('_duration', 'finishedAt', 'startedAt'),
    updateTimes: function () {
      if (!['rootState.loaded.reloading', 'rootState.loading'].contains(this.get('stateManager.currentState.path'))) {
        this.notifyPropertyChange('_duration');
        this.notifyPropertyChange('finished_at');
      }
    }
  });
});