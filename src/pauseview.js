;(function(exports){

  var PauseView = function(game, settings){
    this.game = game;
  };

  PauseView.prototype = {

    zindex: 1000,
    pos: {x:-200,y:-300},
    size: {x:1,y:1},

    show: false,

    update: function(){

    },

    draw: function(context){

      if (!this.show) return;
      var x = this.game.width / 2;

      context.fillStyle = 'rgba(10,10,10,.8)';
      context.fillRect(0,0,this.game.width, this.game.height);

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = '#ccc';
      context.fillText('PAUSED', x, 100);

      context.font = "12px 'Press Start 2P'";

      context.fillText('Q - Quit', x, 150);
      context.fillText('ESC - Return to Game', x, 180);


    }

  };

  exports.PauseView = PauseView;

})(this);