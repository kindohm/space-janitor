;(function(exports, $){

  var gameUrl = 'http://orbital-janitor-api.azurewebsites.net/api/game/{0}';
  var utils = new ViewModelUtils();

  var LevelViewModel = function(levelDto){
    this.number = levelDto.Number;
    this.asteroidsKilled = levelDto.AsteroidsKilled;
    this.asteroidsKilledByBullet = levelDto.AsteroidsKilledByBullet;
    this.asteroidsKilledByRadialBlast = levelDto.AsteroidsKilledByRadialBlast;
    this.asteroidsKilledByPlayerCollision = levelDto.AsteroidsKilledByPlayerCollision;
    this.shotsFired = levelDto.ShotsFired;
    this.shotPercentage = (levelDto.ShotPercentage * 100).toFixed(0) + '%';
    this.ufosKilled = levelDto.UfosKilled;
    this.ufosKilledByBullet = levelDto.UfosKilledByBullet;
    this.ufosKilledByRadialBlast = levelDto.UfosKilledByRadialBlast;
    this.ufosKilledByPlayerCollision = levelDto.UfosKilledByPlayerCollision;
    this.deathsByAsteroid = levelDto.DeathsByAsteroidCollision;
    this.deathsByUfoBullet = levelDto.DeathsByUfoBullet;
    this.deathsByUfoCollision = levelDto.DeathsByUfoCollision;
    this.totalDeaths = levelDto.TotalDeaths;
    this.radialBlastsCaptured = levelDto.RadialBlastsCaptured;
    this.radialBlastsDeployed = levelDto.RadialBlastsDeployed;
    this.spraysCaptured = levelDto.SpraysCaptured;
    this.rapidFiresCaptured = levelDto.RapidFiresCaptured;
    this.totalKills = this.asteroidsKilled + this.ufosKilled;
  };

  var GameViewModel = function(){
    this.playerName = ko.observable('');
    this.score = ko.observable('');
    this.date = ko.observable('');
    this.difficulty = ko.observable('');
    this.levelReached = ko.observable('');
    this.asteroidsKilled = ko.observable('');
    this.asteroidsKilledByBullet = ko.observable('');
    this.asteroidsKilledByRadialBlast = ko.observable('');
    this.asteroidsKilledByPlayerCollision = ko.observable('');
    this.ufosKilled = ko.observable('');
    this.ufosKilledByBullet = ko.observable('');
    this.ufosKilledByRadialBlast = ko.observable('');
    this.ufosKilledByPlayerCollision = ko.observable('');
    this.shotsFired = ko.observable('');
    this.shotPercentage = ko.observable('');
    this.totalDeaths = ko.observable('');
    this.deathsByAsteroid = ko.observable('');
    this.deathsByUfoBullet = ko.observable('');
    this.deathsByUfoCollision = ko.observable('');
    this.radialBlastsCaptured = ko.observable('');
    this.spraysCaptured = ko.observable('');
    this.rapidFiresCaptured = ko.observable('');
    this.radialBlastsDeployed = ko.observable('');
    this.totalKills = ko.observable('');
    this.levels = ko.observableArray([]);
    this.version = ko.observable('');

    this.load();
  };

  GameViewModel.prototype = {

    load: function(){

      var self = this;
      var id = utils.getParameterByName('id');
      var url = gameUrl.replace('{0}', id);

      // all time leaderboard
      $.ajax({
        url: url
      })
      .done(function(result){
        self.playerName(result.Player);
        self.score(utils.numberWithCommas(result.Score));
        self.date(utils.getDateDisplay(new Date(result.End)));
        self.asteroidsKilled(result.AsteroidsKilled);
        self.asteroidsKilledByBullet(result.AsteroidsKilledByBullet);
        self.asteroidsKilledByRadialBlast(result.AsteroidsKilledByRadialBlast);
        self.asteroidsKilledByPlayerCollision(result.AsteroidsKilledByPlayerCollision);
        self.ufosKilled(result.UfosKilled);
        self.ufosKilledByBullet(result.UfosKilledByBullet);
        self.ufosKilledByRadialBlast(result.UfosKilledByRadialBlast);
        self.ufosKilledByPlayerCollision(result.UfosKilledByPlayerCollision);
        self.difficulty(utils.mapDifficulty(result.Difficulty));
        self.levelReached(result.LevelReached);
        self.shotsFired(result.ShotsFired);
        self.shotPercentage((result.ShotPercentage * 100).toFixed(0) + '%');
        self.totalDeaths(result.TotalDeaths);
        self.deathsByAsteroid(result.DeathsByAsteroidCollision);
        self.deathsByUfoBullet(result.DeathsByUfoBullet);
        self.deathsByUfoCollision(result.DeathsByUfoCollision);
        self.radialBlastsCaptured(result.RadialBlastsCaptured);
        self.spraysCaptured(result.SpraysCaptured);
        self.rapidFiresCaptured(result.RapidFiresCaptured);
        self.radialBlastsDeployed(result.RadialBlastsDeployed);
        self.totalKills(result.AsteroidsKilled + result.UfosKilled);
        self.version(result.Version);
        for (var i = 0; i < result.Levels.length; i++){
          self.levels.push(new LevelViewModel(result.Levels[i]));
        }

        $('#wait').hide();
        $('#game-info').show();

      })
      .fail(function(){
        console.log('game data fail');
      });

    }

  };

  exports.GameViewModel = GameViewModel;

})(this, jQuery);