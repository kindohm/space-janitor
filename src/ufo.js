;(function(exports){

  var Ufo = function(game, settings){

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

    this.size = {
      x: settings.size.x,
      y: settings.size.y
    };

    this.halfSize = {
      x: this.size.x / 2,
      y: this.size.y / 2
    };

    this.shotTicks = settings.shotTicks;
    this.shotTicksLeft = this.shotTicks;
    this.boundingBox = this.game.coquette.collider.RECTANGLE;
    this.game.soundBus.ufoSound.play();
  };

  Ufo.prototype = {

    shotTicks: 40,
    shotVelScale: 5,

    update: function(){
      if (this.game.paused) return;
      this.center.x += this.vel.x;
      this.center.y += this.vel.y;

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
        x: vector.x * this.halfSize.x + this.halfSize.x + this.center.x,
        y: vector.y * this.halfSize.y + this.halfSize.y + this.center.y
      };

      this.game.coquette.entities.create(Bullet, 
        {
          pos: bulletPos, 
          vel: shotVel,
          hostile: true
        });

    },

    checkBounds: function(){

      if (this.center.x > this.game.width + this.size.x || this.center.x < -this.size.x){
        this.selfKill();
      }

    },

    draw: function(context){

      context.beginPath();
      context.moveTo(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y + this.size.y * .25);
      context.lineTo(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y + this.size.y * .75);

      context.lineTo(this.center.x - this.halfSize.x + this.size.x * .25, this.center.y - this.halfSize.y + this.size.y);
      context.lineTo(this.center.x - this.halfSize.x + this.size.x * .75, this.center.y - this.halfSize.y + this.size.y);

      context.lineTo(this.center.x - this.halfSize.x + this.size.x, this.center.y - this.halfSize.y + this.size.y * .75);
      context.lineTo(this.center.x - this.halfSize.x + this.size.x, this.center.y - this.halfSize.y + this.size.y * .25);

      context.lineTo(this.center.x - this.halfSize.x + this.size.x * .75, this.center.y - this.halfSize.y);
      context.lineTo(this.center.x - this.halfSize.x + this.size.x * .25, this.center.y - this.halfSize.y);

      context.lineTo(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y + this.size.y * .25);



      context.closePath();
      context.strokeStyle = this.game.settings.FOREGROUND_COLOR;
      context.lineWidth = this.game.settings.PLAYER_LINE_WIDTH;
      context.stroke();


    },

    selfKill: function(){
      this.game.coquette.entities.destroy(this);
      this.game.soundBus.ufoSound.stop();
    },

    collision: function(other, type){
      if (type === this.game.coquette.collider.INITIAL && 
        (
          (other instanceof Bullet && !other.hostile) ||
          other instanceof RadialBlast ||
          (other instanceof Player && !other.spawning)
        )){
          this.game.soundBus.ufoSound.stop();
          this.game.ufoKilled(this, other);
          this.game.coquette.entities.destroy(this);
      }
    }

  };

  exports.Ufo = Ufo;

})(this);