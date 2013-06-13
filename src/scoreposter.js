; (function (exports, $) {

  //postUrl = 'http://localhost:61740/api/Game';
  postUrl = 'http://orbital-janitor-api.azurewebsites.net/api/Game';

  var ScorePoster = function () {
  };

  ScorePoster.prototype = {

    postScore: function(game, callback){

      var dto = this.getDto(game);
      var dtoString = JSON.stringify(dto);

      $.ajax({
        url: postUrl,
        contentType: 'text/json',
        data: dtoString,
        type: 'POST'
      })
      .done(function(result) { callback(result); })
      .fail(function(result) { callback({ Success: false, Message: 'Error posting score.'}); });
    },

    getDto: function(game){
      var version = new Version();
      var gameDto = {
        start: game.start,
        end: game.end,
        player: game.playerName,
        cheating: game.cheating,
        difficulty: game.difficulty,
        score: game.score,
        version: version.number
      };

      gameDto.levels = [];

      for (var i = 0; i < game.levels.length; i++){
        var level = game.levels[i];
        gameDto.levels.push({
          number: level.number,
          start: level.start,
          end: level.end,
          score: level.score,
          shotsFired: level.shots,
          radialBlastsCaptured: level.radialBlastsCaptured,
          radialBlastsDeployed: level.radialBlastsDeployed,
          asteroidsKilledByBullet: level.asteroidsKilledByBullet,
          asteroidsKilledByRadialBlast: level.asteroidsKilledByRadialBlast,
          asteroidsKilledByPlayerCollision: level.asteroidsKilledByPlayerCollision,
          ufosKilledByBullet: level.ufosKilledByBullet,
          ufosKilledByPlayerCollision: level.ufosKilledByPlayerCollision,
          ufosKilledByRadialBlast: level.ufosKilledByRadialBlast,
          deathsByAsteroidCollision: level.deathsByAsteroidCollision,
          deathsByUfoCollision: level.deathsByUfoCollision,
          deathsByUfoBullet: level.deathsByUfoBullet,
          rapidFiresCaptured: level.rapidFiresCaptured
        });

      }

      return gameDto;



    }

  };

    exports.ScorePoster = ScorePoster;
})(this, jQuery);