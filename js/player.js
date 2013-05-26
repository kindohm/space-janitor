;(function(exports){

  function Player(game, settings){

    var self = this;
    this.pos = settings.pos;
    this.maxPos = settings.maxPos;
    this.game = game;

    this.size = { 
      x: game.settings.PLAYER_SIZE_X,
      y: game.settings.PLAYER_SIZE_Y 
    };

    this.halfSize = {
      x: this.size.x / 2,
      y: this.size.y / 2
    };

    this.sprite = new Image();
    this.sprite.onload = function(){
      self.spriteReady = true;
    };
    this.sprite.src = 'sprites/player.png';

    this.inMemorySprite = this.getSprite();
  }

  Player.prototype = {

    size:         {x: 20, y: 30},
    halfSize:     {x: 10, y: 15},
    vel:          {x: 0,  y: 0},
    spriteReady:  false,
    angle:        180,
    rAngle:       3.14,
    angleVector:  {x: 0, y: 0}, 
    thrust:       {x: 0, y: 0},
    thrusting:    false,
    thrustScale:  0,

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

    },

    getSprite: function(){

      var canvas = document.createElement('canvas');
      canvas.width = 20;
      canvas.height = 30;
      
      var context = canvas.getContext('2d');
      context.beginPath();
      context.moveTo(0,0);
      context.lineTo(this.halfSize.x,this.size.y);
      context.lineTo(this.size.x, 0);
      context.lineTo(this.halfSize.x,7);
      context.lineTo(0, 0);
      context.closePath();
      context.strokeStyle = '#ccc';
      context.lineWidth = 1;
      context.stroke();

      return canvas;
    },

    draw: function(){

      var context = this.game.coquette.renderer.getCtx();

      // 1) draw a .png ship sprite
      context.save();
      context.translate(this.pos.x, this.pos.y);
      context.rotate(this.rAngle);
      
      context.drawImage(this.sprite, -this.halfSize.x, -this.halfSize.y,
        this.size.x, this.size.y);

      context.rotate(-this.Angle);
      context.translate(-(this.pos.x), -(this.pos.y));
      context.restore();      

      // 2) an on-the-fly path drawing
      var offset = 50;
      context.save();
      context.translate(this.pos.x + offset, this.pos.y);
      context.rotate(this.rAngle);

      context.beginPath();
      context.moveTo(-this.halfSize.x,-this.halfSize.y);
      context.lineTo(0,this.halfSize.y);
      context.lineTo(this.halfSize.x, -this.halfSize.y);
      context.lineTo(0,-7);
      context.lineTo(-this.halfSize.x, -this.halfSize.y);
      context.closePath();
      context.strokeStyle = '#ccc';
      context.lineWidth = 1;
      context.stroke();

      context.rotate(-this.Angle);
      context.translate(-(this.pos.x + offset), -(this.pos.y));
      context.restore();      

      // 3) draw the in-memory canvas sprite      
      var offset = 100;
      context.save();
      context.translate(this.pos.x + offset, this.pos.y);
      context.rotate(this.rAngle);

      context.drawImage(this.inMemorySprite, -this.halfSize.x, -this.halfSize.y,
        this.size.x, this.size.y);

      context.rotate(-this.Angle);
      context.translate(-(this.pos.x + offset), -(this.pos.y));
      context.restore();      
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

  };

  exports.Player = Player;

})(this);