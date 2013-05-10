define(function(){
  var Troll = function(body) {
    this.x = 80;
    this.y = 80;
    this.val = body;
    this.color = '#000000';
    this.radius = 2;
  };

  Troll.prototype.draw = function(ctx){
    var pos = this.val.body.GetPosition();
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(pos.x,pos.y,this.val.def.shape.GetRadius(),0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
  };
  return Troll;
});
