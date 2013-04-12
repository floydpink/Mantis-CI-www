/*global module:false*/
module.exports = function (grunt) {    // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg            : grunt.file.readJSON('package.json'),
    banner         : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> (<%= gitDescribe %>) - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint         : {
      options   : {
        jshintrc : '.jshintrc'
      },
      gruntfile : {
        src : 'Gruntfile.js'
      },
      lib_test  : {
        src : ['js/app/**/*.js']
      }
    },
    requirejs      : {
      compile : {
        options : {
          baseUrl                    : "js/",
          mainConfigFile             : "js/main.js",
          paths                      : {
            'jquery' : 'lib/jquery-1.9.1.min'
          },
          name                       : 'main',
          out                        : 'js/main.min.js',
          preserveLicenseComments    : false,
          optimize                   : 'uglify2',
          uglify2                    : {
            output   : {
              beautify : false
            },
            compress : {
              sequences     : false,  // join consecutive statemets with the “comma operator”
              properties    : true,  // optimize property access: a["foo"] → a.foo
              dead_code     : false,  // discard unreachable code
              drop_debugger : true,  // discard “debugger” statements
              unsafe        : false, // some unsafe optimizations (see below)
              conditionals  : false,  // optimize if-s and conditional expressions
              comparisons   : true,  // optimize comparisons
              evaluate      : true,  // evaluate constant expressions
              booleans      : true,  // optimize boolean expressions
              loops         : true,  // optimize loops
              unused        : false,  // drop unused variables/functions
              hoist_funs    : false,  // hoist function declarations
              hoist_vars    : false, // hoist variable declarations
              if_return     : false,  // optimize if-s followed by return/continue
              join_vars     : true,  // join var declarations
              cascade       : false,  // try to cascade `right` into `left` in sequences
              side_effects  : false,  // drop side-effect-free statements
              warnings      : true  // warn about potentially dangerous optimizations/code
            },
            warnings : true,
            mangle   : true
          },
          optimizeAllPluginResources : true,
          pragmas                    : { appBuildExclude : false }
        }
      }
    },
    "git-describe" : {
      build : {
        options : {
          prop : "gitDescribe"
        }
      }
    },
    concat         : {
      options : {
        banner       : '<%= banner %>',
        stripBanners : true
      },
      dist    : {
        src  : ['js/main.min.js'],
        dest : 'js/main.js'
      }
    },
    cssmin         : {
      compress : {
        options : {
          banner              : '<%= banner %>',
          keepSpecialComments : 0
        },
        files   : {
          'css/style.min.css' : ['css/*.css']
        }
      }
    },
    targethtml     : {
      dist     : {
        files : {
          'index.html' : 'index.html'
        }
      },
      phonegap : {
        files : {
          'index.html' : 'index.html'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks("grunt-git-describe");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-targethtml');

  grunt.registerTask('default', ['jshint', 'requirejs']);

  grunt.registerTask('build-base', ['git-describe', 'jshint', 'requirejs', 'concat', 'cssmin']);
  grunt.registerTask('build', ['build-base', 'targethtml:dist']);
  grunt.registerTask('phonegap', ['build-base', 'targethtml:phonegap']);

};
