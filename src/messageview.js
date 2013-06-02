;(function(exports){

  var MessageView = function(game){
    this.game = game;
  };

  MessageView.prototype = {

    show: false,
    zindex: 1000,
    text: '',
    text2: '',
    text3: '',

    draw: function(context){

      if (!this.show) return;

      var firstFontSize = this.text2.length > 0 ? '16px' : '12px';

      context.font = firstFontSize + " 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = '#ccc';
      context.fillText(this.text, this.game.width/2, this.game.height/2 - 30);

      context.font = "12px 'Press Start 2P'";
      context.fillText(this.text2, this.game.width/2, this.game.height/2 + 45);
      context.fillText(this.text3, this.game.width/2, this.game.height/2 + 90);

    }

  };

  exports.MessageView = MessageView;

})(this);