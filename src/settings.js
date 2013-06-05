;(function(exports){

  var Settings = function() { };

  Settings.prototype = {

    PLAYER_ROTATE_DELTA:  5,
    PLAYER_THRUST_DELTA:  0.04,
    PLAYER_SIZE:          30,
    PLAYER_LINE_WIDTH:    2, 
    BULLET_VELOCITY:      5.0,
    BULLET_DELAY_TICKS:   10, 
    BULLET_SIZE_X:        4,
    BULLET_SIZE_Y:        4,
    THRUST_EFFECT_TICKS:  8,
    THRUST_EFFECT_VEL:    1.0, 
    ASTEROID_LINE_WIDTH:  2,
    ASTEROID_SIZE_LARGE:  100,
    ASTEROID_SIZE_MEDIUM: 50, 
    ASTEROID_SIZE_SMALL:  25,

    /* DEFAULT THEME */
    
    BACKGROUND_COLOR:     '#000',
    POWERUP_BASE_COLOR:   '100,100,255',
    POWERUP_COLOR:        '#6666FF',
    FOREGROUND_COLOR:     '#ccc',
    FOREGROUND_BASE_COLOR:'204,204,204',
    FLASH_BASE_COLOR:     '255,255,255', 
    MUTED_COLOR:     '#333',
    
    /* NEPTUNE THEME */
    /*
    BACKGROUND_COLOR:     '#0094FF',
    POWERUP_BASE_COLOR:   '255,255,100',
    POWERUP_COLOR:        '#FFFF66',
    FOREGROUND_COLOR:     '#fff',
    FOREGROUND_BASE_COLOR:'255,255,255',
    FLASH_BASE_COLOR:     '255,255,255', 
    */

    /* LUNAR THEME */
    /*
    BACKGROUND_COLOR:     '#fff',
    POWERUP_BASE_COLOR:   '100,100,255',
    POWERUP_COLOR:        '#6666FF',
    FOREGROUND_COLOR:     '#333',
    FOREGROUND_BASE_COLOR:'51,51,51',
    FLASH_BASE_COLOR:     '0,0,0', 
    */

  };

  exports.Settings = Settings;

})(this);