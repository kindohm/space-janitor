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

    explosions: [],
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

      for (var i = 0; i < this.explosions.length; i++){
        this.explosions[i].update();
      }

      for (var i = this.explosions.length - 1; i >= 0; i--){
        if (this.explosions[i].complete){
          this.explosions.splice(i, 1);
        }
      }

    },

    draw: function(context){

      for (var i = 0; i < this.explosions.length; i++){
        this.explosions[i].draw(context);
      }

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

    deployAsteroid: function(size, pos, boundingBox){

      var direction = this.maths.plusMinus();
      size = size === undefined ? this.settings.ASTEROID_SIZE_LARGE : size;
      boundingBox = boundingBox === undefined ? this.maths.plusMinus() === 1 ? 
        this.coquette.collider.RECTANGLE : this.coquette.collider.CIRCLE : boundingBox;

      if (pos === undefined){
        pos = {
          x: direction === 1 ? 
            this.maths.getRandomInt(-this.settings.ASTEROID_SIZE_LARGE,200) : 
              this.maths.getRandomInt(this.width - 200,this.width + this.settings.ASTEROID_SIZE_LARGE), 
          y: this.height
        };
      }

      this.coquette.entities.create(Asteroid, {
        pos: pos,
        vel: {
          x: direction === 1 ? this.maths.getRandomInt(0,30) * .01 : 
            this.maths.getRandomInt(-30,0) * .01,
          y: this.maths.getRandomInt(50,200) * .01 * this.maths.plusMinus()
        },
        maxPos:{
          x: this.width,
          y: this.height
        },
        size: {
          x: size,
          y: size
        },
        boundingBox: this.maths.plusMinus() === 1 ? 
          this.coquette.collider.RECTANGLE : this.coquette.collider.CIRCLE
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

    spawnAsteroidExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 50,
        particleSize: 3,
        pos: pos
      });

      this.explosions.push(effect);
    },

    spawnPlayerExplosion: function(pos){
      var effect = new ExplosionEffect(this, {
        numParticles: 100,
        duration: 75,
        particleSize: 8,
        pos: pos
      });

      this.explosions.push(effect);
    },

    asteroidKilled: function(asteroid){

      // split up asteroid into two smaller ones
      if (asteroid.size.x === this.settings.ASTEROID_SIZE_LARGE){
        this.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, asteroid.pos);
        this.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, asteroid.pos);
      } else if (asteroid.size.x === this.settings.ASTEROID_SIZE_MEDIUM){
        this.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, asteroid.pos);
        this.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, asteroid.pos);
      } else {
        // occasionally deploy a new asteroid if the smallest size was destoryed
        if (Math.random() > .8) {
          this.deployAsteroid();
        }
      }

      this.spawnAsteroidExplosion(asteroid.pos);
    },

    playerKilled: function(player){
      var self = this;
      setTimeout(function(){
        self.spawnPlayer();
      }, 2000);
      this.spawnPlayerExplosion(player.pos);
    }

  };

  exports.Game = Game;

})(this);