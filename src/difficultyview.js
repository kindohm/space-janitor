;(function(exports){

  var DifficultyView = function(game){
    this.game = game;
  };

  DifficultyView.prototype = {

    show: false,

    draw: function(context){

      if (!this.show) return;

      var x = this.game.width / 2;

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('CHOOSE DIFFICULTY', x, 100);

      context.font = "12px 'Press Start 2P'";
      context.fillText('Press a number key:', x, 200);

      context.fillText('1 - free flying', x, 250);
      context.fillText('2 - easy', x, 280);
      context.fillText('3 - normal', x, 310);
      context.fillText('4 - hard', x, 340);
      context.fillText('5 - insane', x, 370);

    }

  };

  exports.DifficultyView = DifficultyView;

})(this);