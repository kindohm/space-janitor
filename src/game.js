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
    showBoundingBoxes: false,

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

    update: function(){
      this.handleKeyboard();
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

          context.lineWidth = entity.colliding ? 3 : 2;
          context.strokeStyle = entity.colliding ? '#00ff00' : '#FF006E';
          context.stroke();

        }
      }

    },

    handleKeyboard: function(){

      if(this.coquette.inputter.state(this.coquette.inputter.LEFT_ARROW)
        && this.coquette.inputter.state(this.coquette.inputter.RIGHT_ARROW)) {

        this.showBoundingBoxes = !this.showBoundingBoxes;
      }

    },

  };

  exports.Game = Game;

})(this);