;(function(exports, $){

  var gameUrl = 'http://orbital-janitor-api.azurewebsites.net/api/game/{0}';

  function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var padDigit = function(digit){
    return digit.toString().length === 1 ? '0' + digit.toString() : digit.toString();
  };

  var getDateDisplay = function(date){
    var mins = padDigit(date.getMinutes());
    var hrs = padDigit(date.getHours());
    var month = padDigit(date.getMonth());
    var day = padDigit(date.getDate());
    return date.getFullYear() + "-" + month + "-" + day + " " + hrs + ":" + mins;
  };

  var GameViewModel = function(){
    this.playerName = ko.observable('');
    this.score = ko.observable('');
    this.date = ko.observable('');

    this.load();
  };

  GameViewModel.prototype = {

    load: function(){

      var self = this;
      var id = getParameterByName('id');
      var url = gameUrl.replace('{0}', id);

      // all time leaderboard
      $.ajax({
        url: url
      })
      .done(function(result){
        self.playerName(result.Player);
        self.score(result.Score.toString());
        self.date(getDateDisplay(new Date(result.End)));
        $('#wait').hide();
      })
      .fail(function(){
        console.log('game data fail');
      });

    }

  };

  exports.GameViewModel = GameViewModel;

})(this, jQuery);