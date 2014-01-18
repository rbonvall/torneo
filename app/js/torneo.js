define(['underscore'], function (_) {
    "use strict";

    var T = {};

    var initialStats = function () {
        return {
            goals:   { for_: 0, against: 0 },
            matches: { won: 0, drawn: 0, lost: 0, notPlayed: 0,
                played: function () {
                    return this.won + this.drawn + this.lost;
                }
            },

            pts: function () {
                return 3 * this.matches.won + this.matches.drawn;
            },
            diff: function () {
                return this.goals.for_ - this.goals.against;
            },
            rend: function () {
                return this.pts() / (3 * this.matches.played());
            }
        };
    };

    T.computeStats = function (tournament) {
        var stats = {};

        _.chain(tournament.teams).keys().each(function (team) {
            stats[team] = initialStats();
        });

        _(tournament.matches).each(function (match) {
            var homeTeam = match.teams[0],
                awayTeam = match.teams[1];

            if (_(match.score).isEmpty()) {
                stats[homeTeam].matches.notPlayed += 1;
                stats[awayTeam].matches.notPlayed += 1;
                return;
            }

            var homeGoals = match.score[0],
                awayGoals = match.score[1];

            stats[homeTeam].goals.for_    += homeGoals;
            stats[homeTeam].goals.against += awayGoals;
            stats[awayTeam].goals.for_    += awayGoals;
            stats[awayTeam].goals.against += homeGoals;

            if (homeGoals === awayGoals) {
                stats[homeTeam].matches.drawn += 1;
                stats[awayTeam].matches.drawn += 1;
            }
            else if (homeGoals > awayGoals) {
                stats[homeTeam].matches.won  += 1;
                stats[awayTeam].matches.lost += 1;
            }
            else if (homeGoals < awayGoals) {
                stats[homeTeam].matches.lost += 1;
                stats[awayTeam].matches.won  += 1;
            }
            else { console.error('Unreachable.'); }
        });

        return stats;
    };

    T.sortedTeams = function (stats) {
        var teams = _.keys(stats);

        return _(teams).sortBy(function (team) {
            var teamStats = stats[team];
            var pts = 3 * teamStats.matches.won + teamStats.matches.drawn;
            var diff = teamStats.goals.for_ - teamStats.goals.against;
            return -(1e6 * pts + 1e3 * diff + teamStats.goals.for_);
        });
    };

    T.matchesByTeam = function (tournament) {
        var matchesByTeam = {};
        var homeMatches = _(tournament.matches).groupBy(function (m) { return m.teams[0]; });
        var awayMatches = _(tournament.matches).groupBy(function (m) { return m.teams[1]; });
        _.chain(tournament.teams).keys().each(function (team) {
            matchesByTeam[team] = _(homeMatches[team].concat(awayMatches[team])).sortBy('matchday');
        });
        return matchesByTeam;
    };

    T.infoFor = function (team, match) {
        var info = {};
        if (team === match.teams[0]) {
            info.opponent = match.teams[1];
            info.where = 'home';
            if (match.score) {
                info.goalsFor     = match.score[0];
                info.goalsAgainst = match.score[1];
            }
        } else if (team === match.teams[1]) {
            info.opponent = match.teams[0];
            info.where = 'away';
            if (match.score) {
                info.goalsFor     = match.score[1];
                info.goalsAgainst = match.score[0];
            }
        }
        if (match.score) {
            if      (info.goalsFor  >  info.goalsAgainst) { info.pts = 3; }
            else if (info.goalsFor === info.goalsAgainst) { info.pts = 1; }
            else if (info.goalsFor  <  info.goalsAgainst) { info.pts = 0; }
        }
        return info;
    };

    T.numberOfMatchdays = function (tournament) {
        return _.chain(tournament.matches).pluck('matchday').max().value();
    };

    return T;
});
