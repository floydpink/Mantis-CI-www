//requirejs config
require.config({
  paths:{
    'jquery':'lib/jquery-1.9.1',
    'handlebars':'lib/handlebars',
    'hbs':'lib/hbs',
    'ember':'lib/ember-1.0.0-rc.1',
    'ember-data':'lib/ember-data',
    'jqm':'lib/jquery.mobile-1.3.0',
    'templates':'../templates',
    'models':'app/models',
    'views':'app/views',
    'controllers':'app/controllers',
    'routes':'app/routes'
  },
  shim:{
    'jquery':{
      exports:'jQuery'
    },
    'handlebars':{
      exports:'Handlebars'
    },
    'ember':{
      deps:['jquery', 'handlebars'],
      exports:'Ember'
    },
    'ember-data':{
      deps:['jquery', 'ember'],
      exports:'DS'
    },
    'jqm':{
      deps:['jquery'],
      exports:'jQuery.mobile'
    }
  },
  hbs:{
    templateExtension:'hbs',
    baseDir:'../templates'
  }
});

// start our app
require([
  'app/app',
  'app/utils'
], function (app, utils) {
  app.bootstrap();
  utils.debug('app successfully started!');
});