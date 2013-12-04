;(function(exports){

  var Bullet = exports.Bullet;

  function Player(game, settings){

    var self = this;
    this.center = { x: settings.pos.x, y: settings.pos.y };
    this.maxPos = { x: settings.maxPos.x, y: settings.maxPos.y };
    this.game = game;
    this.angle = 180;

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


    this.bulletDelayTicks = game.settings.BULLET_DELAY_TICKS;
    
    if (settings.ThrustEffect != undefined){
      this.thrustEffect = new settings.ThrustEffect(game);
    }
    else{
      this.thrustEffect = new exports.ThrustEffect(game);
    }

    this.boundingBox = this.game.coquette.collider.CIRCLE;
    this.rapidFire = false;
    this.spraying = false;
    this.rapidFireBulletsLeft = 0;
    this.sprayBulletsLeft = 0;

    this.spawning = true;
    this.spawnTicksLeft = this.game.settings.INVINCIBLE_SPAWN_TICKS;
    this.spawningDrawOn = true;
    this.spawnFlickerTicksLeft = 2;
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

      this.center.x += this.vel.x;
      this.center.y += this.vel.y;

      this.wrap();

      this.shotTicksLeft = Math.max(0, this.shotTicksLeft - 1);
      this.thrustEffect.update(this);

      if (this.spawning){
        this.spawnFlickerTicksLeft--;
        if (this.spawnFlickerTicksLeft === 0){
          this.spawnFlickerTicksLeft = 2;
          this.spawningDrawOn = !this.spawningDrawOn;
        }
        this.spawnTicksLeft--;
        if (this.spawnTicksLeft === 0) {
          this.spawning = false;
          this.spawningDrawOn = false;
        }
      }
    },

    wrap: function(){
      if (this.center.y > this.maxPos.y) {
        this.center.y = -this.size.y;
      } else if (this.center.y < -this.size.y) {
        this.center.y = this.maxPos.y;
      }

      if (this.center.x > this.maxPos.x) {
        this.center.x = -this.size.x;
      } else if (this.center.x < -this.size.x) {
        this.center.x = this.maxPos.x;
      }
    },

    draw: function(context){
      this.drawMainSprite(context);
    },

    drawMainSprite: function(context){
      context.beginPath();
      context.moveTo(this.center.x - this.halfSize.x,this.center.y-this.halfSize.y);
      context.lineTo(this.center.x, this.center.y+this.halfSize.y);
      context.lineTo(this.center.x + this.halfSize.x, this.center.y-this.halfSize.y);
      context.lineTo(this.center.x,this.center.y - this.halfSize.y/1.7);
      context.lineTo(this.center.x - this.halfSize.x,this.center.y-this.halfSize.y);

      //context.closePath();
      context.strokeStyle = !this.spawningDrawOn ? this.game.settings.FOREGROUND_COLOR : this.game.settings.SECONDARY_COLOR;
      context.lineWidth = this.game.settings.PLAYER_LINE_WIDTH;
      context.stroke();
    },

    handleKeyboard: function(){

      if(this.game.coquette.inputter.isDown(this.game.coquette.inputter.UP_ARROW)) {        
        this.applyThrust();
      } else if (this.thrusting) {
        this.idleThrust();
      }

      if(this.game.coquette.inputter.isDown(this.game.coquette.inputter.LEFT_ARROW)) {
        this.rotate('left');
      }

      if(this.game.coquette.inputter.isDown(this.game.coquette.inputter.RIGHT_ARROW)) {
        this.rotate('right');
      }

      if(this.game.coquette.inputter.isDown(this.game.coquette.inputter.SPACE)) {
        this.shoot();
      }

      if (this.game.coquette.inputter.isDown(this.game.coquette.inputter.DOWN_ARROW)){

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

        if (this.rapidFire){
          this.rapidFireBulletsLeft = Math.max(0, this.rapidFireBulletsLeft - 1);
          if (this.rapidFireBulletsLeft === 0){
            this.disableRapidFire();
          }
        }

        if (this.spraying){
          this.sprayBulletsLeft = Math.max(0, this.sprayBulletsLeft - 1);
          if (this.sprayBulletsLeft === 0){
            this.disableSpray();
          }          
        }

        this.createBulletAtAngle(this.angle);

        if (this.spraying){
          this.createBulletAtAngle(this.angle - 5);          
          this.createBulletAtAngle(this.angle + 5);          
        }

        this.game.soundBus.gunSound.play();
        this.game.shotFired();
        this.shotTicksLeft = this.bulletDelayTicks;
      }
    },

    createBulletAtAngle: function(angle){
        // get direction vector
        var vector = this.game.maths.angleToVector(angle);

        // calculate bullet origin position relative to ship's center
        var bulletPos = {
          x: vector.x * this.halfSize.x + this.center.x,
          y: vector.y * this.halfSize.y + this.center.y
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
    },

    deployRadialBlast: function(){
      
      this.game.coquette.entities.create(RadialBlast,{
        pos: {
          x: this.center.x,
          y: this.center.y
        }
      });

      this.game.radialBlastDeployed();
      this.game.soundBus.radialBlastSound.play();
      this.radialBlasts--;
    },

    collision: function(other, type){
      if (this.spawning) return;

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
    },

    enableRapidFire: function(){
      this.bulletDelayTicks = Math.floor(this.game.settings.BULLET_DELAY_TICKS / 2);
      this.rapidFire = true;
      this.rapidFireBulletsLeft = this.game.settings.RAPID_FIRE_CLIP_SIZE;
    },

    enableSpray: function(){
      this.spraying = true;
      this.sprayBulletsLeft = this.game.settings.SPRAY_CLIP_SIZE;
    },

    disableSpray: function(){
      this.spraying = false;
      this.sprayBulletsLeft = 0;
    },

    disableRapidFire: function(){
      this.rapidFire = false;
      this.bulletDelayTicks = this.game.settings.BULLET_DELAY_TICKS;
      this.rapidFireBulletsLeft = 0;
    }

  };

  exports.Player = Player;

})(this);