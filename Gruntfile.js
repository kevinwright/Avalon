var fs = require("fs");
var yaml = require("js-yaml");

module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      dev: {
        options: {
          compress: true,
          cleancss: true
        },
        src: ['public/css/style.less'],
        dest: 'public/css/style.css'
      },
      email: {
        options: {
          compress: true,
          cleancss: true
        },
        src: ['views/emails/style.less'],
        dest: 'views/emails/style.css'
      },
    },
    markade: {
      def: {
        options: {
          "config": yaml.safeLoad(fs.readFileSync("/library/emails/config.yaml")),
          "template": "views/emails/default.jade"
        },
        files: {
          "tmp/emails": "/library/emails/default/*.md"
        }
      }
    },
    emailBuilder: {
      test: {
        options: {
          applyStyleTags: true,
          removeStyleTags: false
        },
        files : [{
          expand: true,
          src: ['tmp/emails/*.html'],
          dest: 'public/emails',
        }]
      }
    },
    watch: {
      less: {
        files: ['public/css/*.less'],
        tasks: ['less'],
      },
      livereload: {
        options: { livereload: true },
        files: ['public/css/*.css', "views/*.jade", "public/js/*"],
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-markade");
  grunt.loadNpmTasks('grunt-email-builder');

  grunt.registerTask('default', ["less", 'watch']);
  grunt.registerTask('email', ["less:email", "markade", "emailBuilder"]);
};