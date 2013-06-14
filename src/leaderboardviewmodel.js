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

  function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var Game = function(gameDto){
    this.rank = gameDto.rank;
    this.playerName = gameDto.Player;
    this.score = numberWithCommas(gameDto.Score);
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

    this.detailLink = 'game.html?id=' + gameDto.Id;
  };

  var LeaderboardViewModel = function(leaderboardType, waitId){
    var url = leaderboardType === 'daily' ? dailyLeaderboardUrl : allTimeLeaderboardUrl
    this.games = ko.observableArray([]);
    this.waitId = waitId;
    this.load(url);

  };

  LeaderboardViewModel.prototype = {

    load: function(url){

      var self = this;

      $.ajax({
        url: url
      })
      .done(function(result){
        for (var i = 0; i < result.length; i++){
          var dto = new Game(result[i]);
          dto.rank = i + 1;
          self.games.push(dto);
        }
        $(self.waitId).hide();
      })
      .fail(function(){
        console.log('leaderboard data fail');
      });

    }

  };

  exports.LeaderboardViewModel = LeaderboardViewModel;

})(this, jQuery);