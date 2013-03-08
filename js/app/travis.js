/*exported Travis*/
define([
  'ember',
  'app/utils',
  'models/Store',
  'app/views',
  'app/routes',
  'app/controllers',
  'app/models'
], function (Ember, utils, Store, views, routes, controllers, models) {

  // check out this for debugging tips - http://www.akshay.cc/blog/2013-02-22-debugging-ember-js-and-ember-data.html
  var Travis = Ember.Application.create({
//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    LOG_TRANSITIONS: true,
//>>excludeEnd('appBuildExclude');
    VERSION: '0.0.1',
    Store: Store,
    ready: function () {
      utils.debug('Ember is ready');
    }
  });

  //Routes
  Travis.Router.map(function () {
    this.resource('repos');
  });

  utils.debug('Travis created and router map setup');

  // views
  Travis.reopen(views);
  // routes
  Travis.reopen(routes);
  // controllers
  Travis.reopen(controllers);
  // models
  Travis.reopen(models);

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
