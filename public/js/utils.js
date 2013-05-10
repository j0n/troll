define(function(){
  var Utils = {
    setAnimFrame : function(){
      window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback,  element){
            window.setTimeout(callback, 1000 / 60);
          };
      })();
    }
  };
  return Utils;
});
