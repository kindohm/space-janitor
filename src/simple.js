;(function(exports){

  var Simple = function(game, settings){

    this.game = game;
    this.pos = {
      x:settings.pos.x,
      y:settings.pos.y
    };
    this.size = {
      x:settings.size.x,
      y:settings.size.y
    };
    this.vel = {
      x:settings.vel.x,
      y:settings.vel.y
    };
    this.boundingBox = settings.isBox ? game.coquette.collider.RECTANGLE : game.coquette.collider.CIRCLE;
  };

  Simple.prototype = {

    size: {x:50,y:50},
    pos: {x:100,y:100},
    vel: {x:0,y:0},

    update: function(){
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
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

      context.lineWidth = 1;
      context.strokeStyle = '#ccc';
      context.stroke();

    },
  }

  exports.Simple = Simple;

})(this);