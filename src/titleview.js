;(function(exports){

  var TitleView = function(game){
    this.game = game;    
    this.storyOffset = this.game.height + this.storyLineHeight;
  };

  TitleView.prototype = {

    mode: 0,
    MODE_TITLE: 0,
    MODE_STORY: 1,
    storyLineHeight: 25,
    storyLeftMargin: 50,
    storyOffset: 500,
    scrollSpeed: .4,
    scrollOffset: 0,
    scrolling: false,
    timeoutId: 0,

    play: function(){
      clearTimeout(this.timeoutId);
      var self = this;
      this.scrolling = false;
      this.scrollOffset = 0;
      this.timeoutId = setTimeout(function(){
        self.startScrolling();
      }, 4000);
    },

    stop: function(){
      clearTimeout(this.timeoutId);
    },

    startScrolling: function(){
      var self = this;
      this.scrolling = true;
      this.timeoutId = setTimeout(function(){
        self.stopScrolling();
      }, 15000);
    },

    stopScrolling: function(){
      this.scrolling = false;
      var self = this;
      this.timeoutId = setTimeout(function(){
        self.resetTitle();
      }, 5000);
    },

    resetTitle: function(){
      this.scrollOffset = 0;
      var self = this;
      this.timeoutId = setTimeout(function(){
        self.startScrolling();
      }, 5000);
    },

    draw: function(context){
      context.fillStyle = '#ccc';

      context.font = "48px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillText("Space Janitor", this.game.width/2, this.game.height/2 + this.scrollOffset);

      context.font = "12px 'Press Start 2P'";
      context.textAlign = "center"
      context.fillText("Press SPACE to play", this.game.width/2, this.game.height/2 + 50 + this.scrollOffset);

      context.font = "14px 'Press Start 2P'";
      context.textAlign = "left"

      context.fillText("After centuries of abuse and neglect, space has", 
        this.storyLeftMargin, this.storyOffset + this.scrollOffset);
      context.fillText("become littered with debris from failed space",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight + this.scrollOffset);
      context.fillText("missions, canisters of unwanted, spent nuclear",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 2 + this.scrollOffset);
      context.fillText("fuel, and rains of small planetary bodies that ",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 3 + this.scrollOffset);
      context.fillText("threaten earth. There is one astronaut who is up ",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 4 + this.scrollOffset);
      context.fillText("to the challenge of clearing this debris and",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 5 + this.scrollOffset);
      context.fillText("cleaning the realm of space:",
        this.storyLeftMargin, this.storyOffset + this.storyLineHeight * 6 + this.scrollOffset);

      context.font = "24px 'Press Start 2P'";
      context.textAlign = "center"

      context.fillText("the Space Janitor",
        this.game.width / 2, this.storyOffset + this.storyLineHeight * 9 + this.scrollOffset);

      if (this.scrolling){
       this.scrollOffset -= this.scrollSpeed;
      }

    }

  };

  exports.TitleView = TitleView;

})(this);