require(['js/troll', 'js/utils', 'js/box2d/world'], function (Troll,Utils, World) {
  var Trolls = function() {
    this.canvas = document.getElementById('stage');
    this.ctx = this.canvas.getContext('2d');
    this.debugC = document.getElementById('debug');

    this.elements = [];
    this.resize();
    var self = this;
    window.onresize = function(){
      self.resize();
    };
    this.boxWorld = new World({
      width: this.canvas.width,
      height: this.canvas.height
    });
    this.init();
  };
  Trolls.prototype.addBody = function(x,y) {
      var body = this.boxWorld.createObject(x,y);
      this.elements.push(new Troll(body));
  };

  Trolls.prototype.init = function(){
    Utils.setAnimFrame();
    this.draw();
    this.addEvents();
  };
  Trolls.prototype.addEvents = function(){
    var self = this;
    document.onmousedown = function(e) {
      self.addBody(e.offsetX, e.offsetY);
    };
    var el = document.getElementsByTagName("canvas")[0];
    el.addEventListener('touchstart', function(e) {
      self.addBody(e.touches[0].pageX, e.touches[0].pageY);
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
    for (var i = this.elements.length - 1; i >= 0; i --) {
      this.elements[i].draw(this.ctx);
    }
    window.requestAnimFrame(function(){
      this.draw();
    }.bind(this));
  };

  var trolls = new Trolls();
});
