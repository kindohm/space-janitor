;(function(exports){

  var RadialBlast = function(game, settings){

    this.game = game;

    this.pos = {
      x: settings.pos.x,
      y: settings.pos.y
    };

    this.boundingBox = this.game.coquette.collider.CIRCLE;
    this.size = { x: 20, y: 20};
    this.flashTicksLeft = 20;
    this.flashTicks = 20;
  };

  RadialBlast.prototype = {

    size: {x: 20,y: 20},
    growthRate: 10,
    maxSize: 440,

    update: function(){
      this.size.x += this.growthRate;
      this.size.y += this.growthRate;
      this.pos.x -= this.growthRate / 2;
      this.pos.y -= this.growthRate / 2;

      this.flashTicksLeft = Math.max(0, this.flashTicksLeft - 1);

      if (this.size.x >= this.maxSize){
        this.game.coquette.entities.destroy(this);
      }
    },

    draw: function(context){
      var flashRatio = (this.flashTicksLeft / this.flashTicks).toString();
      var sizeRatio = ((this.maxSize - this.size.x) / this.maxSize).toString();

      if (this.flashTicksLeft > 0){
        context.fillStyle = 'rgba(' + this.game.settings.FLASH_BASE_COLOR + ',' + flashRatio + ')';
        context.fillRect(0,0,this.game.width, this.game.height);
      }

      context.beginPath();
      context.arc(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2, this.size.x/2, 0, Math.PI * 2, true);
      context.lineWidth = 5;
      context.strokeStyle = 'rgba(' + this.game.settings.RADIAL_BLAST_BASE_COLOR + ',' + sizeRatio + ')';
      context.stroke();
      context.closePath();
    },

    collision: function(other, type){
      if (type === this.game.coquette.collider.INITIAL){
        if (other instanceof Asteroid){
          this.game.asteroidKilled(other, this);
          this.game.coquette.entities.destroy(other);
        }
      } else if (other instanceof Bullet && other.hostile){
        this.game.coquette.entities.destroy(other);
      }

    }

  };

  exports.RadialBlast = RadialBlast;

})(this);