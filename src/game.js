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
    showBoundingBoxes: true,

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

      this.coquette.entities.create(Simple, {
        isBox: false,
        vel: {x:0,y:0},
        pos: {x:100,y:100},
        size: {x:100,y:100}
      });

      this.coquette.entities.create(Simple, {
        isBox: true,
        vel: {x:0,y:0},
        pos: {x:400,y:300},
        size: {x:100,y:100}
      });

    },

    draw: function(context){
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

          context.lineWidth = entity.colliding ? 2 : 1;
          context.strokeStyle = entity.colliding ? '#00ff00' : '#FF006E';
          context.stroke();


        }
      }

    }

  };

  exports.Game = Game;

})(this);