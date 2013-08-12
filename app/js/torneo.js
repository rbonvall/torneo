var initialStats = function () {
    return {
        goals:   { for_: 0, against: 0 },
        matches: { won: 0, drawn: 0, lost: 0 }
    };
};

var computeStats = function (tournament) {
    var stats = {};

    console.log(tournament);
    _.chain(tournament.teams).keys().each(function (team) {
        stats[team] = initialStats();
    });

    _(tournament.matches).each(function (match) {
        if (_(match.score).isEmpty()) {
            return;
        }

        var home_team = match.teams[0], home_goals = match.score[0],
            away_team = match.teams[1], away_goals = match.score[1];

        stats[home_team].goals.for_    += home_goals;
        stats[home_team].goals.against += away_goals;
        stats[away_team].goals.for_    += away_goals;
        stats[away_team].goals.against += home_goals;

        if (home_goals === away_goals) {
            stats[home_team].matches.drawn += 1;
            stats[away_team].matches.drawn += 1;
        }
        else if (home_goals > away_goals) {
            stats[home_team].matches.won  += 1;
            stats[away_team].matches.lost += 1;
        }
        else if (home_goals < away_goals) {
            stats[home_team].matches.lost += 1;
            stats[away_team].matches.won  += 1;
        }
        else { console.error('Unreachable.'); }
    });

    return stats;
};

var sortedTeams = function (stats) {
    var teams = _.keys(stats);

    return _(teams).sortBy(function (team) {
        var teamStats = stats[team];
        var pts = 3 * teamStats.matches.won + teamStats.matches.drawn;
        var diff = teamStats.goals.for_ - teamStats.goals.against;
        return -(1000 * pts + diff);
    });
};

var matchesByTeam = function (tournament) {
    var matchesByTeam = {};
    var homeMatches = _(tournament.matches).groupBy(function (m) { return m.teams[0]; });
    var awayMatches = _(tournament.matches).groupBy(function (m) { return m.teams[1]; });
    _.chain(tournament.teams).keys().each(function (team) {
        matchesByTeam[team] = _(homeMatches[team].concat(awayMatches[team])).sortBy('matchday');
    });
    return matchesByTeam;
};

var infoFor = function (team, match) {
    var info = {};
    if (team === match.teams[0]) {
        info.opponent = match.teams[1];
        info.where = 'home';
        if (match.score) {
            if      (match.score[0]  >  match.score[1]) { info.pts = 3; }
            else if (match.score[0] === match.score[1]) { info.pts = 1; }
            else if (match.score[0]  <  match.score[1]) { info.pts = 0; }
        }
    } else if (team === match.teams[1]) {
        info.opponent = match.teams[0];
        info.where = 'away';
        if (match.score) {
            if      (match.score[0]  >  match.score[1]) { info.pts = 0; }
            else if (match.score[0] === match.score[1]) { info.pts = 1; }
            else if (match.score[0]  <  match.score[1]) { info.pts = 3; }
        }
    }
    return info;
};

var numberOfMatchdays = function (tournament) {
    return _.chain(tournament.matches).pluck('matchday').max().value();
};

