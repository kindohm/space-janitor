;(function(exports){

  var Powerup = function(game, settings){
    this.game = game;
    this.angle = 0;

    this.center = {
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


    this.color = '200,200,200';

    if (this.powerupType === this.TYPE_RADIAL_BLAST){
      this.color = this.game.settings.RADIAL_BLAST_BASE_COLOR;
    } else if (this.powerupType === this.TYPE_RAPID_FIRE){
      this.color = this.game.settings.RAPID_FIRE_BASE_COLOR;
    } else if (this.powerupType === this.TYPE_SPRAY){
      this.color = this.game.settings.SPRAY_BASE_COLOR;
    }
  };

  Powerup.prototype = {

    TYPE_RADIAL_BLAST: 0,
    TYPE_RAPID_FIRE: 1,
    TYPE_SPRAY: 2,

    size: {x:40,y:40},
    halfSize: {x:20,y:20},

    update: function(){
      this.center.x += this.vel.x;
      this.center.y += this.vel.y;

      if (this.fadeTicks === this.fadeAmount){
        this.growing = false;
      } else if (this.fadeTicks === 30){
        this.growing = true;
      }

      this.fadeTicks += this.growing ? 1 : -1;

      if (this.center.x < -this.size.x || 
        this.center.x > (this.game.width + this.size.x) || 
        this.center.y < -this.size.y || 
        this.center.y > (this.game.height + this.size.y)){

        this.game.soundBus.powerupHumSound.stop();
        this.game.coquette.entities.destroy(this);

      }

    },

    draw: function(context){

      context.beginPath();
      context.arc(this.center.x, this.center.y, this.halfSize.x, 0, Math.PI * 2, true);
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