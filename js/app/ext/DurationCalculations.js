define([
  'ember',
  'ext/Helpers'
], function (Ember, Helpers) {
  return Ember.Mixin.create({
    duration    : function () {
      var duration;
      if (duration = this.get('_duration')) {
        return duration;
      } else {
        return Helpers.durationFrom(this.get('startedAt'), this.get('finishedAt'));
      }
    }.property('_duration', 'finishedAt', 'startedAt'),
    updateTimes : function () {
      if (this.get('stateManager.currentState.path') !== 'rootState.loaded.reloading') {
        this.notifyPropertyChange('_duration');
        this.notifyPropertyChange('finished_at');
      }
    }
  });
});