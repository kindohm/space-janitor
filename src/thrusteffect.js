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