/*global module:false*/
module.exports = function (grunt) {    // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg:grunt.file.readJSON('package.json'),
    banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint:{
      options:{
        jshintrc:'.jshintrc'
      },
      gruntfile:{
        src:'Gruntfile.js'
      },
      lib_test:{
        src:['js/app/**/*.js']
      }
    },
    watch:{
      gruntfile:{
        files:'<%= jshint.gruntfile.src %>',
        tasks:['jshint:gruntfile']
      },
      lib_test:{
        files:'<%= jshint.lib_test.src %>',
        tasks:['jshint:lib_test']
      }
    },
    requirejs:{
      compile:{
        options:{
          baseUrl:"js/",
          mainConfigFile:"js/main.js",
          paths:{
            'jquery':'lib/jquery-1.9.1.min',
            'ember':'lib/ember-1.0.0-rc.1.min',
            'ember-data':'lib/ember-data.min',
            'jqm':'lib/jquery.mobile-1.3.0.min'
          },
          name:'main',
          include:['jqm'],
          out:'js/main.min.js',
          preserveLicenseComments:false,
          optimize:'uglify2',
          optimizeAllPluginResources:true,
          pragmas:{ appBuildExclude:true }
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  //Custom task for renaming the main-built to main
  grunt.registerTask('rename-built','Rename main-built to main.', function(){
    grunt.file.delete('js/main.js');
    grunt.file.copy('js/main.min.js', 'js/main.js');
    grunt.file.delete('js/main.min.js');
    grunt.log.ok('rename-built completed successfully!');
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'requirejs']);

  // Deploy task.
  grunt.registerTask('deploy', ['jshint', 'requirejs', 'rename-built']);

};
