define(function(){
  var Troll = function(settings) {
    this.id = settings.id;
    this.radius = settings.radius;
    this.x = 0;
    this.y = 0;
    this.color = '#000000';
    this.head = settings.id.indexOf('head') > -1;
    if (this.head) {
      this.radius = this.radius * 4;
      this.image = new Image();
    }
  };
  Troll.prototype.update = function(state){
    this.x = state.x;
    this.y = state.y;
    //this.radus = state.radius;
  }

  Troll.prototype.draw = function(ctx){
    if (this.head) {
      var img=document.getElementById("scream");
      ctx.drawImage(img,10,10);
    }
    else {
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    }
  };
  return Troll;
});
