define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'models/Job'
], function (Ember, DontSetupModelForControllerMixin, Job) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    renderTemplate  : function () {
      return this.render('job', {
        outlet : 'pane',
        into   : 'repo'
      });
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
      repo = this.container.lookup('controller:repo');
      repo.set('job', model);
      return repo.activate('job');
    }
  });
});