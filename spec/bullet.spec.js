var Bullet = require('../src/Bullet').Bullet;

var MockSettings = function(){
  this.BULLET_SIZE_X = 2;
  this.BULLET_SIZE_Y = 5;
};

var MockSpriteFactory = function() {
  this.getBulletSprite = function(){
    return 0;
  };
};

var MockCoquette = function(){
  this.entities = {};
  this.destroyed = null;
  var self = this;
  this.entities.destroy = function(target){
    self.destroyed = target;
  };
};

var MockGame = function() {
  this.settings = new MockSettings();
  this.spriteFactory = new MockSpriteFactory();
  this.coquette = new MockCoquette();
  this.width = 1000;
  this.height = 1200;
};

describe('bullet', function() {

    var settings = { 
      pos: {
        x: 100,
        y: 200
      },
      vel: {
        x: 10.234,
        y: -18.382
      }
    };

  describe('init', function(){

    it('should have settings', function() {
      var game = new MockGame();
      var bullet = new Bullet(game, settings);
      expect(bullet.pos.x).toEqual(settings.pos.x);
      expect(bullet.pos.y).toEqual(settings.pos.y);
      expect(bullet.vel.x).toEqual(settings.vel.x);
      expect(bullet.vel.y).toEqual(settings.vel.y);
      expect(bullet.size.x).toEqual(game.settings.BULLET_SIZE_X);
      expect(bullet.size.y).toEqual(game.settings.BULLET_SIZE_Y);
    });
  });

  describe('update',function(){

    it('should move with velocity', function(){
      var game = new MockGame();
      var bullet = new Bullet(game, settings);
      bullet.update();
      expect(bullet.pos.x).toEqual(settings.pos.x + bullet.vel.x);
      expect(bullet.pos.y).toEqual(settings.pos.y + bullet.vel.y);
    });

    it('should destroy on left', function(){
      var game = new MockGame();
      var bullet = new Bullet(game, settings);
      bullet.pos.x = 1;
      bullet.vel.x = -1;
      bullet.update();
      expect(game.coquette.destroyed).toEqual(bullet);
    });

    it('should destroy on right', function(){
      var game = new MockGame();
      var bullet = new Bullet(game, settings);
      bullet.pos.x = game.width - 1;
      bullet.vel.x = 1;
      bullet.update();
      expect(game.coquette.destroyed).toEqual(bullet);
    });

    it('should destroy on top', function(){
      var game = new MockGame();
      var bullet = new Bullet(game, settings);
      bullet.pos.y = 1;
      bullet.vel.y = -1;
      bullet.update();
      expect(game.coquette.destroyed).toEqual(bullet);
    });

    it('should destroy on bottom', function(){
      var game = new MockGame();
      var bullet = new Bullet(game, settings);
      bullet.pos.y = game.height - 1;
      bullet.vel.y = 1;
      bullet.update();
      expect(game.coquette.destroyed).toEqual(bullet);
    });

    it('should not destroy in middle', function(){
      var game = new MockGame();
      var bullet = new Bullet(game, settings);
      bullet.pos.y = game.height - 2;
      bullet.vel.y = 1;
      bullet.update();
      expect(game.coquette.destroyed).toEqual(null);
    });

  });

});
