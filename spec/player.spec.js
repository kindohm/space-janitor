var Bullet = require('../src/Bullet').Bullet;
var Player = require('../src/Player').Player;

var MockSettings = function(){
  this.PLAYER_SIZE_X = 50;
  this.PLAYER_SIZE_Y = 100;
  this.BULLET_DELAY_TICKS = 1000;
  this.PLAYER_THRUST_DELTA = 43;
  this.PLAYER_ROTATE_DELTA = 2;
};

var MockThrustEffect = function() {
  this.update = function(){};
  this.draw = function(){};
};

var MockSpriteFactory = function() {
  this.getPlayerSprite = function(){
    return 0;
  };
};

var MockInputter = function(){
  this.state = function(){
    return 0;
  }
};

var MockCoquette = function(){
  this.inputter = new MockInputter();
};


var MockMaths = function(){
  this.angleToVector = function(angle){
    return {x:0,y:0};
  };
};

var MockGame = function() {
  this.settings = new MockSettings();
  this.spriteFactory = new MockSpriteFactory();
  this.coquette = new MockCoquette();
  this.maths = new MockMaths();
};

describe('player', function() {

    var settings = { 
      pos: {
        x: 100,
        y: 200
      },
      maxPos: {
        x: 800,
        y: 600
      },
      thrustEffect: MockThrustEffect
    };

  describe('init', function(){

    it('should start at settings position', function() {
      var player = new Player(new MockGame(), settings);
      player.vel = {x:10, y:10};
      expect(player.pos.x).toEqual(100);
      expect(player.pos.y).toEqual(200);
    });
  });

  describe('update',function(){

    it('should move with velocity', function() {
      var player = new Player(new MockGame(), settings);
      player.vel = {x:10, y:10};
      player.update();
      expect(player.pos.x).toEqual(110);
      expect(player.pos.y).toEqual(210);
    });

    it('should wrap to left', function() {
      var player = new Player(new MockGame(), settings);
      player.pos.x = settings.maxPos.x;
      expect(player.pos.x).toEqual(800);
      player.vel = {x:1,y:1};
      player.update();
      expect(player.pos.x).toEqual(-player.size.x);
      expect(player.pos.y).toEqual(201);
    });

    it('should wrap to right', function() {
      var player = new Player(new MockGame(), settings);
      player.pos.x = -50;
      expect(player.pos.x).toEqual(-player.size.x);
      player.vel = {x:-1,y:1};
      player.update();
      expect(player.pos.x).toEqual(settings.maxPos.x);
      expect(player.pos.y).toEqual(201);
    });

    it('should wrap to bottom', function() {
      var player = new Player(new MockGame(), settings);
      player.pos.y = -player.size.y;
      expect(player.pos.y).toEqual(-player.size.y);
      player.vel = {x:0,y:-1};
      player.update();
      expect(player.pos.y).toEqual(settings.maxPos.y);
    });

    it('should wrap to top', function() {
      var player = new Player(new MockGame(), settings);
      player.pos.y = settings.maxPos.y;
      player.vel = {x:0,y:1};
      player.update();
      expect(player.pos.y).toEqual(-player.size.y);
    });

    it('should decrement shotTicksLeft',function(){
      var player = new Player(new MockGame(), settings);
      player.shotTicksLeft = 10;
      player.update();
      expect(player.shotTicksLeft).toEqual(9);
    });

    it('should keep shotTicksLeft at zero',function(){
      var player = new Player(new MockGame(), settings);
      player.shotTicksLeft = 0;
      player.update();
      expect(player.shotTicksLeft).toEqual(0);
    });

  });


  describe('handleKeyboard', function(){

    it('should thrust', function(){
      var game = new MockGame();
      game.maths.angleToVector = function(angle){
        return {x: 0.234, y: 0.728};
      };

      game.coquette.inputter.UP_ARROW = 'up';
      game.coquette.inputter.state = function(input){
        return input === 'up';
      };
      var player = new Player(game, settings);
      player.update();

      var thrustX = 0.234 * game.settings.PLAYER_THRUST_DELTA;
      var thrustY = 0.728 * game.settings.PLAYER_THRUST_DELTA;

      expect(player.thrustScale).toEqual(game.settings.PLAYER_THRUST_DELTA);
      expect(player.thrusting).toEqual(true);
      expect(player.thrust.x).toEqual(thrustX);
      expect(player.thrust.y).toEqual(thrustY);
      expect(player.vel.x).toEqual(thrustX);
      expect(player.vel.y).toEqual(thrustY);
      expect(player.pos.x).toEqual(settings.pos.x + player.vel.x);
      expect(player.pos.y).toEqual(settings.pos.y + player.vel.y);
      
    });

    it('should stop thrusting', function(){
      var game = new MockGame();
      game.maths.angleToVector = function(angle){
        return {x: 0.234, y: 0.728};
      };

      game.coquette.inputter.UP_ARROW = '';
      game.coquette.inputter.state = function(input){
        return input === 'up';
      };
      var player = new Player(game, settings);

      player.thrusting = true;
      player.vel = {x:5,y:5};
      player.thrust = {x:10,y:10};
      player.update();

      expect(player.thrustScale).toEqual(0);
      expect(player.thrusting).toEqual(false);
      expect(player.thrust.x).toEqual(0);
      expect(player.thrust.y).toEqual(0);
      expect(player.vel.x).toEqual(5);
      expect(player.vel.y).toEqual(5);
      
    });

    it('should rotate right', function(){
      var game = new MockGame();
      var degrees = 23451;
      var radians = 3728.18739;
      game.maths.dial = function(){
        return degrees;
      };

      game.maths.degToRad = function(){
        return radians;
      };

      game.coquette.inputter.RIGHT_ARROW = 'right';
      game.coquette.inputter.LEFT_ARROW = '';
      game.coquette.inputter.state = function(input){
        return input === 'right';
      };

      var player = new Player(game, settings);
      player.angle = 0;
      player.rAngle = 0;
      player.update();

      expect(player.angle).toEqual(degrees);
      expect(player.rAngle).toEqual(radians);
    });

    it('should rotate right', function(){
      var game = new MockGame();
      var degrees = 1181;
      var radians = 8.81;
      game.maths.dial = function(){
        return degrees;
      };

      game.maths.degToRad = function(){
        return radians;
      };

      game.coquette.inputter.RIGHT_ARROW = '';
      game.coquette.inputter.LEFT_ARROW = 'left';
      game.coquette.inputter.state = function(input){
        return input === 'left';
      };

      var player = new Player(game, settings);
      player.angle = 0;
      player.rAngle = 0;
      player.update();

      expect(player.angle).toEqual(degrees);
      expect(player.rAngle).toEqual(radians);
    });

    it('should shoot', function(){
      var game = new MockGame();

      game.coquette.inputter.SPACE = 'space';
      game.coquette.inputter.state = function(input){
        return input === 'space';
      };

      game.coquette.entities = function(){

      };

      var created = false;
      game.coquette.entities.create = function(){
        created = true;
      };

      var shotVector = {x:0.3871,y:0.2172};
      game.maths.angleToVector = function(){
        return shotVector;
      }

      var player = new Player(game, settings);

      player.shotTicksLeft = 0;
      player.update();

      expect(player.shotTicksLeft).toEqual(game.settings.BULLET_DELAY_TICKS - 1);
      expect(created).toEqual(true);
    });

    it('should not shoot when shotTicksLeft is not zero', function(){
      var game = new MockGame();

      game.coquette.inputter.SPACE = 'space';
      game.coquette.inputter.state = function(input){
        return input === 'space';
      };

      game.coquette.entities = function(){

      };

      var created = false;
      game.coquette.entities.create = function(){
        created = true;
      };

      var shotVector = {x:0.3871,y:0.2172};
      game.maths.angleToVector = function(){
        return shotVector;
      }

      var player = new Player(game, settings);

      player.shotTicksLeft = 1;
      player.update();

      expect(player.shotTicksLeft).toEqual(0);
      expect(created).toEqual(false);
    });

  });

});
