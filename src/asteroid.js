;(function(exports){

  var Asteroid = function(game, settings){

    this.game = game;
    this.boundingBox = settings.boundingBox;
    
    this.pos = {
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

  };

  Asteroid.prototype = {

    update: function(){
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      this.wrap();
    },

    wrap: function(){
      if (this.pos.y > this.maxPos.y) {
        this.pos.y = -this.size.y;
      } else if (this.pos.y < -this.size.y) {
        this.pos.y = this.maxPos.y;
      }

      if (this.pos.x > this.maxPos.x) {
        this.pos.x = -this.size.x;
      } else if (this.pos.x < -this.size.x) {
        this.pos.x = this.maxPos.x;
      }
    },

    draw: function(context){
      context.beginPath();
      if (this.boundingBox == this.game.coquette.collider.RECTANGLE){
        context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
      }
      else{
        context.arc(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2,
          this.size.x/2, 0, Math.PI * 2, false);
       }

      context.lineWidth = this.game.settings.ASTEROID_LINE_WIDTH;
      context.strokeStyle = '#ccc';
      context.stroke();

    },

    collision: function(other, type){
      if (type === this.game.coquette.collider.INITIAL){
        if (other instanceof Bullet){
          this.game.coquette.entities.destroy(this);
          this.game.asteroidKilled(this);
        }
      }
    }

  };

  exports.Asteroid = Asteroid;

})(this);