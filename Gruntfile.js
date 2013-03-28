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
            'jquery' : 'lib/jquery-1.9.1.min',
            'ember'  : 'lib/ember-1.0.0-rc.1.min'
          },
          name                       : 'main',
          out                        : 'js/main.min.js',
          preserveLicenseComments    : false,
          optimize                   : 'uglify2',
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
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks("grunt-git-describe");
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint', 'requirejs']);

  grunt.registerTask('build', ['git-describe', 'jshint', 'requirejs', 'concat']);

};
