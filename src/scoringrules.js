;(function(exports){

  var ScoringRules = function(game){
    this.game = game;

    if (game.difficulty === game.DIFFICULTY_FREE) this.multiplier = 0;
    if (game.difficulty === game.DIFFICULTY_EASY) this.multiplier = 0.5;
    if (game.difficulty === game.DIFFICULTY_NORMAL) this.multiplier = 1;
    if (game.difficulty === game.DIFFICULTY_HARD) this.multiplier = 1.25;
    if (game.difficulty === game.DIFFICULTY_INSANE) this.multiplier = 1.5;

  };

  ScoringRules.prototype = {

    multiplier: 1.0,

    pointsForAsteroid: function(asteroid){
      if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_LARGE) {
        return 250 * this.multiplier;
      } else if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_MEDIUM){
        return 500 * this.multiplier;
      } else {
        return 1000 * this.multiplier;
      }
    },

    pointsForLevel: function(level){
      var base = 500 * level.number;
      if (level.shots === 0) return base * this.multiplier;
      var percent = level.asteroidsShot / level.shots;
      return Math.floor((base + percent * 1000) * this.multiplier);
    },

    pointsForCrash: function(){
      return 1000 * this.multiplier;
    },

    pointsForUfo: function(ufo){
      return 2000 * this.multiplier;
    },
  };

  exports.ScoringRules = ScoringRules;

})(this);