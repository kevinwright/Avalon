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
      print: {
        options: {
          compress: true,
          cleancss: true
        },
        src: ['public/css/print.less'],
        dest: 'public/css/print.css'
      },
    },
    markade: {
      docs: {
        options: {
          config: {
            pages: ["index.html", "library.html", "pages.html", "intro.html", "emails.html", "server.html", "contact.html"]
          },
          template: "views/howto.jade",
        },
        files: {
          "public/howto": "/library/howto/*.md"
        }
      },
      email: {
        options: {
          "config": yaml.safeLoad(fs.readFileSync("/library/emails/config.yaml")),
          "template": "views/emails/default.jade",
          "jade": {
            pretty: true
          }
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
          src: ['*.html'],
          cwd: 'tmp/emails',
          ext: '.html',
          dest: 'public/emails',
        }]
      }
    },
    jshint: {
      server: {
        options: {
          "undef": true,
          "unused": true,
          "eqeqeq": true,
          "latedef": true,
          "singleGroups": true,
          "node": true,
          "mocha": true,
          "browser": true,
          "predef": [  ]
        },
        files: {
          src: ['controller/*.js', 'controller/**/*.js', 'routes/*.js', 'helper/*.js']
        },
      }
    },
    autoprefixer: {
      options: {
        safe: true,
        browsers: ['last 20 versions', '> 1%', "ie >= 6", "iOS >= 1"]
      },
      dev: {
        src: ['public/css/style.css'],
        dest: 'public/css/style.css'
      },
    },
    mochacli: {
      production: {
        options: {
            env: {NODE_ENV: "production", "TEST": true},
            bail: true,
            filesRaw: ["test/*.test.js"]
        }
      },
      development: {
        options: {
            env: {NODE_ENV: "development", "TEST": true},
            bail: true,
            filesRaw: ["test/*.test.js"]
        }
      }
    },
    watch: {
      less: {
        files: ['public/css/*.less'],
        tasks: ['less', 'autoprefixer'],
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask("test", ["jshint", "mochacli:production"]);
  grunt.registerTask("dev", ["jshint", "mochacli:development"]);
  grunt.registerTask('default', ["less", "autoprefixer", 'watch']);
  grunt.registerTask("docs", "markade:docs");
  grunt.registerTask('email', ["markade:email", "emailBuilder"]);
};
