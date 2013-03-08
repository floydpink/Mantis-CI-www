/*exported Travis*/
define([
  'ember',
  'app/utils',
  'models/Store',
  'views/IndexView',
  'routes/IndexRoute',
  'routes/ReposRoute',
  'models/Repo',
  'views/ReposView',
  'controllers/ReposController',
  'routes/ReposBuildsRoute',
  'models/Builds'
], function (Ember, utils, Store, IndexView, IndexRoute, ReposRoute, Repo, ReposView, ReposController, ReposBuildsRoute, Builds) {

  // check out this for debugging tips - http://www.akshay.cc/blog/2013-02-22-debugging-ember-js-and-ember-data.html
  var Travis = Ember.Application.create({
//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    LOG_TRANSITIONS: true,
//>>excludeEnd('appBuildExclude');
    VERSION: '0.0.1',
    ready: function () {
      utils.debug('Ember is ready');
    }
  });

  //Routes
  Travis.Router.map(function () {
    this.resource('repos', function () {
      this.resource('repos.builds', { path: ':repo_id/builds'}, function () {
        this.route('log', { path: ':build_id'});
      });
    });
  });

  utils.debug('Travis created and router map setup');

  Travis.reopen({
    Store: Store,
    IndexRoute: IndexRoute,
    IndexView: IndexView,
    ReposRoute: ReposRoute,
    Repo: Repo,
    ReposView: ReposView,
    ReposController: ReposController,
    ReposBuildsRoute: ReposBuildsRoute,
    Builds: Builds
  });

//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  Ember.LOG_BINDINGS = true;
//>>excludeEnd('appBuildExclude');

  // Fake
  // Data
  // Below

  Travis.Repo.FIXTURES = [
    {
      id: 1,
      name: 'flickr downloadr',
      builds: [10, 11, 12]
    },
    {
      id: 2,
      name: 'flickr downloadr blog',
      builds: [20, 21, 22]
    }
  ];

  Travis.Builds.FIXTURES = [
    {
      id: 10,
      number: '224979',
      message: 'Awesome build number 3'
    },
    {
      id: 11,
      number: '224980',
      message: 'Awesome build number 2'
    },
    {
      id: 12,
      number: '224981',
      message: 'Awesome build number 1'
    },
    {
      id: 20,
      number: '225979',
      message: 'Awesome Blog build number 3'
    },
    {
      id: 21,
      number: '225980',
      message: 'Awesome Blog build number 2'
    },
    {
      id: 22,
      number: '225981',
      message: 'Awesome Blog build number 1'
    }
  ];

  window.Travis = Travis;

  return Travis;
});
