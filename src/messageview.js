;(function(exports){

  var MessageView = function(game){
    this.game = game;
  };

  MessageView.prototype = {

    show: false,
    zindex: 1000,
    text: '',

    draw: function(context){

      if (!this.show) return;

      context.font = "12px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = '#ccc';
      context.fillText(this.text, this.game.width/2, this.game.height/2);

    }

  };

  exports.MessageView = MessageView;

})(this);