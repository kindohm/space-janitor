;(function(exports){

  var cache = new Hashtable();

  var SpriteFactory = function(game){
    this.game = game;
  };

  SpriteFactory.prototype = {

    getBulletSprite: function(){

      if (!cache.containsKey(this.getBulletSprite)){
        var canvas = document.createElement('canvas');
        canvas.width = this.game.settings.BULLET_SIZE_X;
        canvas.height = this.game.settings.BULLET_SIZE_Y;

        var context = canvas.getContext('2d');
        context.fillStyle = '#ccc';
        context.fillRect(0,0,this.game.settings.BULLET_SIZE_X, this.game.settings.BULLET_SIZE_Y);
        cache.put(this.getBulletSprite, canvas);
      }

      return cache.get(this.getBulletSprite);

    },

    getPlayerSprite: function(){

      if (!cache.containsKey(this.getPlayerSprite)){
        var canvas = document.createElement('canvas');
        canvas.width = this.game.settings.PLAYER_SIZE_X;
        canvas.height = this.game.settings.PLAYER_SIZE_Y;
        
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(this.game.settings.PLAYER_SIZE_X/2,this.game.settings.PLAYER_SIZE_Y);
        context.lineTo(this.game.settings.PLAYER_SIZE_X, 0);
        context.lineTo(this.game.settings.PLAYER_SIZE_X/2,7);
        context.lineTo(0, 0);
        context.closePath();
        context.strokeStyle = '#ccc';
        context.lineWidth = 1;
        context.stroke();

        cache.put(this.getPlayerSprite, canvas);
      }
      return cache.get(this.getPlayerSprite);
    },


  };

  exports.SpriteFactory = SpriteFactory;

})(this);