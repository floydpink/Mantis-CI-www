/*global module:false*/
module.exports = function (grunt) {    // Project configuration.
  grunt.initConfig(
      {
        // Metadata.
        pkg                   : grunt.file.readJSON('package.json'),
        banner                : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> (<%= gitDescribe %>) - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        "git-describe-string" : '<%= gitDescribe %>',
        // Task configuration.
        includereplace        : {
          dist : {
            options : {
              globals : {
                appVersion         : 'v<%= pkg.version %>',
                gitDescribeVersion : '<%= gitDescribe %>'
              }
            },
            src     : 'js/app/templates/about.hbs',
            dest    : '.'
          }
        },
        jshint                : {
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
        requirejs             : {
          options : {
            baseUrl                    : "js/",
            mainConfigFile             : "js/main.js",
            paths                      : {
              'jquery' : 'lib/jquery-2.0.3.min'
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
            pragmas                    : { distBuildExclude : true }
          },
          dev     : {
            // override task level options to get a dev build
            options : {
              uglify2                    : {
                output   : {
                  beautify : true
                },
                warnings : false,
                mangle   : false
              },
              optimizeAllPluginResources : false,
              pragmas                    : { distBuildExclude : false }
            }
          },
          dist    : {
            options : {
              pragmas : { distBuildExclude : true }
            }
          }
        },
        "git-describe"        : {
          build : {
            options : {
              prop : "gitDescribe"
            }
          }
        },
        concat                : {
          options : {
            banner       : '<%= banner %>',
            stripBanners : true
          },
          dist    : {
            src  : ['js/main.min.js'],
            dest : 'js/main.js'
          }
        },
        cssmin                : {
          compress : {
            options : {
              banner              : '<%= banner %>',
              keepSpecialComments : 0
            },
            files   : {
              'css/style.min.css' : ['css/*.css', '!css/style.min.css']
            }
          }
        },
        targethtml            : {
          dist    : {
            files : {
              'index.html' : 'index.html'
            }
          },
          android : {
            files : {
              'index.html' : 'index.html'
            }
          },
          ios     : {
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
  grunt.loadNpmTasks('grunt-include-replace');

  grunt.registerTask('write-git-describe', 'Writes the git-describe version string to a file.', function () {
    this.requires('git-describe');
    var gitDescribeString = grunt.config.get('git-describe-string');
    grunt.verbose.writeln('Writing "git-describe" version string "%s" to the file named "git-describe"', gitDescribeString);
    grunt.file.write('git-describe', gitDescribeString);
    grunt.log.ok('Wrote the "git-describe" version to disk.');
  });

  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('pre-require', ['git-describe', 'write-git-describe', 'includereplace', 'jshint']);
  grunt.registerTask('post-require', ['concat', 'cssmin']);

  grunt.registerTask('build-dev', ['pre-require', 'requirejs:dev', 'post-require']);
  grunt.registerTask('build-dist', ['pre-require', 'requirejs:dist', 'post-require']);

  //dev tasks
  grunt.registerTask('android-dev', ['build-dev', 'targethtml:android']);
  grunt.registerTask('ios-dev', ['build-dev', 'targethtml:ios']);

  //dist tasks
  grunt.registerTask('web', ['build-dist', 'targethtml:dist']);
  grunt.registerTask('android', ['build-dist', 'targethtml:android']);
  grunt.registerTask('ios', ['build-dist', 'targethtml:ios']);

};
