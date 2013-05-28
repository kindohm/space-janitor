
var packer = require( 'node.packer' ),
    path   = __dirname + '/../',
    src    = path + 'src/',
    out    = path + 'js/';

var input = [
  src + 'settings.js',
  src + 'spritefactory.js',
  src + 'player.js',
  src + 'bullet.js',
  src + 'game.js'
];


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
