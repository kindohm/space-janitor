;(function(exports){

  var Settings = function() { };

  Settings.prototype = {

    PLAYER_ROTATE_DELTA:  5,
    PLAYER_THRUST_DELTA:  0.05,
    PLAYER_SIZE_X:        20,
    PLAYER_SIZE_Y:        30,
    BULLET_VELOCITY:      5.0,
    BULLET_DELAY_TICKS:   35, 
    BULLET_SIZE_X:        4,
    BULLET_SIZE_Y:        4,
  };

  exports.Settings = Settings;

})(this);