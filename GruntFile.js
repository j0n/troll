module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/lib/*.js', '!public/lib/box2dweb.min.js'],
        dest: 'public/dist/libs.js'
      }
    },
    watch: {
      test: {
        files: ['public/js/*.js'],
        tasks: ['jshint'],
        options: {
          nospawn: true
        },
      },
      src: {
        files: ['public/lib/*.js'],
        tasks: ['concat', 'uglify'],
      }
    },
    uglify: {
      libs: {
        files: {
          'public/dist/libs.min.js': ['public/dist/libs.js']
        }
      }
    },
   jshint: {
     files: ['public/js/*.js'],
     // configure JSHint (documented at http://www.jshint.com/docs/)
     options: {
       // more options here if you want to override JSHint defaults
       globals: {
         jQuery: true,
         console: true,
         module: true
       }
     }
   },
   requirejs: {
     compile: {
       options: {
         optimize: 'uglify',
          baseUrl: "./public",
          name: "js/troll.start",
          out: "public/dist/<%= pkg.name %>-<%= pkg.version %>.min.js"
       }
     }
   }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'requirejs']);

};
