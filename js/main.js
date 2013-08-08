require.config({
  paths : {
    'jquery'          : 'lib/jquery-2.0.3',
    'jquery-cookie'   : 'lib/jquery.cookie',
    'jquery-throttle' : 'lib/jquery.throttle',
    'jquery-timeago'  : 'lib/jquery.timeago',
    'handlebars'      : 'lib/handlebars',
    'hbs'             : 'lib/hbs',
    'ember'           : 'lib/ember',
    'ember-model'     : 'lib/ember-model',
    'pusher'          : 'lib/pusher',
    'ansiparse'       : 'lib/ansiparse',
    'visibility'      : 'lib/visibility-0.6.2.min',
    'ext'             : 'app/ext',
    'store'           : 'app/store',
    'models'          : 'app/models',
    'views'           : 'app/views',
    'controllers'     : 'app/controllers',
    'routes'          : 'app/routes',
    'templates'       : 'app/templates'
  },
  shim  : {
    'jquery-cookie'   : ['jquery'],
    'jquery-throttle' : ['jquery'],
    'jquery-timeago'  : ['jquery'],
    'handlebars'      : {
      exports : 'Handlebars'
    },
    'ember'           : {
      deps    : ['jquery', 'handlebars'],
      exports : 'Ember'
    },
    'ember-model'     : {
      deps    : ['ember'],
      exports : 'Ember'
    },
    'pusher'          : {
      exports : 'Pusher'
    },
    'ansiparse'       : {
      exports : 'ansiparse'
    },
    'visibility'      : {
      exports : 'Visibility'
    }
  },
  hbs   : {
    templateExtension : 'hbs',
    baseDir           : 'templates'
  }
});

require([
  'app/travis',
  'app/utils'
], function (travis, utils) {
  travis.bootstrap();
  utils.debug('main::> App successfully started!');
});