; (function (exports, $) {

  postUrl = 'http://localhost:61740/api/Game';

  var ScorePoster = function () {
  };

  ScorePoster.prototype = {

    postScore: function(game){

      var dto = this.getDto(game);
      var dtoString = JSON.stringify(dto);

      $.ajax({
        url: postUrl,
        contentType: 'text/json',
        data: dtoString,
        type: 'POST'
      })
      .done(function(result) { console.log("success:"); console.log(result); })
      .fail(function(result) { console.log("error:"); console.log(result);})
      .always(function(result) { console.log("complete:"); console.log(result);});
    },

    getDto: function(game){
      var gameDto = {
        start: game.start,
        end: game.end,
        player: game.playerName,
        cheating: game.cheating,
        difficulty: game.difficulty,
        score: game.score
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
          deathsByUfoBullet: level.deathsByUfoBullet
        });

      }

      return gameDto;



    }

  };

    exports.ScorePoster = ScorePoster;
})(this, jQuery);