;(function(exports){

  /*
  After centuries of abuse and neglect, space has 
  become littered with debris from failed space 
  missions, canisters of unwanted, spent nuclear 
  fuel, and   rains of small planetary bodies that 
  threaten earth. There is one astronaut who is up 
  to the challenge of clearing this debris and 
  cleaning the realm of space: The Space Janitor.
  */

  var StoryView = function(game){
    this.game = game;
    this.offset = this.game.height;
  };

  StoryView.prototype = {
    lineHeight: 25,
    speed: .4,
    offset: 20,
    margin: 50,

    draw: function(context){

      context.fillStyle = '#ccc';

      context.font = "14px 'Press Start 2P'";
      context.textAlign = "left"

      context.fillText("After centuries of abuse and neglect, space has", 
        this.margin, this.offset);
      context.fillText("become littered with debris from failed space",
        this.margin, this.offset + this.lineHeight);
      context.fillText("missions, canisters of unwanted, spent nuclear",
        this.margin, this.offset + this.lineHeight * 2);
      context.fillText("fuel, and rains of small planetary bodies that ",
        this.margin, this.offset + this.lineHeight * 3);
      context.fillText("threaten earth. There is one astronaut who is up ",
        this.margin, this.offset + this.lineHeight * 4);
      context.fillText("to the challenge of clearing this debris and",
        this.margin, this.offset + this.lineHeight * 5);
      context.fillText("cleaning the realm of space:",
        this.margin, this.offset + this.lineHeight * 6);

      context.font = "24px 'Press Start 2P'";
      context.textAlign = "center"

      context.fillText("the Space Janitor",
        this.game.width / 2, this.offset + this.lineHeight * 9);

      if (this.offset > this.game.height * .33){
       this.offset -= this.speed;
      }
    }

  };

  exports.StoryView = StoryView;

})(this);