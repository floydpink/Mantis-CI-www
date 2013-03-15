define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    model: function (params) {
      utils.debug('RepoRoute::model:> params: ' + JSON.stringify(params));
      return Repo.find(params['id']);
    },
    serialize: function (model) {
      var name, owner, slug, _ref;
      slug = model.get ? model.get('slug') : model.slug;
      _ref = slug.split('/');
      owner = _ref[0];
      name = _ref[1];
      return {
        owner: owner,
        name: name
      };
    }
  });
});
