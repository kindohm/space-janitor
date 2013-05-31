;(function(exports){

  var ScoringRules = function(game){
    this.game = game;
  };

  ScoringRules.prototype = {

    pointsForAsteroid: function(asteroid){
      if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_LARGE) {
        return 100;
      } else if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_MEDIUM){
        return 250;
      } else {
        return 500;
      }
    },

    pointsForLevel: function(level){
      var base = 500 * level.number + Math.min(100, Math.floor(level.thrustTicks * .03));
      if (level.shots === 0) return base;
      var percent = level.asteroidsShot / level.shots;
      return base + Math.floor(percent * 1000);
    },

    pointsForCrash: function(){
      return 500;
    }

  };

  exports.ScoringRules = ScoringRules;

})(this);