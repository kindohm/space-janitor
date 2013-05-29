;(function(exports){

  var Settings = function() { };

  Settings.prototype = {

    PLAYER_ROTATE_DELTA:  5,
    PLAYER_THRUST_DELTA:  0.03,
    PLAYER_SIZE_X:        20,
    PLAYER_SIZE_Y:        30,
    BULLET_VELOCITY:      5.0,
    BULLET_DELAY_TICKS:   35, 
    BULLET_SIZE_X:        4,
    BULLET_SIZE_Y:        4,
    THRUST_EFFECT_TICKS:  8,
    THRUST_EFFECT_VEL:    1.0, 
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

    getPlayerSprite: function(){

      if (!cache.containsKey(this.getPlayerSprite)){
        var canvas = document.createElement('canvas');
        canvas.width = this.game.settings.PLAYER_SIZE_X;
        canvas.height = this.game.settings.PLAYER_SIZE_Y;
        
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(this.game.settings.PLAYER_SIZE_X/2,this.game.settings.PLAYER_SIZE_Y);
        context.lineTo(this.game.settings.PLAYER_SIZE_X, 0);
        context.lineTo(this.game.settings.PLAYER_SIZE_X/2,7);
        context.lineTo(0, 0);
        context.closePath();
        context.strokeStyle = '#ccc';
        context.lineWidth = 2;
        context.stroke();

        cache.put(this.getPlayerSprite, canvas);
      }
      return cache.get(this.getPlayerSprite);
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
        this.pos.x <= 0 || this.pos.x >= this.game.width){
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

      context.beginPath();
      //context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
      context.rect(this.pos.x - this.radius, this.pos.y - this.radius,
        this.radius * 2, this.radius * 2);
      context.closePath();
      context.lineWidth = 1;

      var ratio = this.ticksLeft / this.totalTicks;
      context.strokeStyle = 'rgba(' + this.colorBase + ',' + ratio.toString() + ')';
      context.stroke();
    }
  };

  var ThrustEffect = function(){
    this.effects = [];
  };

  ThrustEffect.prototype = {

    add: function(pos, direction){
      var bubble = new ThrustBubble(pos, direction);
      this.effects.push(bubble);
    },

    update: function(){

      // remove old effects
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

  var Bullet = exports.Bullet;
  var ThrustEffect = exports.ThrustEffect;
  
  function Player(game, settings){

    var self = this;
    this.pos = { x: settings.pos.x, y: settings.pos.y };
    this.maxPos = { x: settings.maxPos.x, y: settings.maxPos.y };
    this.game = game;

    this.size = { 
      x: game.settings.PLAYER_SIZE_X,
      y: game.settings.PLAYER_SIZE_Y 
    };

    this.halfSize = {
      x: this.size.x / 2,
      y: this.size.y / 2
    };

    this.sprite = game.spriteFactory.getPlayerSprite();
    this.bulletTicksLeft = game.settings.BULLET_DELAY_TICKS;
    this.thrustEffectTicksLeft = game.settings.THRUST_EFFECT_TICKS;
    this.thrustEffect = new ThrustEffect();
  }

  Player.prototype = {

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
    thrustEffectTicksLeft: 0,

    update: function (){

      this.handleKeyboard();

      this.vel.x += this.thrust.x;
      this.vel.y += this.thrust.y;

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

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

      this.shotTicksLeft = Math.max(0, this.shotTicksLeft - 1);

      this.thrustEffectTicksLeft = Math.max(0, this.thrustEffectTicksLeft - 1);
      if (this.thrustEffectTicksLeft === 0 && this.thrusting){
        var vector = this.game.maths.angleToVector(this.angle + 180);
        var effectPos = {
          x: this.pos.x + vector.x * this.halfSize.x,
          y: this.pos.y + vector.y * this.halfSize.y
        };
        var vel = {
          x: vector.x * this.game.settings.THRUST_EFFECT_VEL,
          y: vector.y * this.game.settings.THRUST_EFFECT_VEL
        };
        this.thrustEffect.add(effectPos, vel);
        this.thrustEffectTicksLeft = this.game.settings.THRUST_EFFECT_TICKS;
      }

      this.thrustEffect.update();


    },

    draw: function(context){

      context.save();
      context.translate(this.pos.x, this.pos.y);
      context.rotate(this.rAngle);

      context.drawImage(this.sprite, -this.halfSize.x, -this.halfSize.y,
        this.size.x, this.size.y);

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
      this.thrusting = true;
    },

    idleThrust: function (){
      this.thrust.x = this.thrust.y = this.thrustScale = 0;
      this.thrusting = false;
    },

    shoot: function(){

      if (this.shotTicksLeft === 0){

        // get ship's direction vector
        var vector = this.game.maths.angleToVector(this.angle);

        // calculate bullet origin position relative to ship's center
        var bulletPos = {
          x: vector.x * this.halfSize.x,
          y: vector.y * this.halfSize.y
        };

        // calculate bullet velocity vector
        var bulletVel = {
          x: vector.x * this.game.settings.BULLET_VELOCITY,
          y: vector.y * this.game.settings.BULLET_VELOCITY
        };

        // create bullet entity
        this.game.coquette.entities.create(Bullet, 
          {
            pos: {x:this.pos.x + bulletPos.x, y:this.pos.y + bulletPos.y}, 
            vel: bulletVel
          });

        this.shotTicksLeft = this.game.settings.BULLET_DELAY_TICKS;
      }
    }

  };

  exports.Player = Player;

})(this);
;(function(exports) {

  var Game = function(canvasId, width, height) {
    this.coquette = new Coquette(this, canvasId, width, height, "#000");
    this.maths = new Maths();
    this.width = width;
    this.height = height;
    this.settings = new Settings();
    this.spriteFactory = new SpriteFactory(this);
  };

  Game.prototype = {

    player: null,
    width: 0,
    height: 0,

    init: function() {

      var self = this;
      this.coquette.entities.create(Player, {
        pos: { 
          x: this.width / 2, 
          y: this.height / 2 
        },
        maxPos: { 
          x: this.width, 
          y: this.height 
        }
      }, function(player) {
        self.player = player;
      });

    },

    draw: function(context){

      // display some player info on the screen
      context.fillStyle = "#ccc";
      context.font = "normal 9px 'Press Start 2P'";
      context.fillText("Pos: " + this.player.pos.x.toFixed(2) + ', ' + this.player.pos.y.toFixed(2), 10, 20);      
      context.fillText("Vel: " + this.player.vel.x.toFixed(2) + ', ' + this.player.vel.y.toFixed(2), 10, 40);      
      context.fillText("Thrust: " + this.player.thrust.x.toFixed(3) + ', ' + this.player.thrust.y.toFixed(3), 10, 60);      
      context.fillText("Angle (deg): " + this.player.angle.toString(), 10, 80);      
      context.fillText("Angle (rad): " + this.player.rAngle.toFixed(2), 10, 100);      
    }

  };

  exports.Game = Game;

})(this);
