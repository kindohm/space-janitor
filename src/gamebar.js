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

      context.font = "10px 'Press Start 2P'";
      context.fillStyle = '#ccc';
      context.fillText('Level: ' + this.levelNumber.toString(), 10, 20);

    }
  };

  exports.GameBar = GameBar;

})(this);