define([
  'ember',
  'hbs!jobs/list'
], function (Ember) {
  var JobsView = Ember.View.extend({
    templateName: 'jobs/list',
    buildBinding: 'controller.build'
  });
  return JobsView;
});
