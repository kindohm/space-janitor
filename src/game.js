;(function(exports) {

  var Game = function(canvasId, width, height) {
    var self = this;

    this.coquette = new Coquette(this, canvasId, width, height, "#000");
    this.maths = new Maths();
    this.width = width;
    this.height = height;
    this.settings = new Settings();
    this.spriteFactory = new SpriteFactory(this);

    this.coquette.entities.create(GameBar,{},
      function(bar){
        self.gameBar = bar;
      });

    this.messageView = new MessageView(this);
  };

  Game.prototype = {

    state: 0,
    STATE_INTRO: 0,
    STATE_READY: 1,
    STATE_PLAYING: 2,
    STATE_BETWEEN_LEVELS: 3,
    STATE_GAME_OVER: 4,

    lives: 3,
    gameBar: null,
    explosions: [],
    level: null,
    player: null,
    width: 0,
    height: 0,
    showBoundingBoxes: false,
    soundsPath: 'sounds/',

    init: function() {
      this.soundBus = new SoundBus(this.soundsPath);
      state = this.STATE_INTRO;
      this.messageView.text = 'Press SPACE to play.';
      this.messageView.show = true;
      for (var i = 0; i < 5; i++){
        this.deployAsteroid();
      }

    },

    startNewGame: function(){

      // wipe out all entities
      var entities = this.coquette.entities.all();      
      for(var i = entities.length - 1; i >= 0; i--){
        if (entities[i] instanceof GameBar === false) {
          this.coquette.entities.destroy(entities[i]);
        }
      }

      var self = this;
      this.state = this.STATE_READY;
      this.lives = 3;
      this.level = null;
      this.messageView.text = "Ready player one";
      this.messageView.show = true;

      setTimeout(function(){
        self.messageView.show = false;
        self.spawnPlayer();
        self.initNextLevel();
      }, 3000);
    },

    initNextLevel: function(){

      this.state = this.STATE_PLAYING;
      var number = this.level === null ? 1 : this.level.number + 1;
      var asteroidCount = number + 2;
      this.level = new Level(this, number, asteroidCount);
      if (this.gameBar != null) {
        this.gameBar.levelNumber = number;
      }
      this.intermission = false;
      this.messageView.show = false;
      for (var i = 0; i < asteroidCount; i++){
        this.deployAsteroid();
      }
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

      if (!this.state == this.STATE_PLAYING){
        this.level.update();
        if (this.level.complete){
          this.state = this.STATE_BETWEEN_LEVELS;
          this.messageView.text = 'Level ' + this.level.number.toString() + ' complete. Loading next level...';
          this.messageView.show = true;
          var self = this;
          setTimeout(function(){

            self.initNextLevel();

          }, 3000);
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

      this.messageView.draw(context);

    },

    handleKeyboard: function(){

      if(this.coquette.inputter.state(this.coquette.inputter.LEFT_ARROW)
        && this.coquette.inputter.state(this.coquette.inputter.RIGHT_ARROW)) {
        this.showBoundingBoxes = !this.showBoundingBoxes;
      }

      if (this.state === this.STATE_INTRO || this.state === this.STATE_GAME_OVER){
        if(this.coquette.inputter.state(this.coquette.inputter.SPACE)) {
          this.startNewGame();
        }
      }

    },

    deployAsteroid: function(size, pos){

      var direction = this.maths.plusMinus();
      size = size === undefined ? this.settings.ASTEROID_SIZE_LARGE : size;

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
        boundingBox: this.coquette.collider.RECTANGLE
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

      this.soundBus.asteroidExplosionSound.play();

      // split up asteroid into two smaller ones
      if (asteroid.size.x === this.settings.ASTEROID_SIZE_LARGE){
        this.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, asteroid.pos);
        this.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, asteroid.pos);
      } else if (asteroid.size.x === this.settings.ASTEROID_SIZE_MEDIUM){
        this.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, asteroid.pos);
        this.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, asteroid.pos);
      } 

      this.spawnAsteroidExplosion(asteroid.pos);
    },

    playerKilled: function(player){
      this.lives--;
      this.soundBus.playerExplosionSound.play();
      this.spawnPlayerExplosion(player.pos);

      var self = this;

      if (this.lives > 0){
        setTimeout(function(){
          self.spawnPlayer();
        }, 2000);
      } else {
        this.endGame();
      }
    },

    endGame: function(){      
      var self = this;
      this.messageView.text = 'Game Over';
      this.messageView.show = true;
      this.state = self.STATE_GAME_OVER;

      setTimeout(function(){
        self.messageView.text = 'Press SPACE to play again.';
        self.state = self.STATE_INTRO;
      }, 3000);
    }

  };

  exports.Game = Game;

})(this);