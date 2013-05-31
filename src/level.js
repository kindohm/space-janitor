;(function(exports){

  var Level = function(game, number, asteroidCount){
    this.game = game;
    this.number = number;
    this.asteroidCount = asteroidCount;
    this.complete = false;
  };

  Level.prototype = {

    update: function(){
      if (!this.complete) {
        this.complete = this.game.coquette.entities.all(Asteroid).length === 0;
      }
    }

  };

  exports.Level = Level;

})(this);