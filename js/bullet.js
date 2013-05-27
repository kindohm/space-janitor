;(function(exports){

  var Bullet = function(game, settings){
    var self = this;
    this.game = game;
    this.pos = settings.pos;
    this.vel = settings.vel;
    this.sprite = this.getSprite();
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
    },

    getSprite: function(){

      var canvas = document.createElement('canvas');
      canvas.width = this.size.x;
      canvas.height = this.size.y;

      var context = canvas.getContext('2d');
      context.fillStyle = '#ffff00';
      context.fillRect(0,0,this.size.x, this.size.y);
      return canvas;
    },


  };

  exports.Bullet = Bullet;

})(this);