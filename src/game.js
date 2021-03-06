;(function(exports) {

  var Game = function(canvasId, width, height) {
    var self = this;

    this.settings = new Settings();

    this.coquette = new Coquette(this, canvasId, width, height, this.settings.BACKGROUND_COLOR);
    this.maths = new Maths();
    this.width = width;
    this.height = height;
    this.spriteFactory = new SpriteFactory(this);

    this.coquette.entities.create(GameBar,{},
      function(bar){
        self.gameBar = bar;
      });

    this.coquette.entities.create(PauseView,{},
      function(view){
        self.pauseView = view;
      });
    
    this.messageView = new MessageView(this);
    this.titleView = new TitleView(this);
    this.scoringRules = new ScoringRules(this);
    this.ufoTicksLeft = this.ufoTicks;
    this.oneUpPlateau = this.oneUpPlateauStep;
    this.version = new Version();
    this.levels = [];

    this.powerupType = Powerup.prototype.TYPE_SPRAY;
  };

  Game.prototype = {

    state: 0,
    STATE_TITLE: 0,
    STATE_CHOOSE_DIFFICULTY: 1,
    STATE_SHOW_CONTROLS: 2,
    STATE_PLAYING: 3,
    STATE_BETWEEN_LEVELS: 4,
    STATE_GAME_OVER: 5,
    STATE_READY: 6,

    DIFFICULTY_FREE: 0,
    DIFFICULTY_EASY: 1,
    DIFFICULTY_NORMAL: 2,
    DIFFICULTY_HARD: 3,
    DIFFICULTY_INSANE: 4,

    oldRadialBlasts: 0,
    difficulty: 2,
    pausing: false,
    paused: false,
    score: 0,
    lives: 0,
    gameBar: null,
    explosions: [],
    level: null,
    player: null,
    width: 0,
    height: 0,
    showBoundingBoxes: false,
    soundsPath: 'sounds/',
    ufoTicks: 1400,
    oneUpPlateauStep: 250000,

    init: function() {
      this.coquette.inputter.supressedKeys
      this.soundBus = new SoundBus(this.soundsPath);
      this.state = this.STATE_TITLE;
      this.titleView.play();
    },

    clearEntities: function(){
      // wipe out all entities
      var entities = this.coquette.entities.all();      
      for(var i = entities.length - 1; i >= 0; i--){
        if (entities[i] instanceof GameBar === false && entities[i] instanceof PauseView === false) {
          this.coquette.entities.destroy(entities[i]);
        }
      }
    },

    chooseDifficulty: function(){
      var self = this;
      this.messageView.show = false;
      this.state = this.STATE_CHOOSE_DIFFICULTY;
      this.coquette.entities.create(DifficultyView, {},
        function(view){
          view.difficultySelected(function(difficultyValue){
            self.difficulty = difficultyValue;
            self.coquette.entities.destroy(view);
            self.startNewGame();
          });
        });
    },

    startNewGame: function(){
      var self = this;

      this.start = new Date();
      this.oldRadialBlasts = 0;
      this.clearEntities();
      this.levels = [];
      this.state = this.STATE_READY;
      this.scoringRules = new ScoringRules(this);
      this.oneUpPlateau = this.oneUpPlateauStep;
      this.score = 0;
      this.lives = 3;
      this.level = null;
      this.titleView.stop();

      this.coquette.entities.create(ReadyView, {}, 
        function(view){
          view.playerReady(function(){
            self.coquette.entities.destroy(view);
            self.messageView.show = false;
            self.messageView.text = self.messageView.text2 = self.messageView.text3 = self.messageView.text4 = '';

            // delay spawning the player so that the user's space bar doesn't
            // trigger a shot. just annoying to me.
            setTimeout(function(){
              self.spawnPlayer();
              self.initNextLevel();
            }, 500);
          });
        });

    },

    getNextPowerupType: function(){
      if (this.powerupType === Powerup.prototype.TYPE_SPRAY){
        this.powerupType = Powerup.prototype.TYPE_RAPID_FIRE;
      } else if (this.powerupType === Powerup.prototype.TYPE_RAPID_FIRE){
        this.powerupType = Powerup.prototype.TYPE_RADIAL_BLAST;
      } else {
        this.powerupType = Powerup.prototype.TYPE_SPRAY;
      }
      return this.powerupType;
    },


    initNextLevel: function(){

      this.ufoTicks = this.maths.getRandomInt(1000, 1500);
      this.ufoTicksLeft = this.ufoTicks;
      this.state = this.STATE_PLAYING;
      var number = this.level === null ? 1 : this.level.number + 1;
      this.level = new Level(this, number, this.difficulty, this.getNextPowerupType());
      this.levels.push(this.level);
      if (this.gameBar != null) {
        this.gameBar.levelNumber = number;
      }

      this.messageView.show = false;

      var self = this;
      self.level.deployAsteroid();
      for (var i = 1; i < this.level.asteroidCount; i++){
        setTimeout(function(){
          self.level.deployAsteroid();
        }, i * 1000);
      }


    },

    update: function(){
      this.handleKeyboard();

      if (this.paused) return;

      for (var i = 0; i < this.explosions.length; i++){
        this.explosions[i].update();
      }

      for (var i = this.explosions.length - 1; i >= 0; i--){
        if (this.explosions[i].complete){
          this.explosions.splice(i, 1);
        }
      }

      if (this.state == this.STATE_PLAYING){
        this.level.update();
        if (this.level.complete){
          this.state = this.STATE_BETWEEN_LEVELS;
          var levelBonus = this.scoringRules.pointsForLevel(this.level);
          this.appendScore(levelBonus);
          this.messageView.text = 'Level ' + this.level.number.toString() + ' complete. Bonus: ' + levelBonus.toString() + '. Loading next level...';
          this.messageView.show = true;
          var self = this;

          setTimeout(function(){

            self.initNextLevel();

          }, 3000);

        } else {
          this.checkUfo();
        }
      }
    },

    checkUfo: function(){
      this.ufoTicksLeft--;
      if (!this.level.ufoDeployed && this.ufoTicksLeft === 0){
        this.level.ufoDeployed = true;
        this.spawnUfo();
      }
    },

    spawnUfo: function(){
      this.level.spawnUfo();
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

      if (this.state === this.STATE_TITLE){
        this.titleView.draw(context);
      } else {
        this.messageView.draw(context);
      }

      context.fillStyle = this.settings.MUTED_COLOR;
      context.font = "8px 'Press Start 2P'";
      context.textAlign = "left"
      context.fillText("v" + this.version.number, 5, this.height - 5);


    },

    handleKeyboard: function(){

      this.checkPause();

      var inputter = this.coquette.inputter;

      if (this.paused && inputter.isPressed(inputter.Q)){
        // quit!
        this.clearEntities();
        var paused = true;
        this.endGame(paused);
        return;
      }

      if (this.paused) return;

      if (this.state === this.STATE_TITLE){
        if (inputter.isPressed(inputter.SPACE)) {
          this.chooseDifficulty();
        }
      }

    },

    checkPause: function(){
      var esc = this.coquette.inputter.isPressed(this.coquette.inputter.ESC);

      if (this.state === this.STATE_PLAYING && esc){
        if (!this.pausing){
          this.pausing = true;
        } 
      } else if (this.state === this.STATE_PLAYING && !esc){
        if (this.pausing){
          
          this.paused = !this.paused;
          this.pausing = false;
          if (this.paused){

            this.previousText = this.messageView.text;
            this.previousShow = this.messageView.show;
            
            this.messageView.show = false;
            this.pauseView.show = true;
            this.soundBus.pauseSound.play();
          }
          else{
            this.pauseView.show = false;
            this.messageView.text = this.previousText;
            this.messageView.show = this.previousShow;
            this.soundBus.pauseSound.play();
          }

        }
      }
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
        },
        radialBlasts: this.oldRadialBlasts
      }, function(player) {
        self.player = player;
      });

    },

    spawnAsteroidExplosion: function(center){
      var effect = new ExplosionEffect(this, {
        numParticles: 20,
        duration: 50,
        particleSize: 3,
        center: center
      });

      this.explosions.push(effect);
    },

    spawnPlayerExplosion: function(center){
      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 75,
        particleSize: 8,
        center: center
      });

      this.explosions.push(effect);
    },

    spawnUfoExplosion: function(center){
      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 75,
        particleSize: 8,
        center: center
      });

      this.explosions.push(effect);
    },

    spawnPowerupExplosion: function(center, powerup){
      var color = '200,200,200';

      if (powerup.powerupType === powerup.TYPE_RADIAL_BLAST){
        color = this.settings.RADIAL_BLAST_BASE_COLOR;
      } else if (powerup.powerupType === powerup.TYPE_RAPID_FIRE){
        color = this.settings.RAPID_FIRE_BASE_COLOR;
      } else if (powerup.powerupType === powerup.TYPE_SPRAY){
        color = this.settings.SPRAY_BASE_COLOR;
      }

      var effect = new ExplosionEffect(this, {
        numParticles: 50,
        duration: 75,
        particleSize: 8,
        baseColor: color,
        center: center
      });

      this.explosions.push(effect);
    },

    asteroidKilled: function(asteroid, other){

      if (other instanceof Bullet) this.level.asteroidsKilledByBullet++;
      if (other instanceof RadialBlast) this.level.asteroidsKilledByRadialBlast++;
      if (other instanceof Player) this.level.asteroidsKilledByPlayerCollision++;

      this.soundBus.asteroidExplosionSound.play();

      // split up asteroid into two smaller ones
      var newPos = {x: asteroid.center.x + asteroid.size.x / 4, y: asteroid.center.y + asteroid.size.y/4};
      if (asteroid.size.x === this.settings.ASTEROID_SIZE_LARGE){
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, newPos);
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_MEDIUM, newPos);
      } else if (asteroid.size.x === this.settings.ASTEROID_SIZE_MEDIUM){
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, newPos);
        this.level.deployAsteroid(this.settings.ASTEROID_SIZE_SMALL, newPos);
      } 
      this.level.asteroidsShot++;
      this.appendScore(this.scoringRules.pointsForAsteroid(asteroid));
      this.spawnAsteroidExplosion(asteroid.center);
    },

    shotFired: function(){
      this.level.shots++;
    },

    thrusting: function(){
      this.level.thrustTicks++;
    },

    playerKilled: function(player, other){
      this.lives--;
      this.soundBus.playerExplosionSound.play();
      this.spawnPlayerExplosion(player.center);
      this.oldRadialBlasts = player.radialBlasts;

      if (other instanceof Bullet) this.level.deathsByUfoBullet++;
      if (other instanceof Ufo) this.level.deathsByUfoCollision++;
      if (other instanceof Asteroid) this.level.deathsByAsteroidCollision++;

      var self = this;

      if (this.lives > 0){
        setTimeout(function(){
          self.trySpawnPlayer();
        }, 2000);
      } else {
        this.endGame();
      }
    },

    ufoKilled: function(ufo, other){
      this.soundBus.playerExplosionSound.play();
      this.spawnUfoExplosion(ufo.center);
      this.appendScore(this.scoringRules.pointsForUfo(ufo));

      if (other instanceof Bullet) this.level.ufosKilledByBullet++;
      if (other instanceof Player) this.level.ufosKilledByPlayerCollision++;
      if (other instanceof RadialBlast) this.level.ufosKilledByRadialBlast++;
    },

    trySpawnPlayer: function(){

      var desiredPosition = {
        x: this.width / 2,
        y: this.height / 2
      };

      var asteroids = this.coquette.entities.all(Asteroid);
      var spaceAvailable = true;

      for (var i = 0; i < asteroids.length; i++){

        if (this.maths.distance(desiredPosition, asteroids[i].center) < this.settings.PLAYER_SIZE * 4){
          spaceAvailable = false;
          break;
        }
      }

      if (!spaceAvailable){
        this.messageView.text = "Waiting for some open space...";
        this.messageView.show = true;
        var self = this;
        setTimeout(function(){
          self.trySpawnPlayer();
        }, 200)
      } else{
        this.messageView.show = false;
        this.spawnPlayer();
      }

    },

    endGame: function(wasPaused){      

      this.end = new Date();
      this.level.end = new Date();
      this.soundBus.ufoSound.stop();
      this.soundBus.powerupHumSound.stop();

      var self = this;
      this.paused = false;
      this.pauseView.show = false;      

      if (wasPaused != undefined && wasPaused){
        self.state = self.STATE_TITLE;
        self.oldRadialBlasts = 0;
        self.player.radialBlasts = 0;
        self.titleView.play();
        return;
      }

      this.state = self.STATE_GAME_OVER;
      this.messageView.text = 'Game Over';
      this.messageView.show = true;

      setTimeout(function(){
        self.clearEntities();
        self.goBackToTitle();
      }, 3000);

    },

    goBackToTitle: function(){
      this.messageView.text = '';
      this.messageView.show = false;
      this.state = this.STATE_TITLE;
      this.oldRadialBlasts = 0;
      this.player.radialBlasts = 0;
      this.titleView.play();
    },

    sendScore: function(){
      var name = $('#input-player-name').val();
      if (name === undefined || name.trim().length === 0){
        this.goBackToTitle();
        return;
      }

      $('#submit-button').html('Submitting...');
      $('#submit-button').attr('disabled', 'disabled');
      $('#no-thanks-button').attr('disabled', 'disabled');
      $('#input-player-name').attr('disabled', 'disabled');

      this.playerName = name;

      var self = this;
      var poster = new ScorePoster();
      poster.postScore(this, function(result){
        
        if (result.Success != true){
          $('#error-panel').show();
          $('#error-close-button').click(function(){
            $('#error-close-button').off('click');
            $('#post-score').bPopup().close();
            self.goBackToTitle();
          });
        }
        else {
          $('#post-score').bPopup().close();
          self.goBackToTitle();
        }
      });

    },

    appendScore: function(more){
      this.score += more;
      this.level.score += more;

      if (this.score >= this.oneUpPlateau){
        this.oneUpPlateau += this.oneUpPlateauStep;
        this.lives++;
        this.soundBus.oneUpSound.play();
      }
    },

    powerupAcquired: function(powerup){
      if (powerup.powerupType === powerup.TYPE_RADIAL_BLAST){
        this.radialBlastAcquired(powerup);
      } else if (powerup.powerupType === powerup.TYPE_RAPID_FIRE){
        this.rapidFireAcquired(powerup);
      } else if (powerup.powerupType === powerup.TYPE_SPRAY){
        this.sprayAcquired(powerup);
      }
    },

    rapidFireAcquired: function(powerup){
      this.player.enableRapidFire();
      this.spawnPowerupExplosion(powerup.center, powerup);
      this.soundBus.playerExplosionSound.play();
      this.level.rapidFiresCaptured++;
    },

    sprayAcquired: function(powerup){
      this.player.enableSpray();
      this.spawnPowerupExplosion(powerup.center, powerup);
      this.soundBus.playerExplosionSound.play();
      this.level.spraysCaptured++;
    },

    radialBlastAcquired: function(powerup){
      this.player.radialBlasts++;
      this.level.radialBlastsCaptured++;
      this.spawnPowerupExplosion(powerup.center, powerup);
      this.soundBus.playerExplosionSound.play();
    },

    radialBlastDeployed: function(powerup){
      this.level.radialBlastsDeployed++;
    }

  };

  exports.Game = Game;

})(this);