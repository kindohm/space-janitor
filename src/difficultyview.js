;(function(exports){

  var DifficultyView = function(game, settings){
    this.game = game;
  };

  DifficultyView.prototype = {

    zindex: 1000,    
    size: {x:1, y:1},
    pos: {x: -682, y: -792},

    update: function(){
      this.handleKeyboard();
    },

    handleKeyboard: function(){

      if (this.callback === undefined || this.callback === null) return;    
      var inputter = this.game.coquette.inputter;
      var result = -1;
      if (inputter.state(inputter.ONE)) result = this.game.DIFFICULTY_FREE;
      if (inputter.state(inputter.TWO)) result = this.game.DIFFICULTY_EASY;
      if (inputter.state(inputter.THREE)) result = this.game.DIFFICULTY_NORMAL;
      if (inputter.state(inputter.FOUR)) result = this.game.DIFFICULTY_HARD;
      if (inputter.state(inputter.FIVE)) result = this.game.DIFFICULTY_INSANE;

      if (result === -1) return;
      this.callback(result);
    },

    difficultySelected: function(callback){
      this.callback = callback;
    },

    draw: function(context){

      var x = this.game.width / 2;

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('CHOOSE DIFFICULTY', x, 100);

      context.font = "12px 'Press Start 2P'";
      context.fillText('Press a number key:', x, 150);

      context.fillText('1 - free flying', x, 200);
      context.fillText('2 - easy', x, 230);
      context.fillText('3 - normal', x, 260);
      context.fillText('4 - hard', x, 290);
      context.fillText('5 - insane', x, 320);

    }

  };

  exports.DifficultyView = DifficultyView;

})(this);