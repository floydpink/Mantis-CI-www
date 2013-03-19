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
      this.notifyPropertyChange('_duration');
      return this.notifyPropertyChange('finished_at');
    }
  });
});