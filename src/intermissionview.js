;(function(exports){

  var IntermissionView = function(game){
    this.game = game;
  };

  IntermissionView.prototype = {

    show: false,
    zindex: 1000,

    draw: function(context){

      if (!this.show) return;

      context.font = "12px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = '#ccc';
      context.fillText('Level ' + this.game.level.number.toString() + ' complete. Loading next level...', this.game.width / 2, this.game.height / 2);

    }

  };

  exports.IntermissionView = IntermissionView;

})(this);