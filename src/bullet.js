;(function(exports){

  var Bullet = function(game, settings){
    var self = this;
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
    this.sprite = game.spriteFactory.getBulletSprite();
    
    this.size = {
      x:this.game.settings.BULLET_SIZE_X,
      y:this.game.settings.BULLET_SIZE_Y
    };

    this.hostile = settings.hostile === undefined ? false : settings.hostile;
    
  };

  Bullet.prototype = {

    size: { x:2, y:2 },
    halfSize: { x:1, y:1 },

    update: function() {

      if (this.game.paused) return;

      this.center.x += this.vel.x;
      this.center.y += this.vel.y;

      // destory the bullet if it reaches the screen bounds
      if (this.center.y <= 0 || this.center.y >= this.game.height ||
        this.center.x <= 0 || this.center.x >= this.game.width){
        this.game.coquette.entities.destroy(this);
      }
    },

    draw: function(context) {

      context.drawImage(this.sprite, this.center.x - this.size.x/2, 
        this.center.y - this.size.y/2, this.size.x, this.size.y);
    },

    collision: function(other, type){
      if (!this.hostile && other instanceof Asteroid){
        this.game.coquette.entities.destroy(this);
      }
    }
  };

  exports.Bullet = Bullet;

})(this);