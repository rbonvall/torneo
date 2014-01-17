module.exports = (grunt) ->

    grunt.initConfig

        jshint:
            options:
                jshintrc: '.jshintrc'
            all: [
                'Gruntfile.js'
                'app/js/**/*.js'
            ]

        connect:
            server:
                options:
                    port: 9090
                    base: 'app'
                    keepalive: true

        rsync:
            options:
                args: ['-a']
            prod:
                options:
                    src: 'app/'
                    dest: 'html/torneo'
                    host: 'rb.8o.cl'

        jscs:
            src: 'app/js/**/*.js'

    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-rsync'
    grunt.loadNpmTasks 'grunt-jscs-checker'

    grunt.registerTask 'deploy', ['rsync:prod']
    grunt.registerTask 'style', ['jshint', 'jscs']

