;(function(exports){

  var num = '0.3.2';

  var Version = function(){
    this.number = num;
  };
  
  exports.Version = Version;

})(this);
;(function(exports){

  var Settings = function() { };

  Settings.prototype = {

    PLAYER_ROTATE_DELTA:  5,
    PLAYER_THRUST_DELTA:  0.04,
    PLAYER_SIZE:          30,
    PLAYER_LINE_WIDTH:    2, 
    BULLET_VELOCITY:      5.0,
    BULLET_DELAY_TICKS:   10, 
    BULLET_SIZE_X:        4,
    BULLET_SIZE_Y:        4,
    THRUST_EFFECT_TICKS:  8,
    THRUST_EFFECT_VEL:    1.0, 
    ASTEROID_LINE_WIDTH:  2,
    ASTEROID_SIZE_LARGE:  100,
    ASTEROID_SIZE_MEDIUM: 50, 
    ASTEROID_SIZE_SMALL:  25,

    /* DEFAULT THEME */
    
    BACKGROUND_COLOR:     '#000',
    POWERUP_BASE_COLOR:   '100,100,255',
    POWERUP_COLOR:        '#6666FF',
    FOREGROUND_COLOR:     '#ccc',
    FOREGROUND_BASE_COLOR:'204,204,204',
    FLASH_BASE_COLOR:     '255,255,255', 
    MUTED_COLOR:     '#333',
    
    /* NEPTUNE THEME */
    /*
    BACKGROUND_COLOR:     '#0094FF',
    POWERUP_BASE_COLOR:   '255,255,100',
    POWERUP_COLOR:        '#FFFF66',
    FOREGROUND_COLOR:     '#fff',
    FOREGROUND_BASE_COLOR:'255,255,255',
    FLASH_BASE_COLOR:     '255,255,255', 
    */

    /* LUNAR THEME */
    /*
    BACKGROUND_COLOR:     '#fff',
    POWERUP_BASE_COLOR:   '100,100,255',
    POWERUP_COLOR:        '#6666FF',
    FOREGROUND_COLOR:     '#333',
    FOREGROUND_BASE_COLOR:'51,51,51',
    FLASH_BASE_COLOR:     '0,0,0', 
    */

  };

  exports.Settings = Settings;

})(this);
;(function(exports){

  var cache = new Hashtable();

  var SpriteFactory = function(game){
    this.game = game;
  };

  SpriteFactory.prototype = {

    getBulletSprite: function(){

      if (!cache.containsKey(this.getBulletSprite)){
        var canvas = document.createElement('canvas');
        canvas.width = this.game.settings.BULLET_SIZE_X;
        canvas.height = this.game.settings.BULLET_SIZE_Y;

        var context = canvas.getContext('2d');
        context.fillStyle = this.game.settings.FOREGROUND_COLOR;
        context.fillRect(0,0,this.game.settings.BULLET_SIZE_X, this.game.settings.BULLET_SIZE_Y);
        cache.put(this.getBulletSprite, canvas);
      }

      return cache.get(this.getBulletSprite);

    },

  };

  exports.SpriteFactory = SpriteFactory;

})(this);
;(function(exports){

  var Bullet = function(game, settings){
    var self = this;
    this.game = game;
    this.pos = {
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

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      // destory the bullet if it reaches the screen bounds
      if (this.pos.y <= 0 || this.pos.y >= this.game.height ||
        this.pos.x <= 0 || this.pos.x >= this.game.width){
        this.game.coquette.entities.destroy(this);
      }
    },

    draw: function(context) {

      context.drawImage(this.sprite, this.pos.x, 
        this.pos.y, this.size.x, this.size.y);
    },

    collision: function(other, type){
      if (!this.hostile && other instanceof Asteroid){
        this.game.coquette.entities.destroy(this);
      }
    }
  };

  exports.Bullet = Bullet;

})(this);
;(function(exports){

  var SoundBus = function(soundsPath){

    this.asteroidExplosionSound = new Howl({
      urls: [
        soundsPath + 'explosion01.wav', 
        soundsPath + 'explosion01.mp3', 
        soundsPath + 'explosion01.ogg'
      ],
      volume: 0.4
    });    

    this.playerExplosionSound = new Howl({
      urls: [
        soundsPath + 'explosion02.wav', 
        soundsPath + 'explosion02.mp3', 
        soundsPath + 'explosion02.ogg'
      ],
      volume: 0.7
    });  

    this.thrustSound = new Howl({
      urls: [
        soundsPath + 'thrust.wav', 
        soundsPath + 'thrust.mp3', 
        soundsPath + 'thrust.ogg'],
      volume: .5,
      loop: true
    });

    this.gunSound = new Howl({
      urls: [
        soundsPath + 'gun.wav', 
        soundsPath + 'gun.mp3', 
        soundsPath + 'gun.ogg'],
      volume: 0.5
    });    

    this.ufoSound = new Howl({
      urls: [
        soundsPath + 'ufo.wav', 
        soundsPath + 'ufo.mp3', 
        soundsPath + 'ufo.ogg'],
      volume: 0.5,
      loop: true
    });    

    this.oneUpSound = new Howl({
      urls: [
        soundsPath + 'oneup.wav', 
        soundsPath + 'oneup.mp3', 
        soundsPath + 'oneup.ogg'],
      volume: 0.7,
      loop: false
    });    

    this.radialBlastSound = new Howl({
      urls: [
        soundsPath + 'radialblast.wav', 
        soundsPath + 'radialblast.mp3', 
        soundsPath + 'radialblast.ogg'],
      volume: 0.3,
      loop: false
    });    

    this.pauseSound = new Howl({
      urls: [
        soundsPath + 'pause.wav', 
        soundsPath + 'pause.mp3', 
        soundsPath + 'pause.ogg'],
      volume: 0.7,
      loop: false
    });    

    this.powerupHumSound = new Howl({
      urls: [
        soundsPath + 'poweruphum.wav', 
        soundsPath + 'poweruphum.mp3', 
        soundsPath + 'poweruphum.ogg'],
      volume: 0.4,
      loop: true
    });    

  };

  SoundBus.prototype = {

  };

  exports.SoundBus = SoundBus;
})(this);
;(function(exports){

  var ThrustBubble = function(game, pos, direction){

    this.game = game;

    this.pos = {
      x: pos.x,
      y: pos.y
    };
    this.vel = {
      x: direction.x,
      y: direction.y
    };

    this.colorBase = game.settings.FOREGROUND_BASE_COLOR;
    this.ticksLeft = this.totalTicks = 30;
    this.radius = 1;
  };

  ThrustBubble.prototype = {

    radiusGrowth: .2,
    pos: null,
    colorBase: '204,204,204',

    update: function(){
      if (this.game.paused) return;
      this.radius += this.radiusGrowth;
      this.ticksLeft--;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    },

    draw: function(context){

      var ratio = this.ticksLeft / this.totalTicks;
      var side = this.radius * 2;
      context.beginPath();
      context.rect(this.pos.x - this.radius, this.pos.y - this.radius,
        side, side);
      context.strokeStyle = 'rgba(' + this.colorBase + ',' + ratio.toString() + ')';
      context.lineWidth = 1;
      context.stroke();
      context.closePath();
    }
  };

  var ThrustEffect = function(game){
    this.effects = [];
    this.game = game;
  };

  ThrustEffect.prototype = {

    thrustEffectTicksLeft: 0,

    add: function(pos, direction){
      var bubble = new ThrustBubble(this.game, pos, direction);
      this.effects.push(bubble);
    },

    update: function(player){

      // decrement ticks and add another "bubble" if it is time
      this.thrustEffectTicksLeft = Math.max(0, this.thrustEffectTicksLeft - 1);
      if (this.thrustEffectTicksLeft === 0 && player.thrusting){
        var vector = this.game.maths.angleToVector(player.angle + 180);
        var effectPos = {
          x: player.pos.x + player.halfSize.x + vector.x * player.halfSize.x,
          y: player.pos.y + player.halfSize.y + vector.y * player.halfSize.y
        };
        var vel = {
          x: vector.x * this.game.settings.THRUST_EFFECT_VEL,
          y: vector.y * this.game.settings.THRUST_EFFECT_VEL
        };
        this.add(effectPos, vel);
        this.thrustEffectTicksLeft = this.game.settings.THRUST_EFFECT_TICKS;
      }

      // remove old effects, update current effects
      for(var i = this.effects.length - 1; i >= 0; i--){
        if (this.effects[i].ticksLeft === 0){
          this.effects.splice(i, 1);
        } else {
          this.effects[i].update();
        }
      }
    },

    draw: function(context){
      for(var i = 0; i < this.effects.length; i++){
        this.effects[i].draw(context);
      }
    }

  };

  exports.ThrustEffect = ThrustEffect;


})(this);
;(function(exports){

  var Particle = function(game, settings){

    this.game = game;
    
    this.pos = {
      x: settings.pos.x,
      y: settings.pos.y
    };

    this.vel = {
      x: settings.vel.x,
      y: settings.vel.y
    };

  };

  Particle.prototype = {

    update: function(){
      if (this.game.paused) return;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    }

  };

  var ExplosionEffect = function(game, settings){
    this.game = game;
    this.numParticles = settings.numParticles;
    this.duration = settings.duration;
    this.ticksLeft = this.duration;
    this.particleSize = settings.particleSize;
    this.baseColor =  settings.baseColor === undefined ? game.settings.FOREGROUND_BASE_COLOR : settings.baseColor;

    this.particles = [];
    for(var i = 0; i < this.numParticles; i++){
      var particle = new Particle(game, {
        pos: {
          x: settings.pos.x,
          y: settings.pos.y
        },
        vel:{
          x: game.maths.getRandomInt(-10,10),
          y: game.maths.getRandomInt(-10,10)
        }
      });
      this.particles.push(particle);
    }
  };

  ExplosionEffect.prototype = {

    complete: false,

    update: function(){
      if (this.game.paused) return;
      if (!this.complete){
        for(var i = 0; i < this.particles.length; i++){
          this.particles[i].update();
        }
        this.ticksLeft--;
        this.complete = this.ticksLeft === 0;
      }
    },

    draw: function(context){

      var ratio = (this.ticksLeft / this.duration).toString();
      if (!this.complete){
        for (var i = 0; i < this.particles.length; i++){
          context.fillStyle = 'rgba(' + this.baseColor + ',' + ratio + ')';
          context.fillRect(this.particles[i].pos.x, this.particles[i].pos.y, this.particleSize, this.particleSize);
        }
      }
    }

  };

  exports.ExplosionEffect = ExplosionEffect;
})(this);
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

    this.explosionSound = new Howl({
      urls: [this.game.soundsPath + 'explosion01.wav', this.game.soundsPath + 'explosion01.mp3', this.game.soundsPath + 'explosion01.ogg'],
      volume: 0.5
    });    

  };

  Asteroid.prototype = {

    update: function(){

      if (this.game.paused) return;

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
      context.strokeStyle = this.game.settings.FOREGROUND_COLOR;
      context.stroke();

    },

    collision: function(other, type){
      if (type === this.game.coquette.collider.INITIAL){
        if ((other instanceof Bullet && !other.hostile) || other instanceof Player){
          this.game.coquette.entities.destroy(this);
          this.game.asteroidKilled(this, other);
        }
      }
    }

  };

  exports.Asteroid = Asteroid;

})(this);
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
          other instanceof Player
        )){
          this.game.soundBus.ufoSound.stop();
          this.game.ufoKilled(this, other);
          this.game.coquette.entities.destroy(this);
      }
    }

  };

  exports.Ufo = Ufo;

})(this);
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
;(function(exports){

  var GameBar = function(game){
    this.game = game;
    
    // In order to ensure the game bar is drawn on top of game entities,
    // the GameBar needs to be an entity itself with a zindex. Coquette
    // won't draw it without a pos and size.
    this.pos = {
      x: -1000,
      y: -1000
    };

    this.size = {
      x: 1,
      y: 1
    };

  };

  GameBar.prototype = {

    levelNumber: 1,
    zindex: 1000,

    draw: function(context){

      if (this.game.difficulty === this.game.DIFFICULTY_FREE) return;

      context.fillStyle = this.game.settings.BACKGROUND_COLOR;
      context.fillRect(0,0,this.game.width, 30);

      context.font = "10px 'Press Start 2P'";
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      
      context.textAlign = "left"
      context.fillText('Level: ' + this.levelNumber.toString(), 10, 20);

      context.textAlign = "left"
      context.fillText('Lives: ' + this.game.lives.toString(), 150, 20);

      context.textAlign = "right"
      context.fillText('Score: ' + Math.floor(this.game.score).toString(), this.game.width - 10, 20);

      if (this.game.player !== null){
        for(var i = 0; i < this.game.player.radialBlasts; i++){
          var x = 280 + i * 20;
          var y = 15;
          context.beginPath();
          context.arc(x, y, 7, 0, Math.PI * 2, true);
          context.lineWidth = 2;
          context.strokeStyle = this.game.settings.POWERUP_COLOR;
          context.stroke();
          context.closePath();
        }
      }
    }
  };

  exports.GameBar = GameBar;

})(this);
;(function(exports){

  var Level = function(game, number, difficulty){
    this.game = game;
    this.difficulty = difficulty;
    this.number = number;
    this.asteroidCount = this.getAsteroidCount();
    this.complete = false;
    this.shots = 0;
    this.asteroidsShot = 0;
    this.levelBonus = 0;
    this.thrustTicks = 0;
    this.ufoDeployed = false;

    this.willDeployPowerup = number % 2 === 0;
    this.powerupTicks = game.maths.getRandomInt(500,1500);
    this.powerupTicksLeft = this.powerupTicks;

    this.score = 0;
    this.radialBlastsCaptured = 0;
    this.radialBlastsDeployed = 0;
    this.asteroidsKilledByBullet = 0;
    this.asteroidsKilledByRadialBlast = 0;
    this.asteroidsKilledByPlayerCollision = 0;
    this.ufosKilledByBullet = 0;
    this.ufosKilledByPlayerCollision = 0;
    this.ufosKilledByRadialBlast = 0;
    this.deathsByAsteroidCollision = 0;
    this.deathsByUfoCollision = 0;
    this.deathsByUfoBullet = 0;
    this.start = new Date();
    this.end = new Date();
  };

  Level.prototype = {

    getAsteroidCount: function(){

      if (this.difficulty === this.game.DIFFICULTY_FREE) 
        return 0;

      if (this.difficulty === this.game.DIFFICULTY_EASY) 
        return Math.min(this.number, 6);

      if (this.difficulty === this.game.DIFFICULTY_NORMAL) 
        return Math.min(this.number + 1, 7);

      if (this.difficulty === this.game.DIFFICULTY_HARD) 
        return Math.min(this.number + 2, 7);

      if (this.difficulty === this.game.DIFFICULTY_INSANE) 
        return Math.min(this.number + 3, 7);
    },

    update: function(){
      if (this.game.paused || this.difficulty === this.game.DIFFICULTY_FREE) return;      
      if (!this.complete) {       
        this.complete = this.game.coquette.entities.all(Asteroid).length === 0
          && this.game.coquette.entities.all(Ufo).length === 0;

        if (this.willDeployPowerup && !this.complete && this.powerupTicksLeft !== 0){
          this.powerupTicksLeft--;
          if (this.powerupTicksLeft === 0){
            this.deployPowerup();
          }
        }
      }
    },    

    deployPowerup: function(){
      var direction = this.game.maths.plusMinus();

      var pos = {
        x: direction === 1 ? -39 : this.game.width,
        y: this.game.maths.getRandomInt(50, this.game.height - 50),
      };

      var vel = {
        x: direction * this.nextUfoVelX(),
        y: this.nextUfoVelY()
      };

      this.game.coquette.entities.create(RadialBlastPowerup, {
        pos: pos,
        vel: vel
      });

    },

    deployAsteroid: function(size, pos){

      if (this.difficulty === this.game.DIFFICULTY_FREE) return;

      var direction = this.game.maths.plusMinus();
      size = size === undefined ? this.game.settings.ASTEROID_SIZE_LARGE : size;

      if (pos === undefined){

        var x = direction === 1 ? 
            this.game.maths.getRandomInt(-this.game.settings.ASTEROID_SIZE_LARGE,150) : 
              this.game.maths.getRandomInt(this.game.width - 150,this.game.width + this.game.settings.ASTEROID_SIZE_LARGE);

        pos = {
          x: x, 
          y: this.game.height
        };

      }

      var xVelBase = this.getNextVelX();
      var yVelBase = this.getNextVelY();

      var vel = {
        x: direction === 1 ? xVelBase : -xVelBase,
        y: yVelBase * this.game.maths.plusMinus()
      };

      this.game.coquette.entities.create(Asteroid, {
        pos: pos,
        vel: vel,
        maxPos:{
          x: this.game.width,
          y: this.game.height
        },
        size: {
          x: size,
          y: size
        },
        boundingBox: this.game.coquette.collider.RECTANGLE
      }, function(created){
      });
    },

    getNextVelX: function(){
      if (this.difficulty === this.game.DIFFICULTY_EASY)
        return this.game.maths.getRandomInt(1, 10 + 10 * this.number * .25) * .01;

      if (this.difficulty === this.game.DIFFICULTY_NORMAL)
        return this.game.maths.getRandomInt(1, 10 + 10 * this.number * .75) * .01;

      if (this.difficulty === this.game.DIFFICULTY_HARD)
        return this.game.maths.getRandomInt(5, 10 + 10 * this.number * 1.25) * .01;

      if (this.difficulty === this.game.DIFFICULTY_INSANE)
        return this.game.maths.getRandomInt(5 + this.number, 10 + 10 * this.number * 1.75) * .01;
    },

    getNextVelY: function(){
      if (this.difficulty === this.game.DIFFICULTY_EASY)
        return this.game.maths.getRandomInt(40, 200 + this.number/2) * .01;

      if (this.difficulty === this.game.DIFFICULTY_NORMAL)
        return this.game.maths.getRandomInt(40 + 5 * this.number, 200 + 10 * this.number) * .01;

      if (this.difficulty === this.game.DIFFICULTY_HARD)
        return this.game.maths.getRandomInt(40 + 10 * this.number, 200 + 30 * this.number) * .01;

      if (this.difficulty === this.game.DIFFICULTY_INSANE)
        return this.game.maths.getRandomInt(50 + 20 * this.number, 210 + 50 * this.number) * .01;
    },


    spawnUfo: function(){

      if (this.difficulty === this.game.DIFFICULTY_FREE ||
        this.difficulty === this.game.DIFFICULTY_EASY) return;

      var direction = this.game.maths.plusMinus();

      var pos = {
        x: direction === 1 ? -39 : this.game.width,
        y: this.game.maths.getRandomInt(50, this.game.height - 50),
      };

      var vel = {
        x: direction * this.nextUfoVelX(),
        y: this.nextUfoVelY()
      };

      var shotTicks = 40;
      for (var i = 5; i < this.number; i+=5){
        shotTicks -= 5;
      }

      shotTicks = Math.max(shotTicks, 20);

      this.game.coquette.entities.create(Ufo, {
        pos: pos,
        vel: vel,
        shotTicks: shotTicks,
        size: {
          x: 40,
          y: 25
        }
      });

    },

    nextUfoVelY: function(){
      if (this.game.difficulty === this.game.DIFFICULTY_NORMAL)
        return .03 * (this.number - 1) * this.game.maths.plusMinus();
      if (this.game.difficulty === this.game.DIFFICULTY_HARD)
        return .05 * (this.number) * this.game.maths.plusMinus();
      if (this.game.difficulty === this.game.DIFFICULTY_INSANE)
        return .1 * (this.number) * this.game.maths.plusMinus();

      return 0;
    },

    nextUfoVelX: function(){
      if (this.game.difficulty === this.game.DIFFICULTY_EASY)
        return 2 + (this.number - 1) * .04;

      if (this.game.difficulty === this.game.DIFFICULTY_NORMAL)
        return 2 + (this.number - 1) * .06;

      if (this.game.difficulty === this.game.DIFFICULTY_HARD)
        return 2 + (this.number - 1) * .1;

      if (this.game.difficulty === this.game.DIFFICULTY_INSANE)
        return 3 + (this.number - 1) * .1;

      return 2;
    }
  };

  exports.Level = Level;

})(this);
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
      context.strokeStyle = 'rgba(' + this.game.settings.POWERUP_BASE_COLOR + ',' + sizeRatio + ')';
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
;(function(exports){

  var RadialBlastPowerup = function(game, settings){
    this.game = game;
    this.pos = {
      x: settings.pos.x,
      y: settings.pos.y
    };
    this.vel = {
      x: settings.vel.x,
      y: settings.vel.y
    };
    this.boundingBox = this.game.coquette.collider.CIRCLE;
    this.game.soundBus.powerupHumSound.play();

    this.fadeTicks = this.fadeAmount = 60;
    this.growing = true;
  };

  RadialBlastPowerup.prototype = {

    size: {x:40,y:40},
    halfSize: {x:20,y:20},

    update: function(){
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      if (this.fadeTicks === this.fadeAmount){
        this.growing = false;
      } else if (this.fadeTicks === 30){
        this.growing = true;
      }

      this.fadeTicks += this.growing ? 1 : -1;

      if (this.pos.x < -this.size.x || 
        this.pos.x > (this.game.width + this.size.x) || 
        this.pos.y < -this.size.y || 
        this.pos.y > (this.game.height + this.size.y)){

        this.game.soundBus.powerupHumSound.stop();
        this.game.coquette.entities.destroy(this);

      }

    },

    draw: function(context){

      context.beginPath();
      context.arc(this.pos.x + this.halfSize.x, this.pos.y + this.halfSize.y, this.halfSize.x, 0, Math.PI * 2, true);
      context.lineWidth = 3;
      var ratio = (this.fadeTicks / this.fadeAmount).toString();
      context.strokeStyle = 'rgba(' + this.game.settings.POWERUP_BASE_COLOR + ',' + ratio + ')';
      context.stroke();
      context.closePath();

    },

    collision: function(other, type){

      if (other instanceof Bullet && !other.hostile){
        this.game.coquette.entities.destroy(this);
        this.game.coquette.entities.destroy(other);
        this.game.soundBus.powerupHumSound.stop();
        this.game.radialBlastAcquired(this);
      }
    }

  };

  exports.RadialBlastPowerup = RadialBlastPowerup;


})(this);
;(function(exports){

  var PauseView = function(game, settings){
    this.game = game;
  };

  PauseView.prototype = {

    zindex: 1000,
    pos: {x:-200,y:-300},
    size: {x:1,y:1},

    show: false,

    update: function(){

    },

    draw: function(context){

      if (!this.show) return;
      var x = this.game.width / 2;

      context.fillStyle = 'rgba(10,10,10,.8)';
      context.fillRect(0,0,this.game.width, this.game.height);

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = '#ccc';
      context.fillText('PAUSED', x, 100);

      context.font = "12px 'Press Start 2P'";

      context.fillText('Q - Quit', x, 150);
      context.fillText('ESC - Return to Game', x, 180);


    }

  };

  exports.PauseView = PauseView;

})(this);
;(function(exports){

  var MessageView = function(game){
    this.game = game;
  };

  MessageView.prototype = {

    show: false,
    zindex: 1000,
    text: '',
    text2: '',
    text3: '',
    text4: '',

    draw: function(context){

      if (!this.show) return;

      var firstFontSize = this.text2.length > 0 ? '16px' : '12px';

      context.font = firstFontSize + " 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText(this.text, this.game.width/2, this.game.height/2 - 30);

      context.font = "12px 'Press Start 2P'";
      context.fillText(this.text2, this.game.width/2, this.game.height/2 + 45);
      context.fillText(this.text3, this.game.width/2, this.game.height/2 + 75);
      context.fillText(this.text4, this.game.width/2, this.game.height/2 + 105);

    }

  };

  exports.MessageView = MessageView;

})(this);
;(function(exports){

  var ReadyView = function(game, settings){
    this.game = game;
    this.ratio = 1.0;
    this.down = true;
  };

  ReadyView.prototype = {

    zindex: 1000,    
    size: {x:1, y:1},
    pos: {x: -182, y: -992},

    update: function(){

      if (this.down){
        this.ratio -= .02;
      } else {
        this.ratio += .02;
      }

      if (this.ratio >= 1.0){
        this.down = true;
      } else if (this.ratio <= 0.5){
        this.down = false;
      }

      this.handleKeyboard();
    },

    handleKeyboard: function(){

      if (this.callback === undefined || this.callback === null) return;

      var inputter = this.game.coquette.inputter;
      if (inputter.state(inputter.SPACE)){
        this.callback();
      }
    },

    playerReady: function(callback){
      this.callback = callback;
    },

    draw: function(context){

      var baseHeight = 100;

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('CONTROLS', this.game.width/2, baseHeight);

      var left = 150;

      context.font = "12px 'Press Start 2P'";
      context.textAlign = 'left';

      context.fillText('Press LEFT, RIGHT, and UP arrows to move.', left, baseHeight + 50);
      context.fillText('Press SPACE to shoot. ESC to pause.', left, baseHeight + 90);

      context.fillText('Shoot these:', left, baseHeight + 170);

      var x = 370;
      var y = baseHeight + 160;
      context.beginPath();
      context.arc(x, y, 20, 0, Math.PI * 2, true);
      context.lineWidth = 3;
      context.strokeStyle = this.game.settings.POWERUP_COLOR;
      context.stroke();
      context.closePath();

      context.fillText('and deploy them with DOWN arrow.', left, baseHeight + 210);

      context.fillStyle = 'rgba(' + this.game.settings.FOREGROUND_BASE_COLOR + ', ' + this.ratio.toString() + ')';
      context.fillText('Press SPACE to play.', left, baseHeight + 290);


    }

  };

  exports.ReadyView = ReadyView;

})(this);
;(function(exports){

  var DifficultyView = function(game, settings){
    this.game = game;
  };

  DifficultyView.prototype = {

    zindex: 1000,    
    size: {x:1, y:1},
    pos: {x: -682, y: -792},

    update: function(){
      this.handleKeyboard();
    },

    handleKeyboard: function(){

      if (this.callback === undefined || this.callback === null) return;    
      var inputter = this.game.coquette.inputter;
      var result = -1;
      if (inputter.state(inputter.ONE)) result = this.game.DIFFICULTY_FREE;
      if (inputter.state(inputter.TWO)) result = this.game.DIFFICULTY_EASY;
      if (inputter.state(inputter.THREE)) result = this.game.DIFFICULTY_NORMAL;
      if (inputter.state(inputter.FOUR)) result = this.game.DIFFICULTY_HARD;
      if (inputter.state(inputter.FIVE)) result = this.game.DIFFICULTY_INSANE;

      if (result === -1) return;
      this.callback(result);
    },

    difficultySelected: function(callback){
      this.callback = callback;
    },

    draw: function(context){

      var x = this.game.width / 2;

      context.font = "16px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;
      context.fillText('CHOOSE DIFFICULTY', x, 100);

      context.font = "12px 'Press Start 2P'";
      context.fillText('Press a number key:', x, 150);

      context.fillText('1 - free flying', x, 200);
      context.fillText('2 - easy', x, 230);
      context.fillText('3 - normal', x, 260);
      context.fillText('4 - hard', x, 290);
      context.fillText('5 - insane', x, 320);

    }

  };

  exports.DifficultyView = DifficultyView;

})(this);
;(function(exports){

  var TitleView = function(game){
    this.game = game;    
    this.storyOffset = this.game.height + this.storyLineHeight;
  };

  TitleView.prototype = {

    mode: 0,
    MODE_TITLE: 0,
    MODE_STORY: 1,
    storyLineHeight: 25,
    storyLeftMargin: 60,
    storyOffset: 500,
    scrollSpeed: .4,
    scrollOffset: 0,
    scrolling: false,
    timeoutId: 0,

    play: function(){
      clearTimeout(this.timeoutId);
      var self = this;
      this.scrolling = false;
      this.scrollOffset = 0;
      this.timeoutId = setTimeout(function(){
        self.startScrolling();
      }, 4000);
    },

    stop: function(){
      clearTimeout(this.timeoutId);
    },

    startScrolling: function(){
      var self = this;
      this.scrolling = true;
      this.timeoutId = setTimeout(function(){
        self.stopScrolling();
      }, 16000);
    },

    stopScrolling: function(){
      this.scrolling = false;
      var self = this;
      this.timeoutId = setTimeout(function(){
        self.resetTitle();
      }, 5000);
    },

    resetTitle: function(){
      this.scrollOffset = 0;
      var self = this;
      this.timeoutId = setTimeout(function(){
        self.startScrolling();
      }, 5000);
    },

    draw: function(context){
      context.fillStyle = this.game.settings.FOREGROUND_COLOR;

      context.font = "40px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillText("Orbital Janitor", this.game.width/2, this.game.height/2 + this.scrollOffset);

      context.font = "12px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillText("Press SPACE to start", this.game.width/2, this.game.height/2 + 50 + this.scrollOffset);

      context.font = "14px 'Press Start 2P'";
      context.textAlign = "left"

      context.fillText("After centuries of abuse and neglect, space has", 
        this.storyLeftMargin, this.storyOffset + this.scrollOffset);
      context.fillText("become littered with debris from failed space",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight + this.scrollOffset);
      context.fillText("missions, canisters of unwanted, spent nuclear",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 2 + this.scrollOffset);
      context.fillText("fuel, and rains of small planetary bodies that ",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 3 + this.scrollOffset);
      context.fillText("threaten Earth. There is one brave hero who is up ",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 4 + this.scrollOffset);
      context.fillText("to the challenge of clearing this debris and",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 5 + this.scrollOffset);
      context.fillText("cleaning the realm of space:",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 6 + this.scrollOffset);

      context.font = "24px 'Press Start 2P'";
      context.textAlign = "center"

      context.fillText("The Orbital Janitor",
        this.game.width / 2, this.storyOffset + this.storyLineHeight * 9 + this.scrollOffset);

      var halfSize = {
        x: this.game.settings.PLAYER_SIZE / 2,
        y: this.game.settings.PLAYER_SIZE / 2
      };


      var x = this.game.width / 2;
      var y = this.storyOffset + this.storyLineHeight * 11 + this.scrollOffset;
      context.beginPath();
      context.moveTo(-halfSize.x + x,halfSize.y + y);
      context.lineTo(x,-halfSize.y + y);
      context.lineTo(halfSize.x + x, halfSize.y + y);
      context.lineTo(x,halfSize.y/1.7 + y);
      context.lineTo(-halfSize.x + x,halfSize.y + y);
      context.closePath();
      context.strokeStyle = this.game.settings.FOREGROUND_COLOR;
      context.lineWidth = this.game.settings.PLAYER_LINE_WIDTH;
      context.stroke();

      if (this.scrolling){
       this.scrollOffset -= this.scrollSpeed;
      }

    }

  };

  exports.TitleView = TitleView;

})(this);
;(function(exports){

  var ScoringRules = function(game){
    this.game = game;

    if (game.difficulty === game.DIFFICULTY_FREE) this.multiplier = 0;
    if (game.difficulty === game.DIFFICULTY_EASY) this.multiplier = 0.1;
    if (game.difficulty === game.DIFFICULTY_NORMAL) this.multiplier = 1;
    if (game.difficulty === game.DIFFICULTY_HARD) this.multiplier = 1.5;
    if (game.difficulty === game.DIFFICULTY_INSANE) this.multiplier = 2;

  };

  ScoringRules.prototype = {

    multiplier: 1.0,

    pointsForAsteroid: function(asteroid){
      if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_LARGE) {
        return 250 * this.multiplier;
      } else if (asteroid.size.x === this.game.settings.ASTEROID_SIZE_MEDIUM){
        return 500 * this.multiplier;
      } else {
        return 1000 * this.multiplier;
      }
    },

    pointsForLevel: function(level){
      var base = 500 * level.number;
      if (level.shots === 0) return base * this.multiplier;
      var percent = level.asteroidsShot / level.shots;
      return Math.floor((base + percent * 1000) * this.multiplier);
    },

    pointsForCrash: function(){
      return 1000 * this.multiplier;
    },

    pointsForUfo: function(ufo){
      return 2000 * this.multiplier;
    },
  };

  exports.ScoringRules = ScoringRules;

})(this);
; (function (exports, $) {

  //postUrl = 'http://localhost:61740/api/Game';
  postUrl = 'http://orbital-janitor-api.azurewebsites.net/api/Game';

  var ScorePoster = function () {
  };

  ScorePoster.prototype = {

    postScore: function(game, callback){

      var dto = this.getDto(game);
      var dtoString = JSON.stringify(dto);

      $.ajax({
        url: postUrl,
        contentType: 'text/json',
        data: dtoString,
        type: 'POST'
      })
      .done(function(result) { callback(result); })
      .fail(function(result) { callback({ Success: false, Message: 'Error posting score.'}); });
    },

    getDto: function(game){
      var gameDto = {
        start: game.start,
        end: game.end,
        player: game.playerName,
        cheating: game.cheating,
        difficulty: game.difficulty,
        score: game.score
      };

      gameDto.levels = [];

      for (var i = 0; i < game.levels.length; i++){
        var level = game.levels[i];
        gameDto.levels.push({
          number: level.number,
          start: level.start,
          end: level.end,
          score: level.score,
          shotsFired: level.shots,
          radialBlastsCaptured: level.radialBlastsCaptured,
          radialBlastsDeployed: level.radialBlastsDeployed,
          asteroidsKilledByBullet: level.asteroidsKilledByBullet,
          asteroidsKilledByRadialBlast: level.asteroidsKilledByRadialBlast,
          asteroidsKilledByPlayerCollision: level.asteroidsKilledByPlayerCollision,
          ufosKilledByBullet: level.ufosKilledByBullet,
          ufosKilledByPlayerCollision: level.ufosKilledByPlayerCollision,
          ufosKilledByRadialBlast: level.ufosKilledByRadialBlast,
          deathsByAsteroidCollision: level.deathsByAsteroidCollision,
          deathsByUfoCollision: level.deathsByUfoCollision,
          deathsByUfoBullet: level.deathsByUfoBullet
        });

      }

      return gameDto;



    }

  };

    exports.ScorePoster = ScorePoster;
})(this, jQuery);
;(function(exports, $){

  var leaderboardUrl = 'http://orbital-janitor-api.azurewebsites.net/api/game/getTopGamesEver';

  var mapDifficulty = function(diff){

    if (diff === 0) return 'FREE';
    else if (diff === 1) return 'EASY';
    else if (diff === 2) return 'NORMAL';
    else if (diff === 3) return 'HARD';
    else if (diff === 4) return 'INSANE';

  };

  var Game = function(gameDto){
    this.rank = gameDto.rank;
    this.playerName = gameDto.Player;
    this.score = gameDto.Score;
    this.difficulty = mapDifficulty(gameDto.Difficulty);
    this.level = gameDto.LevelReached;
    this.kills = gameDto.AsteroidsKilled +
      gameDto.UfosKilled;
  };

  var LeaderboardViewModel = function(){
    this.games = ko.observableArray([]);
    this.load();
  };

  LeaderboardViewModel.prototype = {

    load: function(){
      var self = this;
      $.ajax({
        url: leaderboardUrl
      })
      .done(function(result){
        for (var i = 0; i < result.length; i++){
          var dto = new Game(result[i]);
          dto.rank = i + 1;
          self.games.push(dto);
        }
        $('#wait').hide();
      })
      .fail(function(){
        console.log('leaderboard data fail');
      });
    }

  };

  exports.LeaderboardViewModel = LeaderboardViewModel;

})(this, jQuery);
;(function(exports) {

  var Game = function(canvasId, width, height) {
    var self = this;

    this.settings = new Settings();

    this.coquette = new Coquette(this, canvasId, width, height, this.settings.BACKGROUND_COLOR);
    this.maths = new Maths();
    this.width = width;
    this.height = height;
    this.spriteFactory = new SpriteFactory(this);

    this.coquette.entities.create(GameBar,{},
      function(bar){
        self.gameBar = bar;
      });

    this.coquette.entities.create(PauseView,{},
      function(view){
        self.pauseView = view;
      });


    this.messageView = new MessageView(this);
    this.titleView = new TitleView(this);
    this.scoringRules = new ScoringRules(this);
    this.ufoTicksLeft = this.ufoTicks;
    this.oneUpPlateau = this.oneUpPlateauStep;
    this.version = new Version();
    this.levels = [];

    this.coquette.inputter.supressedKeys.push(
      this.coquette.inputter.BACKSPACE);
  };

  Game.prototype = {

    state: 0,
    STATE_TITLE: 0,
    STATE_CHOOSE_DIFFICULTY: 1,
    STATE_SHOW_CONTROLS: 2,
    STATE_PLAYING: 3,
    STATE_BETWEEN_LEVELS: 4,
    STATE_GAME_OVER: 5,

    DIFFICULTY_FREE: 0,
    DIFFICULTY_EASY: 1,
    DIFFICULTY_NORMAL: 2,
    DIFFICULTY_HARD: 3,
    DIFFICULTY_INSANE: 4,

    oldRadialBlasts: 0,
    difficulty: 2,
    pausing: false,
    paused: false,
    score: 0,
    lives: 0,
    gameBar: null,
    explosions: [],
    level: null,
    player: null,
    width: 0,
    height: 0,
    showBoundingBoxes: false,
    soundsPath: 'sounds/',
    ufoTicks: 1400,
    oneUpPlateauStep: 250000,

    init: function() {
      this.coquette.inputter.supressedKeys
      this.soundBus = new SoundBus(this.soundsPath);
      this.state = this.STATE_TITLE;
      this.titleView.play();
    },

    clearEntities: function(){
      // wipe out all entities
      var entities = this.coquette.entities.all();      
      for(var i = entities.length - 1; i >= 0; i--){
        if (entities[i] instanceof GameBar === false && entities[i] instanceof PauseView === false) {
          this.coquette.entities.destroy(entities[i]);
        }
      }
    },

    chooseDifficulty: function(){
      var self = this;
      this.messageView.show = false;
      this.state = this.STATE_CHOOSE_DIFFICULTY;
      this.coquette.entities.create(DifficultyView, {},
        function(view){
          view.difficultySelected(function(difficultyValue){
            self.difficulty = difficultyValue;
            self.coquette.entities.destroy(view);
            self.startNewGame();
          });
        });
    },

    startNewGame: function(){
      var self = this;

      this.start = new Date();
      this.oldRadialBlasts = 0;
      this.clearEntities();
      this.levels = [];
      this.state = this.STATE_READY;
      this.scoringRules = new ScoringRules(this);
      this.oneUpPlateau = this.oneUpPlateauStep;
      this.score = 0;
      this.lives = 3;
      this.level = null;
      this.titleView.stop();

      this.coquette.entities.create(ReadyView, {}, 
        function(view){
          view.playerReady(function(){
            self.coquette.entities.destroy(view);
            self.messageView.show = false;
            self.messageView.text = self.messageView.text2 = self.messageView.text3 = self.messageView.text4 = '';

            // delay spawning the player so that the user's space bar doesn't
            // trigger a shot. just annoying to me.
            setTimeout(function(){
              self.spawnPlayer();
              self.initNextLevel();
            }, 500);
          });
        });

    },

    initNextLevel: function(){

      this.ufoTicks = this.maths.getRandomInt(1000, 1500);
      this.ufoTicksLeft = this.ufoTicks;
      this.state = this.STATE_PLAYING;
      var number = this.level === null ? 1 : this.level.number + 1;
      this.level = new Level(this, number, this.difficulty);
      this.levels.push(this.level);
      if (this.gameBar != null) {
        this.gameBar.levelNumber = number;
      }

      this.messageView.show = false;

      var self = this;
      self.level.deployAsteroid();
      for (var i = 1; i < this.level.asteroidCount; i++){
        setTimeout(function(){
          self.level.deployAsteroid();
        }, i * 1000);
      }


    },

    update: function(){
      this.handleKeyboard();

      if (this.paused) return;

      for (var i = 0; i < this.explosions.length; i++){
        this.explosions[i].update();
      }

      for (var i = this.explosions.length - 1; i >= 0; i--){
        if (this.explosions[i].complete){
          this.explosions.splice(i, 1);
        }
      }

      if (this.state == this.STATE_PLAYING){
        this.level.update();
        if (this.level.complete){
          this.state = this.STATE_BETWEEN_LEVELS;
          var levelBonus = this.scoringRules.pointsForLevel(this.level);
          this.appendScore(levelBonus);
          this.messageView.text = 'Level ' + this.level.number.toString() + ' complete. Bonus: ' + levelBonus.toString() + '. Loading next level...';
          this.messageView.show = true;
          var self = this;

          setTimeout(function(){

            self.initNextLevel();

          }, 3000);

        } else {
          this.checkUfo();
        }
      }
    },

    checkUfo: function(){
      this.ufoTicksLeft--;
      if (!this.level.ufoDeployed && this.ufoTicksLeft === 0){
        this.level.ufoDeployed = true;
        this.spawnUfo();
      }
    },

    spawnUfo: function(){
      this.level.spawnUfo();
    },

    draw: function(context){

      for (var i = 0; i < this.explosions.length; i++){
        this.explosions[i].draw(context);
      }

      if (this.showBoundingBoxes){
        var entities = this.coquette.entities.all();
        for(var i = 0; i < entities.length; i++){
          var entity = entities[i];

          context.beginPath();
          if (entity.boundingBox == this.coquette.collider.RECTANGLE){
            context.rect(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y);
          }
          else{
            context.arc(entity.pos.x + entity.size.x/2, entity.pos.y + entity.size.y/2,
              entity.size.x/2, 0, Math.PI * 2, false);
           }

          context.lineWidth = entity.colliding ? 3 : 2;
          context.strokeStyle = entity.colliding ? '#00ff00' : '#FF006E';
          context.stroke();

        }
      }

      if (this.state === this.STATE_TITLE){
        this.titleView.draw(context);
      } else {
        this.messageView.draw(context);
      }

      context.fillStyle = this.settings.MUTED_COLOR;
      context.font = "8px 'Press Start 2P'";
      context.textAlign = "left"
      context.fillText("v" + this.version.number, 5, this.height - 5);


    },

    handleKeyboard: function(){

      this.checkPause();

      var inputter = this.coquette.inputter;

      if (this.paused && inputter.state(inputter.Q)){
        // quit!
        this.clearEntities();
        var paused = true;
        this.endGame(paused);
        return;
      }

      if (this.paused) return;

      if (this.state === this.STATE_TITLE){
        if(inputter.state(inputter.SPACE)) {
          this.chooseDifficulty();
        }
      }

    },

    checkPause: function(){
      var esc = this.coquette.inputter.state(this.coquette.inputter.ESC);

      if (this.state === this.STATE_PLAYING && esc){
        if (!this.pausing){
          this.pausing = true;
        } 
      } else if (this.state === this.STATE_PLAYING && !esc){
        if (this.pausing){
          
          this.paused = !this.paused;
          this.pausing = false;
          if (this.paused){

            this.previousText = this.messageView.text;
            this.previousShow = this.messageView.show;
            
            this.messageView.show = false;
            this.pauseView.show = true;
            this.soundBus.pauseSound.play();
          }
          else{
            this.pauseView.show = false;
            this.messageView.text = this.previousText;
            this.messageView.show = this.previousShow;
            this.soundBus.pauseSound.play();
          }

        }
      }
    },

    spawnPlayer: function(){
      var self = this;
      self.coquette.entities.create(Player, {
        pos: { 
          x: self.width / 2, 
          y: self.height / 2 
        },
        maxPos: { 
          x: self.width, 
          y: self.height 
        },
        radialBlasts: this.oldRadialBlasts
      }, function(player) {
        self.player = player;
      });

    },

    spawnAsteroidExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 20,
        duration: 50,
        particleSize: 3,
        pos: pos
      });

      this.explosions.push(effect);
    },

    spawnPlayerExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 75,
        particleSize: 8,
        pos: pos
      });

      this.explosions.push(effect);
    },

    spawnUfoExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 75,
        particleSize: 8,
        pos: pos
      });

      this.explosions.push(effect);
    },

    spawnPowerupExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 75,
        particleSize: 8,
        baseColor: this.settings.POWERUP_BASE_COLOR,
        pos: pos
      });

      this.explosions.push(effect);
    },

    asteroidKilled: function(asteroid, other){

      if (other instanceof Bullet) this.level.asteroidsKilledByBullet++;
      if (other instanceof RadialBlast) this.level.asteroidsKilledByRadialBlast++;
      if (other instanceof Player) this.level.asteroidsKilledByPlayerCollision++;

      this.soundBus.asteroidExplosionSound.play();

      // split up asteroid into two smaller ones
      var newPos = {x: asteroid.pos.x + asteroid.size.x / 4, y: asteroid.pos.y + asteroid.size.y/4};
      if (asteroid.size.x === this.settings.ASTEROID_SIZE_LARGE){
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, newPos);
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, newPos);
      } else if (asteroid.size.x === this.settings.ASTEROID_SIZE_MEDIUM){
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, newPos);
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, newPos);
      } 
      this.level.asteroidsShot++;
      this.appendScore(this.scoringRules.pointsForAsteroid(asteroid));
      this.spawnAsteroidExplosion(asteroid.pos);
    },

    shotFired: function(){
      this.level.shots++;
    },

    thrusting: function(){
      this.level.thrustTicks++;
    },

    playerKilled: function(player, other){
      this.lives--;
      this.soundBus.playerExplosionSound.play();
      this.spawnPlayerExplosion(player.pos);
      this.oldRadialBlasts = player.radialBlasts;

      if (other instanceof Bullet) this.level.deathsByUfoBullet++;
      if (other instanceof Ufo) this.level.deathsByUfoCollision++;
      if (other instanceof Asteroid) this.level.deathsByAsteroidCollision++;

      var self = this;

      if (this.lives > 0){
        setTimeout(function(){
          self.trySpawnPlayer();
        }, 2000);
      } else {
        this.endGame();
      }
    },

    ufoKilled: function(ufo, other){
      this.soundBus.playerExplosionSound.play();
      this.spawnUfoExplosion(ufo.pos);
      this.appendScore(this.scoringRules.pointsForUfo(ufo));

      if (other instanceof Bullet) this.level.ufosKilledByBullet++;
      if (other instanceof Player) this.level.ufosKilledByPlayerCollision++;
      if (other instanceof RadialBlast) this.level.ufosKilledByRadialBlast++;
    },

    trySpawnPlayer: function(){

      var desiredPosition = {
        x: this.width / 2,
        y: this.height / 2
      };

      var asteroids = this.coquette.entities.all(Asteroid);
      var spaceAvailable = true;

      for (var i = 0; i < asteroids.length; i++){

        if (this.maths.distance(desiredPosition, asteroids[i].pos) < this.settings.PLAYER_SIZE * 4){
          spaceAvailable = false;
          break;
        }
      }

      if (!spaceAvailable){
        this.messageView.text = "Waiting for some open space...";
        this.messageView.show = true;
        var self = this;
        setTimeout(function(){
          self.trySpawnPlayer();
        }, 200)
      } else{
        this.messageView.show = false;
        this.spawnPlayer();
      }

    },

    endGame: function(wasPaused){      

      this.end = new Date();
      this.level.end = new Date();
      this.playerName = 'DEV';
      this.soundBus.ufoSound.stop();

      var self = this;
      var theThing = this;
      this.paused = false;
      this.pauseView.show = false;      


      if (wasPaused != undefined && wasPaused){
        self.state = self.STATE_TITLE;
        self.oldRadialBlasts = 0;
        self.player.radialBlasts = 0;
        self.titleView.play();
        return;
      }

      this.state = self.STATE_GAME_OVER;

      setTimeout(function(){

        self.clearEntities();

        $('#error-panel').hide();
        $('#submit-button').removeAttr('disabled');
        $('#no-thanks-button').removeAttr('disabled');
        $('#input-player-name').removeAttr('disabled');
        $('#submit-button').html('Submit');
        $('#input-player-name').val('');

        $('#score-value').html(self.score);
        $('#post-score').bPopup({
          escClose: false,
          modalClose: false
        });

        $('#input-player-name').focus();

        $('#submit-button').click(function(){
          $('#submit-button').off('click');
          self.sendScore();
        });

        $('#no-thanks-button').click(function(){
          $('#no-thanks-button').off('click');
          $('#post-score').bPopup().close();
          self.goBackToTitle();
        });

      }, 2000);

    },

    goBackToTitle: function(){
      this.state = this.STATE_TITLE;
      this.oldRadialBlasts = 0;
      this.player.radialBlasts = 0;
      this.titleView.play();
    },

    sendScore: function(){
      var name = $('#input-player-name').val();
      if (name === undefined || name.trim().length === 0){
        this.goBackToTitle();
        return;
      }

      $('#submit-button').html('Submitting...');
      $('#submit-button').attr('disabled', 'disabled');
      $('#no-thanks-button').attr('disabled', 'disabled');
      $('#input-player-name').attr('disabled', 'disabled');

      this.playerName = name;

      var self = this;
      var poster = new ScorePoster();
      poster.postScore(this, function(result){
        
        if (result.Success != true){
          $('#error-panel').show();
          $('#error-close-button').click(function(){
            $('#error-close-button').off('click');
            $('#post-score').bPopup().close();
            self.goBackToTitle();
          });
        }
        else {
          $('#post-score').bPopup().close();
          self.goBackToTitle();
        }
      });

    },

    appendScore: function(more){
      this.score += more;
      this.level.score += more;

      if (this.score >= this.oneUpPlateau){
        this.oneUpPlateau += this.oneUpPlateauStep;
        this.lives++;
        this.soundBus.oneUpSound.play();
      }
    },

    radialBlastAcquired: function(powerup){
      this.player.radialBlasts++;
      this.level.radialBlastsCaptured++;
      this.spawnPowerupExplosion(powerup.pos);
      this.soundBus.playerExplosionSound.play();
    },

    radialBlastDeployed: function(powerup){
      this.level.radialBlastsDeployed++;
    }

  };

  exports.Game = Game;

})(this);
