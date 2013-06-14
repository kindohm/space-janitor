;(function(exports){

  var ViewModelUtils = function(){ };

  ViewModelUtils.prototype = {

    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    padDigit: function(digit){
      return digit.toString().length === 1 ? '0' + digit.toString() : digit.toString();
    },

    mapDifficulty: function(diff){

      if (diff === 0) return 'FREE';
      else if (diff === 1) return 'EASY';
      else if (diff === 2) return 'NORMAL';
      else if (diff === 3) return 'HARD';
      else if (diff === 4) return 'INSANE';

    },

    getDateDisplay: function(date){
      var mins = this.padDigit(date.getMinutes());
      var hrs = this.padDigit(date.getHours());
      var month = this.padDigit(date.getMonth());
      var day = this.padDigit(date.getDate());
      return date.getFullYear() + "-" + month + "-" + day + " " + hrs + ":" + mins;
    },

    numberWithCommas: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  exports.ViewModelUtils = ViewModelUtils;

})(this);