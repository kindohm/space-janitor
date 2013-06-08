;(function(exports, $){

  var leaderboardUrl = 'http://orbital-janitor-api.azurewebsites.net/api/game/getTopGamesEver';

  var mapDifficulty = function(diff){

    if (diff === 0) return 'FREE';
    else if (diff === 1) return 'EASY';
    else if (diff === 2) return 'NORMAL';
    else if (diff === 3) return 'HARD';
    else if (diff === 4) return 'INSANE';

  };

  var Game = function(gameDto){
    this.rank = gameDto.rank;
    this.playerName = gameDto.Player;
    this.score = gameDto.Score;
    this.difficulty = mapDifficulty(gameDto.Difficulty);
    this.level = gameDto.LevelReached;
    this.kills = gameDto.AsteroidsKilled +
      gameDto.UfosKilled;
  };

  var LeaderboardViewModel = function(){
    this.games = ko.observableArray([]);
    this.load();
  };

  LeaderboardViewModel.prototype = {

    load: function(){
      var self = this;
      $.ajax({
        url: leaderboardUrl
      })
      .done(function(result){
        console.log('leaderboard done');
        console.log(result);
        for (var i = 0; i < result.length; i++){
          var dto = new Game(result[i]);
          dto.rank = i + 1;
          self.games.push(dto);
        }
      })
      .fail(function(){
        console.log('leaderboard data fail');
      });
    }

  };

  exports.LeaderboardViewModel = LeaderboardViewModel;

})(this, jQuery);