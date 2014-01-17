define([
    'domReady!',
    'underscore',
    'torneo',
    'angular',
    'ngResource',
    'ngRoute'
], function (dom, _, Torneo, angular) {

    var app = angular.module('TorneoApp', ['ngResource', 'ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/:t/matches', { templateUrl: 'partials/matches.html',  controller: 'MatchesController'   })
            .when('/:t/stats',   { templateUrl: 'partials/stats.html',    controller: 'StatsController'     })
            // .when('/summary',    { templateUrl: 'partials/summary.html',  controller: 'SummaryController'   })
            // .when('/matrix',     { templateUrl: 'partials/matrix.html',   controller: 'MatrixController'    })
            .when('/',           { templateUrl: 'partials/front.html',    controller: 'FrontPageController' })
            .otherwise({ redirectTo: '/2013a/stats' })
            ;
    }]);

    app.factory('Tournament', ['$resource', function ($resource) {
        return $resource('data/:t.json', { t: '@t' }, { query: { method: 'GET', cache: true } });
    }]);

    app.controller('MatchesController', ['$scope', 'Tournament', '$routeParams', function ($scope, Tournament, $routeParams) {
        $scope.tournament = Tournament.query({ t: $routeParams.t }, function (response) {
            $scope.matchesByMatchday = _(response.matches).groupBy('matchday');
            $scope.matchdays = _($scope.matchesByMatchday).keys();
        });
        $scope.currentTournament.id = $routeParams.t;
    }]);

    app.controller('StatsController', ['$scope', 'Tournament', '$routeParams', function ($scope, Tournament, $routeParams) {
        $scope.tournament = Tournament.query({ t: $routeParams.t }, function (response) {
            $scope.stats = Torneo.computeStats(response);
            $scope.sortedTeams = Torneo.sortedTeams($scope.stats);
            $scope.matchesByTeam = Torneo.matchesByTeam(response);
            $scope.infoFor = Torneo.infoFor;
            $scope.nrMatchdays = Torneo.numberOfMatchdays(response);
        });
        $scope.boxColorHue = {home: 210, away: 30};
        $scope.currentTournament.id = $routeParams.t;
    }]);

    app.controller('FrontPageController', ['$scope', function ($scope) {
        $scope.tournaments = [
            { code: 'elim2014', name: '2014 Eliminatorias Conmebol' },
            { code: '2013t',    name: '2013 Transición' },
            { code: '2013a',    name: '2013–14 Apertura' },
            { code: '2014c',    name: '2013–14 Clausura' }
        ];
    }]);

    app.controller('NavController', ['$scope', function ($scope) {
        $scope.currentTournament = {};
    }]);

    app.filter('signed', function () {
        return function (input) {
            if      (input > 0) { return "+" + input; }
            else if (input < 0) { return "−" + -input; }
            else                { return input.toString(); }
        };
    });

    app.filter('matchScore', function () {
        return function (match) {
            if (!match) {
                return "";
            }
            var s = match.score;
            if (s.length === 2) {
                return s.join("–");
            }
            return "";
        };
    });

    app.filter('kickoff', function () {
        var months = 'ene feb mar abr may jun jul ago sep oct nov dic'.split(/ /);
        var weekdays = 'do lu ma mi ju vi sá'.split(/ /);
        return function (kickoff) {
            if (!kickoff) {
                return "";
            }
            var d = new Date(kickoff);
            return weekdays[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()];
        };
    });

    app.filter('percent', function () {
        return function (x) {
            if (isNaN(x)) {
                return "";
            }
            return (100 * x).toFixed(1).toString() + "%";
        };
    });

    angular.bootstrap(dom, ['TorneoApp']);

});
