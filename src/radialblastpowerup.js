;(function(exports){

  var RadialBlastPowerup = function(game, settings){
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
  };

  RadialBlastPowerup.prototype = {

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
      context.strokeStyle = 'rgba(' + this.game.settings.POWERUP_BASE_COLOR + ',' + ratio + ')';
      console.log('rgba(' + this.game.settings.POWERUP_BASE_COLOR + ',' + ratio + ')');
      context.stroke();
      context.closePath();

    },

    collision: function(other, type){

      if (other instanceof Bullet && !other.hostile){
        this.game.coquette.entities.destroy(this);
        this.game.coquette.entities.destroy(other);
        this.game.soundBus.powerupHumSound.stop();
        this.game.radialBlastAcquired(this);
      }
    }

  };

  exports.RadialBlastPowerup = RadialBlastPowerup;


})(this);