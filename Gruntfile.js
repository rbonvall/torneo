module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'app/js/**/*.js'
            ]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};

