var ThrustEffect = require('../src/ThrustEffect').ThrustEffect;

var MockGame = function() {
  this.maths = {};
  this.maths.angleToVector = function(){
    return {x:1,y:1};
  }
  this.settings = {};
  this.settings.THRUST_EFFECT_VEL = 10;
  this.settings.THRUST_EFFECT_TICKS = 200;
};

describe('thrusteffect', function() {


  it('should be initialized', function() {
    var game = new MockGame();
    var effect = new ThrustEffect(game);
    expect(effect.game).toBe(game);
    expect(effect.effects.length).toBe(0);
  });

  it('should add bubble', function(){
    var game = new MockGame();
    var effect = new ThrustEffect(game);
    var pos = {x: 10, y: 10};
    var vector = {x:-2, y: 18};
    effect.add(pos, vector);
    expect(effect.effects.length).toBe(1);
  });

  it('does nothing if ticks greater than zero', function(){
    var game = new MockGame();
    var effect = new ThrustEffect(game);
    effect.thrustEffectTicksLeft = 2;
    effect.update({});
    expect(effect.effects.length).toBe(0);
  });

  it('does nothing if ticks equal zero and player not thrusting', function(){
    var game = new MockGame();
    var effect = new ThrustEffect(game);
    effect.thrustEffectTicksLeft = 1;
    effect.update({thrusting:false});
    expect(effect.effects.length).toBe(0);
  });

  it('adds bubble if ticks equal zero and player thrusting', function(){
    var game = new MockGame();
    var effect = new ThrustEffect(game);
    effect.thrustEffectTicksLeft = 1;
    effect.update({thrusting:true, halfSize: {x:1,y:1}, pos: {x:10,y:10}});
    expect(effect.effects.length).toBe(1);
  });

  it('removes old effects', function(){
    var game = new MockGame();
    var effect = new ThrustEffect(game);
    effect.thrustEffectTicksLeft = 1;
    effect.update({thrusting:true, halfSize: {x:1,y:1}, pos: {x:10,y:10}});

    effect.effects[0].ticksLeft = 0;
    effect.update({thrusting:false, halfSize: {x:1,y:1}, pos: {x:10,y:10}});
    expect(effect.effects.length).toBe(0);
  });

  it('does not remove current effects', function(){
    var game = new MockGame();
    var effect = new ThrustEffect(game);
    effect.thrustEffectTicksLeft = 1;
    effect.update({thrusting:true, halfSize: {x:1,y:1}, pos: {x:10,y:10}});

    effect.effects[0].ticksLeft = 1;
    effect.update({thrusting:false, halfSize: {x:1,y:1}, pos: {x:10,y:10}});
    expect(effect.effects.length).toBe(1);
  });

});
