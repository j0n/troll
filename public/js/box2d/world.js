define(function(require) {
  var Box2D = require('/lib/box2dweb.min.js');
    var World = function(settings){
        this.canvas = {};
        this.canvas.width = settings.width;
        this.canvas.height = settings.height;
        this.objects = {};
        this.bodies = {};
        this.SCALE = 1;
        this.world = null;
        this.debug = false;
        console.log('hello world');
        this.init();
    }
    World.prototype.init = function(){
      this.createWorld();
      setInterval(function(){
         this.update();
      }.bind(this), 1/60);
    }

    World.prototype.update = function(){
      this.world.Step(
             1 / 40   //frame-rate
          ,  10       //velocity iterations
          ,  10       //position iterations
      );
      if (this.debug){
        this.world.DrawDebugData();
      }
      this.world.ClearForces();
    }
    World.prototype.createObject = function(x, y) {
        var b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2Body = Box2D.Dynamics.b2Body, 
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, 
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
         var bodyDef = new b2BodyDef;
         var fixDef = new b2FixtureDef;

         bodyDef.type = b2Body.b2_dynamicBody;
         bodyDef.userData = 'circle';
         fixDef.shape = new b2CircleShape(
           10 * this.SCALE //radius
         );
         fixDef.velocity = 100;
         bodyDef.position.x = x;
         bodyDef.position.y = y;
         bodyDef.density = 2;
         bodyDef.friction = 1;
         var body = this.registerBody(bodyDef);
         body.CreateFixture(fixDef);
         return { def: fixDef, body: body};
    }

    World.prototype.createWorld = function(){
        this.b2Vec2 = Box2D.Common.Math.b2Vec2;
        var b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef, 
            b2Body = Box2D.Dynamics.b2Body, 
            b2Fixture = Box2D.Dynamics.b2Fixture, 
            b2World = Box2D.Dynamics.b2World, 
            b2MassData = Box2D.Collision.Shapes.b2MassData, 
            b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, 
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, 
            b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
         
         this.world = new b2World(
               new this.b2Vec2(0, 10)    //gravity
            ,  true                 //allow sleep
         );
         var SCALE = this.SCALE;
         var fixDef = new b2FixtureDef;
         fixDef.density = 1;
         fixDef.friction = 0;
         fixDef.restitution = 1.00001;
         var bodyDef = new b2BodyDef;
       
         //create ground
         bodyDef.type = b2Body.b2_staticBody;
         
         // positions the center of the object (not upper left!)
         bodyDef.position.x = this.canvas.width / 2 / SCALE;
         bodyDef.position.y = this.canvas.height / SCALE;
         fixDef.shape = new b2PolygonShape;
         fixDef.shape.SetAsBox((this.canvas.width / SCALE) / 2, (10/SCALE) / 2);
         this.registerBody(bodyDef).CreateFixture(fixDef);

         //setup debug draw
         if (this.debug){
           var debugDraw = new b2DebugDraw();
           debugDraw.SetSprite(document.getElementById("debug").getContext("2d"));
           debugDraw.SetDrawScale(this.SCALE);
           debugDraw.SetFillAlpha(0.3);
           debugDraw.SetLineThickness(1.0);
           debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
           this.world.SetDebugDraw(debugDraw);
         }
         //this.addCollisionListner();
    }

    World.prototype.registerBody = function(bodyDef) {
        var body = this.world.CreateBody(bodyDef);
        this.bodies[body.GetUserData()] = body;
        return body;
    }
    return World;
});
