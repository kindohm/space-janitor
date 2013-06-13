;(function(exports){

  var GameBar = function(game){
    this.game = game;
    
    // In order to ensure the game bar is drawn on top of game entities,
    // the GameBar needs to be an entity itself with a zindex. Coquette
    // won't draw it without a pos and size.
    this.pos = {
      x: -1000,
      y: -1000
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

      if (this.game.difficulty === this.game.DIFFICULTY_FREE) return;

      var player = this.game.player;

      context.fillStyle = this.game.settings.BACKGROUND_COLOR;
      context.fillRect(0,0,this.game.width, 30);

      if (player !== null && player.rapidFire){
        var percent = player.rapidFireBulletsLeft / this.game.settings.RAPID_FIRE_CLIP_SIZE;
        var width = this.game.width * percent;
        context.fillStyle = 'rgba(' + this.game.settings.RAPID_FIRE_BASE_COLOR + ', .25)';
        context.fillRect(0,0,width,30);
      }


      context.font = "10px 'Press Start 2P'";
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      
      context.textAlign = "left"
      context.fillText('Level: ' + this.levelNumber.toString(), 10, 20);

      context.textAlign = "left"
      context.fillText('Lives: ' + this.game.lives.toString(), 150, 20);

      context.textAlign = "right"
      context.fillText('Score: ' + Math.floor(this.game.score).toString(), this.game.width - 10, 20);

      if (player !== null){
        for(var i = 0; i < player.radialBlasts; i++){
          var x = 280 + i * 20;
          var y = 15;
          context.beginPath();
          context.arc(x, y, 7, 0, Math.PI * 2, true);
          context.lineWidth = 2;
          context.strokeStyle = this.game.settings.RADIAL_BLAST_COLOR;
          context.stroke();
          context.closePath();
        }

      }
    }
  };

  exports.GameBar = GameBar;

})(this);