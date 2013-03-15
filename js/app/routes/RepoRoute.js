define([
  'ember',
], function (Ember) {
  return Ember.Route.extend({
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
