;(function(exports){

  var Powerup = function(game, settings){
    this.game = game;
    this.pos = {
      x: settings.pos.x,
      y: settings.pos.y
    };
    this.vel = {
      x: settings.vel.x,
      y: settings.vel.y
    };
    this.boundingBox = this.game.coquette.collider.CIRCLE;
    this.game.soundBus.powerupHumSound.play();

    this.fadeTicks = this.fadeAmount = 60;
    this.growing = true;
    this.powerupType = settings.powerupType;
    this.color = this.powerupType === this.TYPE_RADIAL_BLAST ? this.game.settings.RADIAL_BLAST_BASE_COLOR : this.game.settings.RAPID_FIRE_BASE_COLOR;

  };

  Powerup.prototype = {

    TYPE_RADIAL_BLAST: 0,
    TYPE_RAPID_FIRE: 1,
    size: {x:40,y:40},
    halfSize: {x:20,y:20},

    update: function(){
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      if (this.fadeTicks === this.fadeAmount){
        this.growing = false;
      } else if (this.fadeTicks === 30){
        this.growing = true;
      }

      this.fadeTicks += this.growing ? 1 : -1;

      if (this.pos.x < -this.size.x || 
        this.pos.x > (this.game.width + this.size.x) || 
        this.pos.y < -this.size.y || 
        this.pos.y > (this.game.height + this.size.y)){

        this.game.soundBus.powerupHumSound.stop();
        this.game.coquette.entities.destroy(this);

      }

    },

    draw: function(context){

      context.beginPath();
      context.arc(this.pos.x + this.halfSize.x, this.pos.y + this.halfSize.y, this.halfSize.x, 0, Math.PI * 2, true);
      context.lineWidth = 3;
      var ratio = (this.fadeTicks / this.fadeAmount).toString();
      context.strokeStyle = 'rgba(' + this.color + ',' + ratio + ')';
      context.stroke();
      context.closePath();

    },

    collision: function(other, type){

      if (other instanceof Bullet && !other.hostile){
        this.game.coquette.entities.destroy(this);
        this.game.coquette.entities.destroy(other);
        this.game.soundBus.powerupHumSound.stop();
        this.game.powerupAcquired(this);
      }
    }

  };

  exports.Powerup = Powerup;


})(this);