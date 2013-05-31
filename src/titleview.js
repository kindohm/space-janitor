;(function(exports){

  var TitleView = function(game){
    this.game = game;
  };

  TitleView.prototype = {

    draw: function(context){

      context.fillStyle = '#ccc';

      context.font = "48px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillText("Space Janitor", this.game.width/2, this.game.height/2);

      context.font = "12px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillText("Press SPACE to play", this.game.width/2, this.game.height/2 + 50);

    }

  };

  exports.TitleView = TitleView;

})(this);