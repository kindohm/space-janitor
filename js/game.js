;(function(exports) {

  var Game = function(canvasId, width, height) {
    this.coquette = new Coquette(this, canvasId, width, height, "#000");
    this.maths = new Maths();
    this.width = width;
    this.height = height;
    this.settings = new Settings();
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
      context.font = 'normal 12px Ubuntu';
      context.fillText("Pos: " + this.player.pos.x.toFixed(2) + ', ' + this.player.pos.y.toFixed(2), 10, 20);      
      context.fillText("Vel: " + this.player.vel.x.toFixed(2) + ', ' + this.player.vel.y.toFixed(2), 10, 40);      
      context.fillText("Thrust: " + this.player.thrust.x.toFixed(3) + ', ' + this.player.thrust.y.toFixed(3), 10, 60);      
      context.fillText("Angle (deg): " + this.player.angle.toString(), 10, 80);      
      context.fillText("Angle (rad): " + this.player.rAngle.toFixed(2), 10, 100);      
    }

  };

  exports.Game = Game;

})(this);