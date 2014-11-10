module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      dev: {
        options: {
          compress: true,
          report: "gzip",
          cleancss: true
        },
        src: ['public/css/style.less'],
        dest: 'public/css/style.css'
      },
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
  grunt.registerTask('default', ["less", 'watch']);
};