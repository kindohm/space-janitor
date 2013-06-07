;(function(exports){

  var GameOverView = function(game, settings){
    this.game = game;

    this.char1 = '';
    this.char2 = '';
    this.char3 = '';
    this.char4 = '';
    this.char5 = '';
    this.char6 = '';
    this.char7 = '';
    this.char8 = '';

    this.currentPos = 1;

    this.flashOn = false;
    this.flashTicks = 5;   
    this.keyDelay = false; 
    this.lastKey = '';
    this.submitting = false;
  };

  GameOverView.prototype = {

    zindex: 1000,
    pos: {x:-8282, y:-1881},
    size: {x:1, y:1},

    update: function(){

      this.flashTicks--;
      if (this.flashTicks === 0){
        this.flashTicks = 5;
        this.flashOn = !this.flashOn;
      }

      if (!this.keyDelay){
        this.handleKeyboard();
      }
    },

    registerKeyStroke: function(keyCode){

      var inputter = this.game.coquette.inputter;
      if (keyCode === inputter.A) this['char' + this.currentPos.toString()] = 'A';
      if (keyCode === inputter.B) this['char' + this.currentPos.toString()] = 'B';
      if (keyCode === inputter.C) this['char' + this.currentPos.toString()] = 'C';
      if (keyCode === inputter.D) this['char' + this.currentPos.toString()] = 'D';
      if (keyCode === inputter.E) this['char' + this.currentPos.toString()] = 'E';
      if (keyCode === inputter.F) this['char' + this.currentPos.toString()] = 'F';
      if (keyCode === inputter.G) this['char' + this.currentPos.toString()] = 'G';
      if (keyCode === inputter.H) this['char' + this.currentPos.toString()] = 'H';
      if (keyCode === inputter.I) this['char' + this.currentPos.toString()] = 'I';
      if (keyCode === inputter.J) this['char' + this.currentPos.toString()] = 'J';
      if (keyCode === inputter.K) this['char' + this.currentPos.toString()] = 'K';
      if (keyCode === inputter.L) this['char' + this.currentPos.toString()] = 'L';
      if (keyCode === inputter.M) this['char' + this.currentPos.toString()] = 'M';
      if (keyCode === inputter.N) this['char' + this.currentPos.toString()] = 'N';
      if (keyCode === inputter.O) this['char' + this.currentPos.toString()] = 'O';
      if (keyCode === inputter.P) this['char' + this.currentPos.toString()] = 'P';
      if (keyCode === inputter.Q) this['char' + this.currentPos.toString()] = 'Q';
      if (keyCode === inputter.R) this['char' + this.currentPos.toString()] = 'R';
      if (keyCode === inputter.S) this['char' + this.currentPos.toString()] = 'S';
      if (keyCode === inputter.T) this['char' + this.currentPos.toString()] = 'T';
      if (keyCode === inputter.U) this['char' + this.currentPos.toString()] = 'U';
      if (keyCode === inputter.V) this['char' + this.currentPos.toString()] = 'V';
      if (keyCode === inputter.W) this['char' + this.currentPos.toString()] = 'W';
      if (keyCode === inputter.X) this['char' + this.currentPos.toString()] = 'X';
      if (keyCode === inputter.Y) this['char' + this.currentPos.toString()] = 'Y';
      if (keyCode === inputter.Z) this['char' + this.currentPos.toString()] = 'Z';
      if (keyCode === inputter.ZERO) this['char' + this.currentPos.toString()] = '0';
      if (keyCode === inputter.ONE) this['char' + this.currentPos.toString()] = '1';
      if (keyCode === inputter.TWO) this['char' + this.currentPos.toString()] = '2';
      if (keyCode === inputter.THREE) this['char' + this.currentPos.toString()] = '3';
      if (keyCode === inputter.FOUR) this['char' + this.currentPos.toString()] = '4';
      if (keyCode === inputter.FIVE) this['char' + this.currentPos.toString()] = '5';
      if (keyCode === inputter.SIX) this['char' + this.currentPos.toString()] = '6';
      if (keyCode === inputter.SEVEN) this['char' + this.currentPos.toString()] = '7';
      if (keyCode === inputter.EIGHT) this['char' + this.currentPos.toString()] = '8';
      if (keyCode === inputter.NINE) this['char' + this.currentPos.toString()] = '9';

      this.currentPos++;
    },

    _handleKeyboard: function(){

    },

    handleKeyboard: function(){
      //48 - 90
      var inputter = this.game.coquette.inputter;

      if (inputter.state(inputter.ENTER)){
        this.handleKeyboard = this._handleKeyboard;
        this.end();
        return;
      }

      if (inputter.state(inputter.BACKSPACE)){
        this['char' + (this.currentPos-1).toString()] = '';
        this.currentPos = Math.max(1, this.currentPos - 1);
        var self = this;
        this.keyDelay = true;
        setTimeout(function(){
          self.keyDelay = false;
        }, 200);
        return;
      }

      if (this.currentPos > 8){
        return;
      }

      for (var i = 48; i <= 90; i++){
        if (inputter.state(i)){
          this.keyDelay = true;
          this.registerKeyStroke(i);
          var self = this;
          setTimeout(function(){
            self.keyDelay = false;
          }, 200);
          return;
        }
      }
    },

    getName: function(){
      var result = '';
      for (var i = 1; i <= 8; i++){
        result += this['char' + i.toString()];
      }
      return result.trim();
    },

    draw: function(context){


      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('GAME OVER', this.game.width/2, 100);

      context.font = "12px 'Press Start 2P'";
      context.fillText('Type your name and press ENTER', this.game.width/2, 170);
      context.fillText('to submit your score:', this.game.width/2, 195);

      var boxWidth = 19;
      var boxHeight = 30;
      var y = 230;

      if (this.submitting){
        context.fillStyle = '#333';
      }
      context.fillRect(this.game.width/2 - 70, y, boxWidth, boxHeight);
      context.fillRect(this.game.width/2 - 50, y, boxWidth, boxHeight);
      context.fillRect(this.game.width/2 - 30, y, boxWidth, boxHeight);
      context.fillRect(this.game.width/2 - 10, y, boxWidth, boxHeight);
      context.fillRect(this.game.width/2 + 10, y, boxWidth, boxHeight);
      context.fillRect(this.game.width/2 + 30, y, boxWidth, boxHeight);
      context.fillRect(this.game.width/2 + 50, y, boxWidth, boxHeight);
      context.fillRect(this.game.width/2 + 70, y, boxWidth, boxHeight);


      var highlightX = 0;
      if (this.currentPos === 1) highlightX = this.game.width / 2 - 70;
      if (this.currentPos === 2) highlightX = this.game.width / 2 - 50;
      if (this.currentPos === 3) highlightX = this.game.width / 2 - 30;
      if (this.currentPos === 4) highlightX = this.game.width / 2 - 10;
      if (this.currentPos === 5) highlightX = this.game.width / 2 + 10;
      if (this.currentPos === 6) highlightX = this.game.width / 2 + 30;
      if (this.currentPos === 7) highlightX = this.game.width / 2 + 50;
      if (this.currentPos === 8) highlightX = this.game.width / 2 + 70;

      if (this.flashOn){
        context.fillStyle = this.game.settings.BACKGROUND_COLOR;
        context.fillRect(highlightX, y + boxHeight - 2, boxWidth, 2);
      }

      y = 251;

      context.fillStyle = this.game.settings.BACKGROUND_COLOR;
      context.fillText(this.char1, this.game.width / 2 - 60, y);
      context.fillText(this.char2, this.game.width / 2 - 40, y);
      context.fillText(this.char3, this.game.width / 2 - 20, y);
      context.fillText(this.char4, this.game.width / 2 - 0, y);
      context.fillText(this.char5, this.game.width / 2 + 20, y);
      context.fillText(this.char6, this.game.width / 2 + 40, y);
      context.fillText(this.char7, this.game.width / 2 + 60, y);
      context.fillText(this.char8, this.game.width / 2 + 80, y);


      if (this.submitting){
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('Please wait...', this.game.width / 2, y);

      }

      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('Or, just press ENTER to continue without', this.game.width/2, 310);
      context.fillText('submitting your score.', this.game.width/2, 335);

    },

    onend: function(callback){
      this.callback = callback;
    },

    end: function(){
      var name = this.getName();
      if (name.length === 0){
        if (this.callback != undefined){
          this.callback(this);
        }
        return;
      }

      this.game.playerName = name;
      this.submitting = true;
      var self = this;
      var poster = new ScorePoster();
      poster.postScore(this.game, function(result){
        if (self.callback != undefined){
          self.callback(self, result);
        }
      });

    }

  };

  exports.GameOverView = GameOverView;

})(this);