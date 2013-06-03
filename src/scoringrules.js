;(function(exports){

  var ScoringRules = function(game){
    this.game = game;
  };

  ScoringRules.prototype = {

    pointsForAsteroid: function(asteroid){
      if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_LARGE) {
        return 250;
      } else if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_MEDIUM){
        return 500;
      } else {
        return 1000;
      }
    },

    pointsForLevel: function(level){
      var base = 500 * level.number;
      if (level.shots === 0) return base;
      var percent = level.asteroidsShot / level.shots;
      return base + Math.floor(percent * 1000);
    },

    pointsForCrash: function(){
      return 1000;
    },

    pointsForUfo: function(ufo){
      return 2000;
    }

  };

  exports.ScoringRules = ScoringRules;

})(this);