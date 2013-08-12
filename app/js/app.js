(function (app) {

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/matches'     , { templateUrl: 'partials/matches.html'  , controller: 'MatchesController'   })
            // .when('/summary'  , { templateUrl: 'partials/summary.html'  , controller: 'SummaryController'   })
            // .when('/standings', { templateUrl: 'partials/standings.html', controller: 'StandingsController' })
            // .when('/matrix'   , { templateUrl: 'partials/matrix.html'   , controller: 'MatrixController'    })
            .otherwise({ redirectTo: '/matches' })
            ;
    }]);

    app.factory('Tournament', function ($resource) {
        return $resource('data/2013a.json', {}, { query: { method: 'GET' } });
    });

    app.controller('MatchesController', ['$scope', 'Tournament', function ($scope, Tournament) {
        $scope.tournament = Tournament.query();
    }]);

    app.filter('matchScore', function () {
        return function (match) {
            if (!match) {
                return "";
            }
            var s = match.score;
            if (s.length === 2) {
                return s.join("–");
            }
            if (match.kickoff) {
                var d = new Date(match.kickoff);
                return d.getDate() + "/" + (d.getMonth() + 1);
            }
            return "•";
        };
    });

})(angular.module('TorneoApp', ['ngResource']));
