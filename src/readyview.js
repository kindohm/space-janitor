;(function(exports){

  var ReadyView = function(game, settings){
    this.game = game;
    this.ratio = 1.0;
    this.down = true;
  };

  ReadyView.prototype = {

    zindex: 1000,    
    size: {x:1, y:1},
    pos: {x: -182, y: -992},

    update: function(){

      if (this.down){
        this.ratio -= .02;
      } else {
        this.ratio += .02;
      }

      if (this.ratio >= 1.0){
        this.down = true;
      } else if (this.ratio <= 0.5){
        this.down = false;
      }

      this.handleKeyboard();
    },

    handleKeyboard: function(){

      if (this.callback === undefined || this.callback === null) return;

      var inputter = this.game.coquette.inputter;
      if (inputter.isPressed(inputter.SPACE)){
        this.callback();
      }
    },

    playerReady: function(callback){
      this.callback = callback;
    },

    draw: function(context){

      var baseHeight = 80;

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('CONTROLS', this.game.width/2, baseHeight);

      var left = 150;

      context.font = "12px 'Press Start 2P'";
      context.textAlign = 'left';

      context.fillText('Press LEFT, RIGHT, and UP arrows to move.', left, baseHeight + 50);
      context.fillText('Press SPACE to shoot. ESC to pause.', left, baseHeight + 90);

      context.fillText('Shoot powerups:', left, baseHeight + 150);

      var x = left + 20;
      var y = baseHeight + 190;
      context.beginPath();
      context.arc(x, y, 15, 0, Math.PI * 2, true);
      context.lineWidth = 3;
      context.strokeStyle = this.game.settings.RADIAL_BLAST_COLOR;
      context.stroke();
      context.closePath();

      context.beginPath();
      context.arc(x, y + 40, 15, 0, Math.PI * 2, true);
      context.lineWidth = 3;
      context.strokeStyle = this.game.settings.RAPID_FIRE_COLOR;
      context.stroke();
      context.closePath();

      context.beginPath();
      context.arc(x, y + 80, 15, 0, Math.PI * 2, true);
      context.lineWidth = 3;
      context.strokeStyle = this.game.settings.SPRAY_COLOR;
      context.stroke();
      context.closePath();

      context.fillText('Radial Blast (deploy with DOWN arrow)', left + 55, baseHeight + 195);
      context.fillText('Rapid Fire', left + 55, baseHeight + 235);
      context.fillText('Bullet Spray', left + 55, baseHeight + 275);

      context.fillStyle = 'rgba(' + this.game.settings.FOREGROUND_BASE_COLOR + ', ' + this.ratio.toString() + ')';
      context.fillText('Press SPACE to play.', left, baseHeight + 330);


    }

  };

  exports.ReadyView = ReadyView;

})(this);