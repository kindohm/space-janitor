;(function(exports){

  var ReadyView = function(game){
    this.game = game;
  };

  ReadyView.prototype = {

    zindex: 1000,

    draw: function(context){

      var baseHeight = 100;

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = '#ccc';
      context.fillText('READY PLAYER ONE', this.game.width/2, baseHeight);

      var left = 180;

      context.font = "12px 'Press Start 2P'";
      context.textAlign = 'left';
      context.fillText('- Left and right arrow keys to rotate', left, baseHeight + 50);
      context.fillText('- Up arrow key to thrust', left, baseHeight + 90);
      context.fillText('- Space bar to shoot', left, baseHeight + 130);
      context.fillText('- Esc to pause', left, baseHeight + 170);

      context.fillText('Collect these:', left, baseHeight + 240);
      context.fillText('and deploy them with Down arrow.', left, baseHeight + 280);

      var x = 390;
      var y = baseHeight + 230;
      context.beginPath();
      context.arc(x, y, 20, 0, Math.PI * 2, true);
      context.lineWidth = 2;
      context.strokeStyle = '#6666ff';
      context.stroke();
      context.closePath();

    }

  };

  exports.ReadyView = ReadyView;

})(this);