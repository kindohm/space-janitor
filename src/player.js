;(function(exports){

  var Bullet = exports.Bullet;

  function Player(game, settings){

    var self = this;
    this.pos = { x: settings.pos.x, y: settings.pos.y };
    this.maxPos = { x: settings.maxPos.x, y: settings.maxPos.y };
    this.game = game;
    
    this.radialBlasts = settings.radialBlasts;

    this.size = { 
      x: game.settings.PLAYER_SIZE,
      y: game.settings.PLAYER_SIZE 
    };

    this.halfSize = {
      x: this.size.x / 2,
      y: this.size.y / 2
    };

    this.vel = { 
      x: 0,
      y: 0
    };

    this.thrust = {
      x: 0,
      y:0
    };

    this.bulletTicksLeft = game.settings.BULLET_DELAY_TICKS;
    
    if (settings.ThrustEffect != undefined){
      this.thrustEffect = new settings.ThrustEffect(game);
    }
    else{
      this.thrustEffect = new exports.ThrustEffect(game);
    }

    this.boundingBox = this.game.coquette.collider.CIRCLE;

  }

  Player.prototype = {

    radialBlasts: 0,
    colliding: false,
    thrustEffect: null,
    size: {x: 20, y: 30},
    halfSize: {x: 10, y: 15},
    vel: {x: 0,  y: 0},
    angle: 180,
    rAngle: 3.14,
    angleVector: {x: 0, y: 0}, 
    thrust: {x: 0, y: 0},
    thrusting: false,
    thrustScale: 0,
    shotTicksLeft: 0,

    update: function (){

      if (this.game.paused) return;

      this.handleKeyboard();

      this.vel.x += this.thrust.x;
      this.vel.y += this.thrust.y;

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      this.wrap();

      this.shotTicksLeft = Math.max(0, this.shotTicksLeft - 1);
      this.thrustEffect.update(this);
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

      context.save();
      context.translate(this.pos.x + this.halfSize.x, this.pos.y + this.halfSize.y);
      context.rotate(this.rAngle);
      this.drawMainSprite(context);
      context.rotate(-this.Angle);
      context.translate(-(this.pos.x), -(this.pos.y));
      context.restore();

      this.thrustEffect.draw(context);
    },

    drawMainSprite: function(context){
      context.beginPath();
      context.moveTo(-this.halfSize.x,-this.halfSize.y);
      context.lineTo(0,this.halfSize.y);
      context.lineTo(this.halfSize.x, -this.halfSize.y);
      context.lineTo(0,-this.halfSize.y/1.7);
      context.lineTo(-this.halfSize.x,-this.halfSize.y);
      context.closePath();
      context.strokeStyle = this.game.settings.FOREGROUND_COLOR;
      context.lineWidth = this.game.settings.PLAYER_LINE_WIDTH;
      context.stroke();

    },

    handleKeyboard: function(){

      if(this.game.coquette.inputter.state(this.game.coquette.inputter.UP_ARROW)) {        
        this.applyThrust();
      } else if (this.thrusting) {
        this.idleThrust();
      }

      if(this.game.coquette.inputter.state(this.game.coquette.inputter.LEFT_ARROW)) {
        this.rotate('left');
      }

      if(this.game.coquette.inputter.state(this.game.coquette.inputter.RIGHT_ARROW)) {
        this.rotate('right');
      }

      if(this.game.coquette.inputter.state(this.game.coquette.inputter.SPACE)) {
        this.shoot();
      }

      if (this.game.coquette.inputter.state(this.game.coquette.inputter.DOWN_ARROW)){

        if (this.game.coquette.entities.all(RadialBlast).length === 0 && this.radialBlasts > 0){
        
          this.deployRadialBlast();
        }
        
      }
    },

    rotate: function(direction){      
      var delta = this.game.settings.PLAYER_ROTATE_DELTA;
      this.angle = this.game.maths.dial(this.angle, direction === 'right' ? 
        delta : -delta, 359);
      this.rAngle = this.game.maths.degToRad(this.angle);
    },

    applyThrust: function (){
      this.thrustScale = this.game.settings.PLAYER_THRUST_DELTA;
      var vector = this.game.maths.angleToVector(this.angle);
      this.thrust.x = vector.x * this.thrustScale;
      this.thrust.y = vector.y * this.thrustScale;
      this.game.thrusting();
      
      if (!this.thrusting){
        this.thrusting = true;
        this.game.soundBus.thrustSound.play();
      }
    },

    idleThrust: function (){
      
      if (this.thrusting){
        this.thrusting = false;
        this.thrust.x = this.thrust.y = this.thrustScale = 0;
        this.game.soundBus.thrustSound.stop();
      }
    },

    shoot: function(){

      if (this.shotTicksLeft === 0){

        // get ship's direction vector
        var vector = this.game.maths.angleToVector(this.angle);

        // calculate bullet origin position relative to ship's center
        var bulletPos = {
          x: vector.x * this.halfSize.x + this.halfSize.x + this.pos.x,
          y: vector.y * this.halfSize.y + this.halfSize.y + this.pos.y
        };

        // calculate bullet velocity vector
        var bulletVel = {
          x: vector.x * this.game.settings.BULLET_VELOCITY,
          y: vector.y * this.game.settings.BULLET_VELOCITY
        };

        // create bullet entity
        this.game.coquette.entities.create(Bullet, 
          {
            pos: {
              x: bulletPos.x, 
              y: bulletPos.y
            }, 
            vel: bulletVel
          });

        this.game.soundBus.gunSound.play();
        this.game.shotFired();
        this.shotTicksLeft = this.game.settings.BULLET_DELAY_TICKS;
      }
    },

    deployRadialBlast: function(){
      
      this.game.coquette.entities.create(RadialBlast,{
        pos: {
          x: this.pos.x,
          y: this.pos.y
        }
      });

      this.game.radialBlastDeployed();
      this.game.soundBus.radialBlastSound.play();
      this.radialBlasts--;
    },

    collision: function(other, type){
      this.colliding = true;
      if (type === this.game.coquette.collider.INITIAL){
        if (other instanceof Asteroid || (other instanceof Bullet && other.hostile || other instanceof Ufo)){
          this.game.coquette.entities.destroy(this);
          this.game.soundBus.thrustSound.stop();
          this.game.playerKilled(this, other);
        }
      }
    },

    uncollision: function(){
      this.colliding = false;
    }

  };

  exports.Player = Player;

})(this);