;(function(exports, $){

  var allTimeLeaderboardUrl = 'http://orbital-janitor-api.azurewebsites.net/api/leaderboard/?type=alltime';
  var dailyLeaderboardUrl = 'http://orbital-janitor-api.azurewebsites.net/api/leaderboard/?type=day';
  
  var utils = new ViewModelUtils();

  var Game = function(gameDto){
    this.rank = gameDto.rank;
    this.playerName = gameDto.Player;
    this.score = utils.numberWithCommas(gameDto.Score);
    this.difficulty = utils.mapDifficulty(gameDto.Difficulty);
    this.level = gameDto.LevelReached;
    this.kills = gameDto.AsteroidsKilled +
      gameDto.UfosKilled;

    this.end = new Date(gameDto.End);
    this.dateDisplay = ko.computed(function() {

        var mins = utils.padDigit(this.end.getMinutes());
        var hrs = utils.padDigit(this.end.getHours());
        var month = utils.padDigit(this.end.getMonth());
        var day = utils.padDigit(this.end.getDate());
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