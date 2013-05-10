define(function(){
  var Troll = function(body) {
    this.x = 80;
    this.y = 80;
    this.body = body;
    this.color = '#000000';
    this.radius = 2;
  };

  Troll.prototype.draw = function(ctx){
    var pos = this.body.GetPosition();
    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.arc(pos.x,pos.y,40,0,2*Math.PI);
    ctx.stroke();
  };

  return Troll;
});
