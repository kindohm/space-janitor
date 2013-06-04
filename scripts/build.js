var fs = require('fs');

var packer = require( 'node.packer' ),
    path   = __dirname + '/../',
    src    = path + 'src/',
    out    = path + 'js/';

var input = [
  src + 'settings.js',
  src + 'spritefactory.js',
  src + 'bullet.js',
  src + 'soundbus.js',
  src + 'thrusteffect.js',
  src + 'explosioneffect.js',
  src + 'asteroid.js',
  src + 'ufo.js',
  src + 'player.js',
  src + 'gamebar.js',
  src + 'level.js',
  src + 'radialblast.js',
  src + 'radialblastpowerup.js',
  src + 'pauseview.js',
  src + 'messageview.js',
  src + 'difficultyview.js',
  src + 'titleview.js',
  src + 'scoringrules.js',
  src + 'game.js'
];

/*
fs.createReadStream('node_modules/coquette/coquette.js')
  .pipe(fs.createWriteStream(out + 'coquette.js'));

fs.createReadStream('node_modules/coquette/coquette-min.js')
  .pipe(fs.createWriteStream(out + 'coquette-min.js'));
*/

packer({
  log: true,
  input: input,
  minify: true,
  output: out + 'space-janitor-min.js',
  callback: function ( err, code ){
    err && console.log( err );
  }
});

packer({
  log: true,
  input: input,
  minify: false,
  output: out + 'space-janitor.js',
  callback: function ( err, code ){
    err && console.log( err );
  }
});
