;(function(exports){

  var Settings = function() { };

  Settings.prototype = {

    PLAYER_ROTATE_DELTA:  5,
    PLAYER_THRUST_DELTA:  0.04,
    PLAYER_SIZE:          30,
    PLAYER_LINE_WIDTH:    2, 
    BULLET_VELOCITY:      5.0,
    BULLET_DELAY_TICKS:   35, 
    BULLET_SIZE_X:        4,
    BULLET_SIZE_Y:        4,
    THRUST_EFFECT_TICKS:  8,
    THRUST_EFFECT_VEL:    1.0, 
    ASTEROID_LINE_WIDTH:  2,
    ASTEROID_SIZE_LARGE:  100,
    ASTEROID_SIZE_MEDIUM: 50, 
    ASTEROID_SIZE_SMALL:  25
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
        context.fillStyle = '#ccc';
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
    
  };

  Bullet.prototype = {

    size: { x:2, y:2 },
    halfSize: { x:1, y:1 },

    update: function() {
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
      if (other instanceof Asteroid){
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
        soundsPath + 'explosion01.mp3', 
        soundsPath + 'explosion01.ogg'
      ],
      volume: 0.5
    });    

    this.playerExplosionSound = new Howl({
      urls: [
        soundsPath + 'explosion02.mp3', 
        soundsPath + 'explosion02.ogg'
      ],
      volume: 0.9
    });  

    this.thrustSound = new Howl({
      urls: [
        soundsPath + 'thrust.mp3', 
        soundsPath + 'thrust.ogg'],
      volume: .5,
      loop: true
    });

    this.gunSound = new Howl({
      urls: [
        soundsPath + 'gun.mp3', 
        soundsPath + 'gun.ogg'],
      volume: 0.5
    });    

  };

  SoundBus.prototype = {

  };

  exports.SoundBus = SoundBus;
})(this);
;(function(exports){

  var ThrustBubble = function(pos, direction){
    this.pos = {
      x: pos.x,
      y: pos.y
    };
    this.vel = {
      x: direction.x,
      y: direction.y
    };
  };

  ThrustBubble.prototype = {

    radius: 1,
    radiusGrowth: .2,
    ticksLeft: 30,
    totalTicks: 30,
    pos: null,
    colorBase: '204,204,204',

    update: function(){
      this.radius += this.radiusGrowth;
      this.ticksLeft--;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    },

    draw: function(context){

      var side = this.radius * 2;
      context.beginPath();
      context.rect(this.pos.x - this.radius, this.pos.y - this.radius,
        side, side);
      context.closePath();
      context.lineWidth = 1;
      var ratio = this.ticksLeft / this.totalTicks;
      context.strokeStyle = 'rgba(' + this.colorBase + ',' + ratio.toString() + ')';
      context.stroke();
    }
  };

  var ThrustEffect = function(game){
    this.effects = [];
    this.game = game;
  };

  ThrustEffect.prototype = {

    thrustEffectTicksLeft: 0,

    add: function(pos, direction){
      var bubble = new ThrustBubble(pos, direction);
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
          context.fillStyle = 'rgba(200,200,200,' + ratio + ')';
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
        if (other instanceof Bullet || other instanceof Player){
          this.game.coquette.entities.destroy(this);
          this.game.asteroidKilled(this);
        }
      }
    }

  };

  exports.Asteroid = Asteroid;

})(this);
;(function(exports){

  var Bullet = exports.Bullet;

  function Player(game, settings){

    var self = this;
    this.pos = { x: settings.pos.x, y: settings.pos.y };
    this.maxPos = { x: settings.maxPos.x, y: settings.maxPos.y };
    this.game = game;

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

      context.beginPath();
      context.moveTo(-this.halfSize.x,-this.halfSize.y);
      context.lineTo(0,this.halfSize.y);
      context.lineTo(this.halfSize.x, -this.halfSize.y);
      context.lineTo(0,-this.halfSize.y/1.7);
      context.lineTo(-this.halfSize.x,-this.halfSize.y);
      context.closePath();
      context.strokeStyle = '#ccc';
      context.lineWidth = this.game.settings.PLAYER_LINE_WIDTH;
      context.stroke();

      context.rotate(-this.Angle);
      context.translate(-(this.pos.x), -(this.pos.y));
      context.restore();

      this.thrustEffect.draw(context);
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

        this.shotTicksLeft = this.game.settings.BULLET_DELAY_TICKS;
      }
    },

    collision: function(other, type){
      this.colliding = true;
      if (type === this.game.coquette.collider.INITIAL){
        if (other instanceof Asteroid){
          this.game.coquette.entities.destroy(this);
          this.game.soundBus.thrustSound.stop();
          this.game.playerKilled(this);
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
      x: 0,
      y: 0
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

      context.font = "10px 'Press Start 2P'";
      context.fillStyle = '#ccc';
      context.fillText('Level: ' + this.levelNumber.toString(), 10, 20);

    }
  };

  exports.GameBar = GameBar;

})(this);
;(function(exports){

  var Level = function(game, number, asteroidCount){
    this.game = game;
    this.number = number;
    this.asteroidCount = asteroidCount;
    this.complete = false;
  };

  Level.prototype = {

    update: function(){
      if (!this.complete) {
        this.complete = this.game.coquette.entities.all(Asteroid).length === 0;
      }
    }

  };

  exports.Level = Level;

})(this);
;(function(exports) {

  var Game = function(canvasId, width, height) {
    var self = this;

    this.coquette = new Coquette(this, canvasId, width, height, "#000");
    this.maths = new Maths();
    this.width = width;
    this.height = height;
    this.settings = new Settings();
    this.spriteFactory = new SpriteFactory(this);

    this.coquette.entities.create(GameBar,{},
      function(bar){
        self.gameBar = bar;
      });
  };

  Game.prototype = {

    gameBar: null,
    explosions: [],
    level: null,
    player: null,
    width: 0,
    height: 0,
    showBoundingBoxes: false,
    soundsPath: 'sounds/',
    intermission: false,

    init: function() {
      this.soundBus = new SoundBus(this.soundsPath);
      this.spawnPlayer();
      this.initNextLevel();
    },

    initNextLevel: function(){
      var number = this.level === null ? 1 : this.level.number + 1;
      var asteroidCount = number + 2;
      this.level = new Level(this, number, asteroidCount);
      if (this.gameBar != null) {
        this.gameBar.levelNumber = number;
      }
      this.intermission = false;
      for (var i = 0; i < asteroidCount; i++){
        this.deployAsteroid();
      }
    },

    update: function(){
      this.handleKeyboard();

      for (var i = 0; i < this.explosions.length; i++){
        this.explosions[i].update();
      }

      for (var i = this.explosions.length - 1; i >= 0; i--){
        if (this.explosions[i].complete){
          this.explosions.splice(i, 1);
        }
      }

      if (!this.intermission){
        this.level.update();
        if (this.level.complete){
          this.intermission = true;
          var self = this;
          setTimeout(function(){

            self.initNextLevel();

          }, 3000);
        }
      }
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

    },

    handleKeyboard: function(){

      if(this.coquette.inputter.state(this.coquette.inputter.LEFT_ARROW)
        && this.coquette.inputter.state(this.coquette.inputter.RIGHT_ARROW)) {

        this.showBoundingBoxes = !this.showBoundingBoxes;
      }

    },

    deployAsteroid: function(size, pos){

      var direction = this.maths.plusMinus();
      size = size === undefined ? this.settings.ASTEROID_SIZE_LARGE : size;

      if (pos === undefined){
        pos = {
          x: direction === 1 ? 
            this.maths.getRandomInt(-this.settings.ASTEROID_SIZE_LARGE,200) : 
              this.maths.getRandomInt(this.width - 200,this.width + this.settings.ASTEROID_SIZE_LARGE), 
          y: this.height
        };
      }

      this.coquette.entities.create(Asteroid, {
        pos: pos,
        vel: {
          x: direction === 1 ? this.maths.getRandomInt(0,30) * .01 : 
            this.maths.getRandomInt(-30,0) * .01,
          y: this.maths.getRandomInt(50,200) * .01 * this.maths.plusMinus()
        },
        maxPos:{
          x: this.width,
          y: this.height
        },
        size: {
          x: size,
          y: size
        },
        boundingBox: this.coquette.collider.RECTANGLE
      });
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
        }
      }, function(player) {
        self.player = player;
      });

    },

    spawnAsteroidExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 50,
        particleSize: 3,
        pos: pos
      });

      this.explosions.push(effect);
    },

    spawnPlayerExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 100,
        duration: 75,
        particleSize: 8,
        pos: pos
      });

      this.explosions.push(effect);
    },

    asteroidKilled: function(asteroid){

      this.soundBus.asteroidExplosionSound.play();

      // split up asteroid into two smaller ones
      if (asteroid.size.x === this.settings.ASTEROID_SIZE_LARGE){
        this.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, asteroid.pos);
        this.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, asteroid.pos);
      } else if (asteroid.size.x === this.settings.ASTEROID_SIZE_MEDIUM){
        this.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, asteroid.pos);
        this.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, asteroid.pos);
      } 

      this.spawnAsteroidExplosion(asteroid.pos);
    },

    playerKilled: function(player){
      this.soundBus.playerExplosionSound.play();
      var self = this;
      setTimeout(function(){
        self.spawnPlayer();
      }, 2000);
      this.spawnPlayerExplosion(player.pos);
    }

  };

  exports.Game = Game;

})(this);
