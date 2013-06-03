;(function(exports){

  var Level = function(game, number, difficulty){
    this.game = game;
    this.difficulty = difficulty;
    this.number = number;
    this.asteroidCount = this.getAsteroidCount();
    this.complete = false;
    this.shots = 0;
    this.asteroidsShot = 0;
    this.levelBonus = 0;
    this.thrustTicks = 0;
    this.ufoDeployed = false;
  };

  Level.prototype = {

    getAsteroidCount: function(){

      if (this.difficulty === this.game.DIFFICULTY_FREE) 
        return 0;

      if (this.difficulty === this.game.DIFFICULTY_EASY) 
        return Math.min(this.number, 6);

      if (this.difficulty === this.game.DIFFICULTY_NORMAL) 
        return Math.min(this.number + 1, 7);

      if (this.difficulty === this.game.DIFFICULTY_HARD) 
        return Math.min(this.number + 2, 7);

      if (this.difficulty === this.game.DIFFICULTY_INSANE) 
        return Math.min(this.number + 3, 7);
    },

    update: function(){
      if (this.game.paused || this.difficulty === this.game.DIFFICULTY_FREE) return;
      if (!this.complete) {
        this.complete = this.game.coquette.entities.all(Asteroid).length === 0
          && this.game.coquette.entities.all(Ufo).length === 0;
      }
    },

    deployAsteroid: function(size, pos){

      if (this.difficulty === this.game.DIFFICULTY_FREE) return;

      var direction = this.game.maths.plusMinus();
      size = size === undefined ? this.game.settings.ASTEROID_SIZE_LARGE : size;

      if (pos === undefined){

        var x = direction === 1 ? 
            this.game.maths.getRandomInt(-this.game.settings.ASTEROID_SIZE_LARGE,150) : 
              this.game.maths.getRandomInt(this.game.width - 150,this.game.width + this.game.settings.ASTEROID_SIZE_LARGE);

        pos = {
          x: x, 
          y: this.game.height
        };

      }

      var xVelBase = this.getNextVelX();
      var yVelBase = this.getNextVelY();

      var vel = {
        x: direction === 1 ? xVelBase : -xVelBase,
        y: yVelBase * this.game.maths.plusMinus()
      };

      this.game.coquette.entities.create(Asteroid, {
        pos: pos,
        vel: vel,
        maxPos:{
          x: this.game.width,
          y: this.game.height
        },
        size: {
          x: size,
          y: size
        },
        boundingBox: this.game.coquette.collider.RECTANGLE
      }, function(created){
      });
    },

    getNextVelX: function(){
      if (this.difficulty === this.game.DIFFICULTY_EASY)
        return this.game.maths.getRandomInt(1, 10 + 10 * this.number * .25) * .01;

      if (this.difficulty === this.game.DIFFICULTY_NORMAL)
        return this.game.maths.getRandomInt(1, 10 + 10 * this.number * .75) * .01;

      if (this.difficulty === this.game.DIFFICULTY_HARD)
        return this.game.maths.getRandomInt(5, 10 + 10 * this.number * 1.25) * .01;

      if (this.difficulty === this.game.DIFFICULTY_INSANE)
        return this.game.maths.getRandomInt(5 + this.number, 10 + 10 * this.number * 1.75) * .01;
    },

    getNextVelY: function(){
      if (this.difficulty === this.game.DIFFICULTY_EASY)
        return this.game.maths.getRandomInt(40, 200 + this.number/2) * .01;

      if (this.difficulty === this.game.DIFFICULTY_NORMAL)
        return this.game.maths.getRandomInt(40 + 5 * this.number, 200 + 10 * this.number) * .01;

      if (this.difficulty === this.game.DIFFICULTY_HARD)
        return this.game.maths.getRandomInt(40 + 10 * this.number, 200 + 30 * this.number) * .01;

      if (this.difficulty === this.game.DIFFICULTY_INSANE)
        return this.game.maths.getRandomInt(50 + 20 * this.number, 210 + 50 * this.number) * .01;
    },


    spawnUfo: function(){

      if (this.difficulty === this.game.DIFFICULTY_FREE ||
        this.difficulty === this.game.DIFFICULTY_EASY) return;

      var direction = this.game.maths.plusMinus();

      var pos = {
        x: direction === 1 ? -39 : this.game.width,
        y: this.game.maths.getRandomInt(50, this.game.height - 50),
      };

      var vel = {
        x: direction * this.nextUfoVelX(),
        y: this.nextUfoVelY()
      };

      var shotTicks = 40;
      for (var i = 5; i < this.number; i+=5){
        shotTicks -= 5;
      }

      shotTicks = Math.max(shotTicks, 20);

      this.game.coquette.entities.create(Ufo, {
        pos: pos,
        vel: vel,
        shotTicks: shotTicks,
        size: {
          x: 40,
          y: 25
        }
      });

    },

    nextUfoVelY: function(){
      if (this.game.difficulty === this.game.DIFFICULTY_NORMAL)
        return .03 * (this.number - 1) * this.game.maths.plusMinus();
      if (this.game.difficulty === this.game.DIFFICULTY_HARD)
        return .05 * (this.number) * this.game.maths.plusMinus();
      if (this.game.difficulty === this.game.DIFFICULTY_INSANE)
        return .1 * (this.number) * this.game.maths.plusMinus();

      return 0;
    },

    nextUfoVelX: function(){
      if (this.game.difficulty === this.game.DIFFICULTY_EASY)
        return 2 + (this.number - 1) * .04;

      if (this.game.difficulty === this.game.DIFFICULTY_NORMAL)
        return 2 + (this.number - 1) * .06;

      if (this.game.difficulty === this.game.DIFFICULTY_HARD)
        return 2 + (this.number - 1) * .1;

      if (this.game.difficulty === this.game.DIFFICULTY_INSANE)
        return 3 + (this.number - 1) * .1;

      return 2;
    }
  };

  exports.Level = Level;

})(this);