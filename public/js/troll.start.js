require(['js/troll', 'js/utils', 'js/box2d/world'], function (Troll,Utils, World) {
  var Trolls = function() {
    this.canvas = document.getElementById('stage');
    this.ctx = this.canvas.getContext('2d');
    this.debugC = document.getElementById('debug');

    this.elements = {};
    this.count = 0;
    this.resize();
    var self = this;
    window.onresize = function(){
      self.resize();
    };
    this.boxWorld = new World({
      width: this.canvas.width,
      height: this.canvas.height,
      canvasW: this
    });
    this.init();
  };
  Trolls.prototype.update = function(e) {
    for (var id in e) {
      var entity = this.elements[id];
      if (entity) entity.update(e[id]);
    }
  }
  Trolls.prototype.addBody = function(x,y) {
    this.count++;
    var parts = [
      new Troll({id: this.count+'-head', radius: 2}),
      new Troll({id: this.count+'-tail', radius: 5}),
      new Troll({id: this.count+'-tail2', radius: 5}),
      new Troll({id: this.count+'-tail3', radius: 5}),
      new Troll({id: this.count+'-tail4', radius: 5}),
      new Troll({id: this.count+'-tail5', radius: 5}),
      new Troll({id: this.count+'-tail6', radius: 5}),
      new Troll({id: this.count+'-tail7', radius: 5}),
      new Troll({id: this.count+'-tail8', radius: 5}),
      new Troll({id: this.count+'-tail9', radius: 5})
    ]
    for (var i = parts.length - 1; i >= 0; i --) {
      this.elements[parts[i].id] = parts[i];
    }
    this.boxWorld.createTroll(parts, x,y);
  };

  Trolls.prototype.init = function(){
    Utils.setAnimFrame();
    this.draw();
    this.addEvents();
    this.addBody(window.innerWidth / 2, 0);
  };
  Trolls.prototype.addEvents = function(){
    var self = this;
    document.onmousemove = function(e) {
      if (self.boxWorld) {
        console.log('setting target');
        self.boxWorld.setTarget(e.offsetX, e.offsetY);
      }
    }
    document.onmousedown = function(e) {
      //self.addBody(e.offsetX, e.offsetY);
    };
    var el = document.getElementsByTagName("canvas")[0];
    el.addEventListener('touchmove', function(e) {
      self.boxWorld.setTarget(e.touches[0].pageX,e.touches[0].pageY);
      e.preventDefault();
      //self.addBody(e.touches[0].pageX, e.touches[0].pageY);
    });
  };
  Trolls.prototype.resize = function(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.debugC.width = window.innerWidth;
    this.debugC.height = window.innerHeight;

  };

  Trolls.prototype.draw = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var id in this.elements) {
      this.elements[id].draw(this.ctx);
    }
    window.requestAnimFrame(function(){
      this.draw();
    }.bind(this));
  };

  var trolls = new Trolls();
});
