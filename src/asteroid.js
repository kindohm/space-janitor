;(function(exports){

  var Asteroid = function(game, settings){

    this.game = game;
    this.boundingBox = settings.boundingBox;
    this.angle = 0;
    this.turnSpeed = 2 * Math.random() - 1;

    this.center = {
      x: settings.pos.x,
      y: settings.pos.y
    };
    
    this.vel = {
      x: settings.vel.x,
      y: settings.vel.y
    };

    this.size = {
      x: settings.size.x,
      y: settings.size.y
    };

    this.maxPos = {
      x: settings.maxPos.x,
      y: settings.maxPos.y
    };

    this.explosionSound = new Howl({
      urls: [this.game.soundsPath + 'explosion01.wav', this.game.soundsPath + 'explosion01.mp3', this.game.soundsPath + 'explosion01.ogg'],
      volume: 0.5
    });    

  };

  Asteroid.prototype = {

    update: function(){

      if (this.game.paused) return;

      this.center.x += this.vel.x;
      this.center.y += this.vel.y;
      this.angle += this.turnSpeed;
      this.wrap();

    },

    wrap: function(){
      if (this.center.y > this.maxPos.y) {
        this.center.y = -this.size.y;
      } else if (this.center.y < -this.size.y) {
        this.center.y = this.maxPos.y;
      }

      if (this.center.x > this.maxPos.x) {
        this.center.x = -this.size.x;
      } else if (this.center.x < -this.size.x) {
        this.center.x = this.maxPos.x;
      }
    },

    draw: function(context){

      context.beginPath();
      context.rect(this.center.x - this.size.x/2, this.center.y - this.size.y/2, 
        this.size.x, this.size.y);

      context.lineWidth = this.game.settings.ASTEROID_LINE_WIDTH;
      context.strokeStyle = this.game.settings.FOREGROUND_COLOR;
      context.stroke();

    },

    collision: function(other, type){

      if (type === this.game.coquette.collider.INITIAL){
        if ((other instanceof Bullet && !other.hostile) || (other instanceof Player && !other.spawning)){
          this.game.coquette.entities.destroy(this);
          this.game.asteroidKilled(this, other);
        }
      }
    }

  };

  exports.Asteroid = Asteroid;

})(this);