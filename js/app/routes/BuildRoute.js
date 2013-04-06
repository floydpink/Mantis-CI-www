define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'models/Build',
  'app/utils'
], function (Ember, DontSetupModelForControllerMixin, Build, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    renderTemplate  : function () {
      utils.debug('BuildRoute::renderTemplate:>');
      return this.render('build', {
        outlet : 'pane',
        into   : 'repo'
      });
    },
    serialize       : function (model) {
      var id;
      id = model.get ? model.get('id') : model;
      return {
        build_id : id
      };
    },
    setupController : function (controller, model) {
      var repo;
      if (model && !model.get) {
        model = Build.find(model);
      }
      repo = this.container.lookup('controller:repo');
      repo.set('build', model);
      return repo.activate('build');
    }
  });
});