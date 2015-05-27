'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      files: ['Gruntfile.js', 'www/js/*.js', 'www/js/**/*.js'],
      options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint']);

};