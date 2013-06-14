;(function(exports){

  var url = 'http://orbital-janitor-api.azurewebsites.net/api/everything';
  var utils = new ViewModelUtils();

  var EverythingViewModel = function(waitId, infoId){
    this.waitId = waitId;
    this.infoId = infoId;
    this.score = ko.observable('');
    this.asteroidsKilled = ko.observable('');
    this.asteroidsKilledByBullet = ko.observable('');
    this.asteroidsKilledByRadialBlast = ko.observable('');
    this.asteroidsKilledByPlayerCollision = ko.observable('');
    this.ufosKilled = ko.observable('');
    this.ufosKilledByBullet = ko.observable('');
    this.ufosKilledByRadialBlast = ko.observable('');
    this.ufosKilledByPlayerCollision = ko.observable('');
    this.shotsFired = ko.observable('');
    this.deaths = ko.observable('');
    this.deathsByAsteroid = ko.observable('');
    this.deathsByUfoBullet = ko.observable('');
    this.deathsByUfoCollision = ko.observable('');
    this.radialBlastsCaptured = ko.observable('');
    this.radialBlastsDeployed = ko.observable('');
    this.rapidFiresCaptured = ko.observable('');
    this.spraysCaptured = ko.observable('');
    this.totalKills = ko.observable('');
    this.gamesPlayed = ko.observable('');
    this.minutesPlayed = ko.observable('');
    this.load();
  };

  EverythingViewModel.prototype = {

    load: function(){

      var self = this;

      $.ajax({
        url: url
      })
      .done(function(result){
        self.score(utils.numberWithCommas(result.Score));
        self.asteroidsKilled(utils.numberWithCommas(result.AsteroidsKilled));
        self.asteroidsKilledByBullet(utils.numberWithCommas(result.AsteroidsKilledByBullet));
        self.asteroidsKilledByRadialBlast(utils.numberWithCommas(result.AsteroidsKilledByRadialBlast));
        self.asteroidsKilledByPlayerCollision(utils.numberWithCommas(result.AsteroidsKilledByPlayerCollision));
        self.ufosKilled(utils.numberWithCommas(result.UfosKilled));
        self.ufosKilledByBullet(utils.numberWithCommas(result.UfosKilledByBullet));
        self.ufosKilledByRadialBlast(utils.numberWithCommas(result.UfosKilledByRadialBlast));
        self.ufosKilledByPlayerCollision(utils.numberWithCommas(result.UfosKilledByPlayerCollision));
        self.shotsFired(utils.numberWithCommas(result.ShotsFired));
        self.deaths(utils.numberWithCommas(result.Deaths));
        self.deathsByAsteroid(utils.numberWithCommas(result.DeathsByAsteroidCollision));
        self.deathsByUfoBullet(utils.numberWithCommas(result.DeathsByUfoBullet));
        self.deathsByUfoCollision(utils.numberWithCommas(result.DeathsByUfoCollision));
        self.radialBlastsCaptured(utils.numberWithCommas(result.RadialBlastsCaptured));
        self.spraysCaptured(utils.numberWithCommas(result.SpraysCaptured));
        self.rapidFiresCaptured(utils.numberWithCommas(result.RapidFiresCaptured));
        self.radialBlastsDeployed(utils.numberWithCommas(result.RadialBlastsDeployed));
        self.totalKills(utils.numberWithCommas(result.AsteroidsKilled + result.UfosKilled));
        self.gamesPlayed(utils.numberWithCommas(result.GamesPlayed));
        self.minutesPlayed(utils.numberWithCommas(result.MinutesPlayed));
        $(self.infoId).show();
        $(self.waitId).hide();
      })
      .fail(function(){
        console.log('everything data fail');
      });

    }

  };

  exports.EverythingViewModel = EverythingViewModel;


})(this);