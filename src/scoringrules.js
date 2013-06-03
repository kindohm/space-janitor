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
      var base = 100 * level.number;
      if (level.shots === 0) return base;
      var percent = level.asteroidsShot / level.shots;
      return base + Math.floor(percent * 1000);
    },

    pointsForCrash: function(){
      return 500;
    },

    pointsForUfo: function(ufo){
      return 1000;
    }

  };

  exports.ScoringRules = ScoringRules;

})(this);