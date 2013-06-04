;(function(exports){

  var SoundBus = function(soundsPath){

    this.asteroidExplosionSound = new Howl({
      urls: [
        soundsPath + 'explosion01.mp3', 
        soundsPath + 'explosion01.ogg'
      ],
      volume: 0.5
    });    

    this.playerExplosionSound = new Howl({
      urls: [
        soundsPath + 'explosion02.mp3', 
        soundsPath + 'explosion02.ogg'
      ],
      volume: 0.9
    });  

    this.thrustSound = new Howl({
      urls: [
        soundsPath + 'thrust.mp3', 
        soundsPath + 'thrust.ogg'],
      volume: .5,
      loop: true
    });

    this.gunSound = new Howl({
      urls: [
        soundsPath + 'gun.mp3', 
        soundsPath + 'gun.ogg'],
      volume: 0.5
    });    

    this.ufoSound = new Howl({
      urls: [
        soundsPath + 'ufo.mp3', 
        soundsPath + 'ufo.ogg'],
      volume: 0.7,
      loop: true
    });    

    this.oneUpSound = new Howl({
      urls: [
        soundsPath + 'oneup.mp3', 
        soundsPath + 'oneup.ogg'],
      volume: 0.7,
      loop: false
    });    

    this.radialBlastSound = new Howl({
      urls: [
        soundsPath + 'radialblast.mp3', 
        soundsPath + 'radialblast.ogg'],
      volume: 0.5,
      loop: false
    });    

    this.pauseSound = new Howl({
      urls: [
        soundsPath + 'pause.mp3', 
        soundsPath + 'pause.ogg'],
      volume: 0.7,
      loop: false
    });    

    this.powerupHumSound = new Howl({
      urls: [
        soundsPath + 'poweruphum.mp3', 
        soundsPath + 'poweruphum.ogg'],
      volume: 0.4,
      loop: true
    });    

  };

  SoundBus.prototype = {

  };

  exports.SoundBus = SoundBus;
})(this);