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
      if (inputter.state(inputter.SPACE)){
        this.callback();
      }
    },

    playerReady: function(callback){
      this.callback = callback;
    },

    draw: function(context){

      var baseHeight = 100;

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('CONTROLS', this.game.width/2, baseHeight);

      var left = 150;

      context.font = "12px 'Press Start 2P'";
      context.textAlign = 'left';

      context.fillText('Press LEFT, RIGHT, and UP arrows to move.', left, baseHeight + 50);
      context.fillText('Press SPACE to shoot. ESC to pause.', left, baseHeight + 90);

      context.fillText('Collect these:', left, baseHeight + 170);

      var x = 370;
      var y = baseHeight + 160;
      context.beginPath();
      context.arc(x, y, 20, 0, Math.PI * 2, true);
      context.lineWidth = 3;
      context.strokeStyle = this.game.settings.POWERUP_COLOR;
      context.stroke();
      context.closePath();

      context.fillText('and deploy them with DOWN arrow.', left, baseHeight + 210);

      context.fillStyle = 'rgba(' + this.game.settings.FOREGROUND_BASE_COLOR + ', ' + this.ratio.toString() + ')';
      context.fillText('Press SPACE to play.', left, baseHeight + 290);


    }

  };

  exports.ReadyView = ReadyView;

})(this);