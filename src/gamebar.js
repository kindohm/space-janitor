;(function(exports){

  var GameBar = function(game){
    this.game = game;
    
    // In order to ensure the game bar is drawn on top of game entities,
    // the GameBar needs to be an entity itself with a zindex. Coquette
    // won't draw it without a pos and size.
    this.pos = {
      x: 0,
      y: 0
    };

    this.size = {
      x: 1,
      y: 1
    };

  };

  GameBar.prototype = {

    levelNumber: 1,
    zindex: 1000,

    draw: function(context){

      if (this.game.state === this.game.STATE_TITLE) return;

      context.fillStyle = '#000';
      context.fillRect(0,0,this.game.width, 30);

      context.font = "10px 'Press Start 2P'";
      context.fillStyle = '#ccc';
      
      context.textAlign = "left"
      context.fillText('Level: ' + this.levelNumber.toString(), 10, 20);

      context.textAlign = "left"
      context.fillText('Lives: ' + this.game.lives.toString(), 150, 20);

      if (this.game.level != null){
        context.textAlign = "center"
        var bonus = this.game.scoringRules.pointsForLevel(this.game.level);
        context.fillText('Level Bonus: ' + bonus.toString(), this.game.width/2, 20);
      }

      context.textAlign = "right"
      context.fillText('Score: ' + this.game.score.toString(), this.game.width - 10, 20);
    }
  };

  exports.GameBar = GameBar;

})(this);