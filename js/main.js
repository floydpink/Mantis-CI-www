//requirejs config
require.config({
  paths:{
    'jquery':'lib/jquery-1.9.1',
    'handlebars':'lib/handlebars',
    'hbs':'lib/hbs',
    'ember':'lib/ember-1.0.0-rc.1',
    'jqm':'lib/jquery.mobile-1.3.0'
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
  app.start();
  utils.log('app successfully started!');
});