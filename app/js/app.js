(function (app) {

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/:t/matches'     , { templateUrl: 'partials/matches.html'   , controller: 'MatchesController'   })
            .when('/:t/stats'       , { templateUrl: 'partials/stats.html'     , controller: 'StatsController'     })
            // .when('/summary'  , { templateUrl: 'partials/summary.html'  , controller: 'SummaryController'   })
            // .when('/matrix'   , { templateUrl: 'partials/matrix.html'   , controller: 'MatrixController'    })
            // .otherwise({ redirectTo: '/2013a/stats' })
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
    }]);

    app.controller('StatsController', ['$scope', 'Tournament', '$routeParams', function ($scope, Tournament, $routeParams) {
        $scope.tournament = Tournament.query({ t: $routeParams.t }, function (response) {
            $scope.stats = computeStats(response);
            $scope.sortedTeams = sortedTeams($scope.stats);
            $scope.matchesByTeam = matchesByTeam(response);
            $scope.infoFor = infoFor;
            $scope.nrMatchdays = numberOfMatchdays(response);
        });
        $scope.boxColorHue = {home: 210, away: 30};
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
        return function (kickoff) {
            if (!kickoff) {
                return "";
            }
            var months = 'ene feb mar abr may jun jul ago sep oct nov dic'.split(/ /);
            var d = new Date(kickoff);
            return d.getDate() + " " + months[d.getMonth()];
        };
    });

    app.filter('percent', function () {
        return function (x) {
            return (100 * x).toFixed(2).toString() + "%";
        };
    });

})(angular.module('TorneoApp', ['ngResource', 'ngRoute']));
