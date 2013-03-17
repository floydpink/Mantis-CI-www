define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    setupController: function (controller, model) {
      utils.debug('RepoRoute::setupController:> controller: ' + controller);
      utils.debug('RepoRoute::setupController:> model: ' + model);
      utils.logObject(model);
    },
    model: function (params) {
      utils.debug('RepoRoute::model:> params: ' + JSON.stringify(params));
      return Repo.bySlug(params.owner + '/' + params.name);
    },
    serialize: function (model) {
      //utils.debug('RepoRoute::serialize:> model: ');
      //utils.logObject(model);
      var name, owner, slug, _ref;
      slug = model.get ? model.get('slug') : model.slug;
      _ref = slug.split('/');
      owner = _ref[0];
      name = _ref[1];
      return {
        owner: owner,
        name: name
      };
    },
    deserialize: function (params) {
      utils.debug('RepoRoute::deserialize:> params: ' + JSON.stringify(params));
      var content, observer, proxy, repos, slug;
      slug = "" + params.owner + "/" + params.name;
      content = Ember.Object.create({
        slug: slug,
        isLoaded: false
      });
      proxy = Ember.ObjectProxy.create({
        content: content
      });
      repos = Repo.bySlug(slug);
      observer = function () {
        utils.debug('RepoRoute::deserialize::observer>');
        if (repos.get('isLoaded')) {
          repos.removeObserver('isLoaded', observer);
          return proxy.set('content', repos.objectAt(0));
        }
      };
      if (repos.length) {
        utils.debug('RepoRoute::deserialize:: if repos.length>');
        proxy.set('content', repos[0]);
      } else {
        utils.debug('RepoRoute::deserialize:: else repos.length>');
        repos.addObserver('isLoaded', observer);
      }
      return proxy;
    }
  });
});
