;(function(exports){

  var ThrustBubble = function(game, settings){

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

    this.colorBase = game.settings.FOREGROUND_BASE_COLOR;
    this.ticksLeft = this.totalTicks = 30;
    this.radius = 1;
  };

  ThrustBubble.prototype = {

    radiusGrowth: .2,
    center: null,
    colorBase: '204,204,204',
    angle: 0,

    update: function(){
      if (this.game.paused) return;
      this.radius += this.radiusGrowth;
      this.ticksLeft--;
      this.center.x += this.vel.x;
      this.center.y += this.vel.y;

      if (this.ticksLeft === 0){
        this.game.coquette.entities.destroy(this);
      }
    },

    draw: function(context){

      var ratio = this.ticksLeft / this.totalTicks;
      var side = this.radius * 2;
      context.beginPath();
      context.rect(this.center.x - this.radius, this.center.y - this.radius,
        side, side);
      context.strokeStyle = 'rgba(' + this.colorBase + ',' + ratio.toString() + ')';
      context.lineWidth = 1;
      context.stroke();
      context.closePath();
    }
  };

  var ThrustEffect = function(game){
    this.game = game;
  };

  ThrustEffect.prototype = {

    thrustEffectTicksLeft: 0,

    add: function(pos, direction){
       this.game.coquette.entities.create(ThrustBubble, 
          {
            pos: {
              x: pos.x, 
              y: pos.y
            }, 
            vel: {
              x: direction.x,
              y: direction.y
            }
          });     
    },

    update: function(player){

      // decrement ticks and add another "bubble" if it is time
      this.thrustEffectTicksLeft = Math.max(0, this.thrustEffectTicksLeft - 1);
      if (this.thrustEffectTicksLeft === 0 && player.thrusting){
        var vector = this.game.maths.angleToVector(player.angle + 180);
        var effectPos = {
          x: player.center.x + vector.x * player.halfSize.x,
          y: player.center.y + vector.y * player.halfSize.y
        };
        var vel = {
          x: vector.x * this.game.settings.THRUST_EFFECT_VEL,
          y: vector.y * this.game.settings.THRUST_EFFECT_VEL
        };
        this.add(effectPos, vel);
        this.thrustEffectTicksLeft = this.game.settings.THRUST_EFFECT_TICKS;
      }

    },
  };

  exports.ThrustEffect = ThrustEffect;


})(this);