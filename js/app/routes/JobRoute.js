define([
  'ember',
  'models/Job'
], function (Ember, Job) {
  return Ember.Route.extend({
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
      var buildObserver, repo;
      if (model && !model.get) {
        model = Job.find(model);
      }
      repo = this.controllerFor('repo');
      repo.set('job', model);
      repo.activate('job');
      // since we're no longer using promises, the setupController resolves right away,
      // so we need to wait for build to be loaded
      buildObserver = function () {
        var build;
        if (build = model.get('build')) {
          this.controllerFor('build').set('build', build);
          repo.set('build', build);
          return model.removeObserver('build', buildObserver);
        }
      };
      return model.addObserver('build', this, buildObserver);
    },
    model           : function (params) {
      return Job.find(params.job_id);
    }
  });
});