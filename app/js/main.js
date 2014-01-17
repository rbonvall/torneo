require.config({
    paths: {
        underscore: '../lib/underscore/underscore-min',
        angular: '../lib/angular/angular.min',
        ngResource: '../lib/angular/angular-resource.min',
        ngRoute: '../lib/angular/angular-route.min',
        domReady: '../lib/require/domReady'
    },
    shim: {
        underscore: { exports: '_' },
        angular:    { exports: 'angular' },
        ngResource: ['angular'],
        ngRoute:    ['angular']
    },
    deps: ['app']
});
