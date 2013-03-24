define([
  'ember',
  'models/Build',
  'app/utils'
], function (Ember, Build, utils) {
  return Ember.Route.extend({
    fetchLineNumber: function () {
      var match, url;
      url = this.container.lookup('router:main').get('url');
      if (match = url.match(/#L(\d+)$/)) {
        return match[1];
      }
    },
    renderTemplate : function () {
      return this.render('build', {
        outlet: 'buildpane',
        into  : 'repo'
      });
    },
    serialize      : function (model, params) {
      var id;
      id = model.get ? model.get('id') : model;
      return {
        build_id: id
      };
    },
    setupController: function (controller, model) {
      var lineNumber, repo;
      if (model && !model.get) {
        model = Build.find(model);
      }
      if (lineNumber = this.fetchLineNumber()) {
        controller.set('lineNumber', lineNumber);
      }
      repo = this.container.lookup('controller:repo');
      repo.set('build', model);
      return repo.activate('build');
    }
  });
});