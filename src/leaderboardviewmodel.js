;(function(exports, $){

  var allTimeLeaderboardUrl = 'http://orbital-janitor-api.azurewebsites.net/api/leaderboard/?type=alltime';
  var dailyLeaderboardUrl = 'http://orbital-janitor-api.azurewebsites.net/api/leaderboard/?type=day';

  var mapDifficulty = function(diff){

    if (diff === 0) return 'FREE';
    else if (diff === 1) return 'EASY';
    else if (diff === 2) return 'NORMAL';
    else if (diff === 3) return 'HARD';
    else if (diff === 4) return 'INSANE';

  };

  var padDigit = function(digit){
    return digit.toString().length === 1 ? '0' + digit.toString() : digit.toString();
  };

  var Game = function(gameDto){
    this.rank = gameDto.rank;
    this.playerName = gameDto.Player;
    this.score = gameDto.Score;
    this.difficulty = mapDifficulty(gameDto.Difficulty);
    this.level = gameDto.LevelReached;
    this.kills = gameDto.AsteroidsKilled +
      gameDto.UfosKilled;

    this.end = new Date(gameDto.End);
    this.dateDisplay = ko.computed(function() {

          var mins = padDigit(this.end.getMinutes());
          var hrs = padDigit(this.end.getHours());
          var month = padDigit(this.end.getMonth());
          var day = padDigit(this.end.getDate());
          return this.end.getFullYear() + "-" + month + "-" + day + " " + hrs + ":" + mins;
        }, this);      
  };

  var LeaderboardViewModel = function(leaderboardType){
    this.allTimeGames = ko.observableArray([]);
    this.dailyGames = ko.observableArray([]);
    this.load();
  };

  LeaderboardViewModel.prototype = {

    load: function(url){

      var self = this;

      // all time leaderboard
      $.ajax({
        url: allTimeLeaderboardUrl
      })
      .done(function(result){
        for (var i = 0; i < result.length; i++){
          var dto = new Game(result[i]);
          dto.rank = i + 1;
          self.allTimeGames.push(dto);
        }
        $('#allTimeWait').hide();
      })
      .fail(function(){
        console.log('leaderboard data fail');
      });

      // daily leaderboard
      $.ajax({
        url: dailyLeaderboardUrl
      })
      .done(function(result){
        for (var i = 0; i < result.length; i++){
          var dto = new Game(result[i]);
          dto.rank = i + 1;
          self.dailyGames.push(dto);
        }
        $('#dailyWait').hide();
      })
      .fail(function(){
        console.log('leaderboard data fail');
      });

    }

  };

  exports.LeaderboardViewModel = LeaderboardViewModel;

})(this, jQuery);