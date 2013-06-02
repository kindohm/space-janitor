;(function(exports){

  var Ufo = function(game, settings){

    this.game = game;
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

    this.halfSize = {
      x: this.size.x / 2,
      y: this.size.y / 2
    };

    this.shotTicksLeft = this.shotTicks;
    this.boundingBox = this.game.coquette.collider.RECTANGLE;
  };

  Ufo.prototype = {

    shotTicks: 40,
    shotVelScale: 5,

    update: function(){
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      this.checkBounds();
      this.checkShoot();
    },

    checkShoot: function(){
      this.shotTicksLeft--;
      if (this.shotTicksLeft === 0){
        this.shoot();
        this.shotTicksLeft = this.shotTicks;
      }
    },

    shoot: function(){

      var angle = this.game.maths.getRandomInt(0, 359);
      var vector = this.game.maths.angleToVector(angle);
      var shotVel = {
        x: vector.x * this.shotVelScale,
        y: vector.y * this.shotVelScale
      };

      var bulletPos = {
        x: vector.x * this.halfSize.x + this.halfSize.x + this.pos.x,
        y: vector.y * this.halfSize.y + this.halfSize.y + this.pos.y
      };

      this.game.coquette.entities.create(Bullet, 
        {
          pos: bulletPos, 
          vel: shotVel,
          hostile: true
        });

    },

    checkBounds: function(){

      if (this.pos.x > this.game.width + this.size.x || this.pos.x < -this.size.x){
        this.selfKill();
      }

    },

    draw: function(context){

      context.beginPath();
      context.moveTo(this.pos.x, this.pos.y + this.size.y * .25);
      context.lineTo(this.pos.x, this.pos.y + this.size.y * .75);

      context.lineTo(this.pos.x + this.size.x * .25, this.pos.y + this.size.y);
      context.lineTo(this.pos.x + this.size.x * .75, this.pos.y + this.size.y);

      context.lineTo(this.pos.x + this.size.x, this.pos.y + this.size.y * .75);
      context.lineTo(this.pos.x + this.size.x, this.pos.y + this.size.y * .25);

      context.lineTo(this.pos.x + this.size.x * .75, this.pos.y);
      context.lineTo(this.pos.x + this.size.x * .25, this.pos.y);

      context.lineTo(this.pos.x, this.pos.y + this.size.y * .25);



      context.closePath();
      context.strokeStyle = '#ccc';
      context.lineWidth = this.game.settings.PLAYER_LINE_WIDTH;
      context.stroke();


    },

    selfKill: function(){
      this.game.coquette.entities.destroy(this);
    },

    collision: function(other, type){
      if (type === this.game.coquette.collider.INITIAL && 
        (
          (other instanceof Bullet && !other.hostile) ||
          other instanceof Player
        )){
          this.game.ufoKilled(this);
          this.game.coquette.entities.destroy(this);
      }
    }

  };

  exports.Ufo = Ufo;

})(this);