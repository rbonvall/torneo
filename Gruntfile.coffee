module.exports = (grunt) ->

    grunt.initConfig

        jshint:
            options:
                jshintrc: '.jshintrc'
            all: [
                'Gruntfile.js'
                'app/js/**/*.js'
            ]

    grunt.loadNpmTasks 'grunt-contrib-jshint'

