define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    renderTemplate  : function () {
      utils.debug('RepoRoute::renderTemplate:>');
      return this.render('repo');
    },
    setupController : function (controller, model) {
      utils.debug('RepoRoute::setupController:>');
      controller.set('fullDescriptionVisible', false);
      if (model && !model.get) {
        model = Repo.find(model.id);
      }
      return controller.set('repo', model);
    },
    serialize       : function (repo) {
      var name, owner, slug, _ref;
      slug = repo.get ? repo.get('slug') : repo.slug;
      _ref = slug.split('/'), owner = _ref[0], name = _ref[1];
      return {
        owner : owner,
        name  : name
      };
    },
    model     : function (params) {
      utils.debug('RepoRoute::model:> params: ' + JSON.stringify(params));
      var content, observer, proxy, repos, slug;
      slug = "" + params.owner + "/" + params.name;
      content = Ember.Object.create({
        slug      : slug,
        isLoaded  : false,
        isLoading : true
      });
      proxy = Ember.ObjectProxy.create({
        content : content
      });
      utils.debug('RepoRoute::model:> about to call bySlug');
      repos = Repo.bySlug(slug);
      observer = function () {
        utils.debug('RepoRoute::model::observer>');
        if (repos.get('isLoaded')) {
          repos.removeObserver('isLoaded', observer);
          proxy.set('isLoading', false);
          if (repos.get('length') === 0) {
            return proxy.set('isError', true);
          } else {
            return proxy.set('content', repos.objectAt(0));
          }
        }
      };
      if (repos.length) {
        utils.debug('RepoRoute::model:: if repos.length>');
        proxy.set('content', repos[0]);
      } else {
        utils.debug('RepoRoute::model:: else repos.length>');
        repos.addObserver('isLoaded', observer);
      }
      return proxy;
    }
  });
});
