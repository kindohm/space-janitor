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
      this.spawnPlayer();
      this.deployAsteroid();
      this.deployAsteroid();
      this.deployAsteroid();

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

    deployAsteroid: function(){

      var direction = this.maths.plusMinus();

      this.coquette.entities.create(Asteroid, {
        pos: {
          x: direction === 1 ? this.maths.getRandomInt(-this.settings.ASTEROID_SIZE_LARGE,200) : this.maths.getRandomInt(this.width - 200,this.width + this.settings.ASTEROID_SIZE_LARGE), 
          y: this.height
        },
        vel: {
          x: direction === 1 ? this.maths.getRandomInt(0,30) * .01 : this.maths.getRandomInt(-30,0) * .01,
          y: this.maths.getRandomInt(50,200) * .01 * this.maths.plusMinus()
        },
        maxPos:{
          x: this.width,
          y: this.height
        },
        size: {
          x: this.settings.ASTEROID_SIZE_LARGE,
          y: this.settings.ASTEROID_SIZE_LARGE
        },
        boundingBox: this.maths.plusMinus() === 1 ? this.coquette.collider.RECTANGLE : this.coquette.collider.CIRCLE
      });
    },

    spawnPlayer: function(){
      var self = this;
      self.coquette.entities.create(Player, {
        pos: { 
          x: self.width / 2, 
          y: self.height / 2 
        },
        maxPos: { 
          x: self.width, 
          y: self.height 
        }
      }, function(player) {
        self.player = player;
      });

    },

    asteroidKilled: function(asteroid){
      this.deployAsteroid();
    },

    playerKilled: function(player){
      var self = this;
      setTimeout(function(){
        self.spawnPlayer();
      }, 2000);
    }

  };

  exports.Game = Game;

})(this);