;(function(exports){

  var Bullet = function(game, settings){
    var self = this;
    this.game = game;
    this.pos = settings.pos;
    this.vel = settings.vel;
    this.sprite = game.spriteFactory.getBulletSprite();
    
    this.size = {
      x:this.game.settings.BULLET_SIZE_X,
      y:this.game.settings.BULLET_SIZE_Y
    };
    
    this.halfSize = {
      x: this.size.x / 2,
      y: this.size.y / 2
    };

  };

  Bullet.prototype = {

    size: { x:2, y:2 },
    halfSize: { x:1, y:1 },

    update: function() {

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      // destory the bullet if it reaches the screen bounds
      if (this.pos.y <= 0 || this.pos.y >= this.game.height ||
        this.pos.x <= 0 || this.pos.y >= this.game.width){
        this.game.coquette.entities.destroy(this);
      }
    },

    draw: function(context) {
      context.drawImage(this.sprite, this.pos.x - this.halfSize.x, 
        this.pos.y - this.halfSize.y, this.size.x, this.size.y);
    }
  };

  exports.Bullet = Bullet;

})(this);