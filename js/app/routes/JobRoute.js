define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'models/Job'
], function (Ember, DontSetupModelForControllerMixin, Job) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    renderTemplate  : function () {
      this.container.lookup('controller:job').set('logMetaLess', true);
      this.render('job', { outlet : 'pane', into : 'repo' });
    },
    serialize       : function (model) {
      var id;
      id = model.get ? model.get('id') : model;
      return {
        job_id : id
      };
    },
    setupController : function (controller, model) {
      var repo;
      if (model && !model.get) {
        model = Job.find(model);
      }
      repo = this.controllerFor('repo');
      repo.set('job', model);
      repo.activate('job');
      this.controllerFor('build').set('build', model.get('build'));
      repo.set('build', model.get('build'));
    }
  });
});