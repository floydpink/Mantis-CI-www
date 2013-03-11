require.config({
  paths: {
    'jquery': 'lib/jquery-1.9.1',
    'jquery-cookie': 'lib/jquery.cookie',
    'handlebars': 'lib/handlebars',
    'hbs': 'lib/hbs',
    'ember': 'lib/ember-1.0.0-rc.1',
    'ember-data': 'lib/ember-data',
    'models': 'app/models',
    'views': 'app/views',
    'controllers': 'app/controllers',
    'routes': 'app/routes',
    'templates': '../templates'
  },
  shim: {
    'jquery-cookie': ['jquery'],
    'handlebars': {
      exports: 'Handlebars'
    },
    'ember': {
      deps: ['jquery', 'handlebars'],
      exports: 'Ember'
    },
    'ember-data': {
      deps: ['jquery', 'ember'],
      exports: 'DS'
    }
  },
  hbs: {
    templateExtension: 'hbs',
    baseDir: '../templates'
  }
});

require([
  'app/travis',
  'app/utils'
], function (travis, utils) {
  travis.bootstrap();
  utils.debug('app successfully started!');
});