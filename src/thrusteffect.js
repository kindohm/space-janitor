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