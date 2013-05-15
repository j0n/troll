define(function(require) {
  var Box2D = require('/lib/box2dweb.min.js');
    var World = function(settings, canvasW){
        this.canvas = {};
        this.ground = null;
        this.mouseJoint = null;
        this.canvas.width = settings.width;
        this.canvas.height = settings.height;
        this.canvasW = settings.canvasW;
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
             1 / 60   //frame-rate
          ,  10       //velocity iterations
          ,  10       //position iterations
      );
      if (this.debug){
        this.world.DrawDebugData();
      }
      this.sendUpdate();
      this.world.ClearForces();
    }
    World.prototype.sendUpdate = function(){
      var world = {};
      for (var b = this.world.GetBodyList(); b; b = b.m_next) {
        if (typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
          world[b.GetUserData()] = {x: b.GetPosition().x, y: b.GetPosition().y, a: b.GetAngle()};
        }
      }
      this.canvasW.update(world);
    };
    World.prototype.line = function(){
      // Create Power Line
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
      var b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
          b2Body = Box2D.Dynamics.b2Body, 
          b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, 
          b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
      var fixDef = new b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 1.0;
      fixDef.restitution = 0.5;
      //fixDef.filter.groupIndex = -1;
      // 2. Body Definition: defines where in the world the object is, and if it is dynamic or static.
      var bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_dynamicBody;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape = new b2CircleShape( 2 );

      return { bodyDef: bodyDef, fixDef: fixDef}
    }
    World.prototype.circle = function(radius) {
        var b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2Body = Box2D.Dynamics.b2Body, 
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, 
            b2RopeJointDef = Box2D.Dynamics.Joints.b2RopeJointDef,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
         var bodyDef = new b2BodyDef;
         var fixDef = new b2FixtureDef;
         fixDef.shape = new b2CircleShape(
           radius * this.SCALE //radius
         );
         fixDef.velocity = 0.5;
         fixDef.density = 40.0;
         fixDef.friction = 0.5;
         fixDef.restitution = 0.2;

         bodyDef.type = b2Body.b2_dynamicBody;
         // create head
         return { bodyDef: bodyDef, fixDef: fixDef}
    }
    World.prototype.createTroll = function(parts, x,y){
        var b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2Body = Box2D.Dynamics.b2Body, 
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, 
            b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
            b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
            b2RopeJointDef = Box2D.Dynamics.Joints.b2RopeJointDef,
            b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
            prev = null;
            

         for (var i = 0, ii = parts.length; i <ii;i++) {
           var def = this.circle(parts[i].radius);
           var bodyDef = def.bodyDef;
           var fixDef = def.fixDef;
           bodyDef.userData = parts[i].id;
           bodyDef.position.x = x;
           if (prev != null) {
             y += parts[i].radius * 6;
           }
           bodyDef.position.y = y;
           var body = this.registerBody(bodyDef);
           body.CreateFixture(fixDef);
           if (prev != null) {
             var jointDef = new b2RopeJointDef();
             jointDef.bodyA = body;
             jointDef.bodyB = prev;
             jointDef.maxLength = 20;
             var rope11 = this.world.CreateJoint(jointDef);
           }
           else {
             var def = new b2MouseJointDef();
             def.bodyA = this.ground;
             def.bodyB = body;
             def.target = new this.b2Vec2(x,y);
             def.collideConnected = true;
             def.maxForce = 1000 * body.GetMass();
             def.dampingRatio = 0;
             this.mouseJoint = this.world.CreateJoint(def);
             body.SetAwake(true);
           }
           prev = body;
         }
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
         fixDef.velocity = 0.5;
         fixDef.density = 1.0;
         fixDef.friction = 0.5;
         fixDef.restitution = 0.2;

         bodyDef.position.x = x;
         bodyDef.position.y = y;
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
         this.ground = this.registerBody(bodyDef);
         this.ground.CreateFixture(fixDef);

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

    World.prototype.getBodyAtMouse = function(x,y) {
      var mouse_p = new b2Vec2(x, y);
      var aabb = new b2AABB();
      aabb.lowerBound.Set(x - 0.001, y - 0.001);
      aabb.upperBound.Set(x + 0.001, y + 0.001);

      function GetBodyCallback(fixture) {
        var shape = fixture.GetShape();
        if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
          var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);
          if (inside) {
            body = fixture.GetBody();
            return false;
          }
        }
        return true;
      }
      var body = null;
      this.world.QueryAABB(GetBodyCallback, aabb);
      return body;
    }
    World.prototype.setTarget = function(x,y) {
      var p = new this.b2Vec2(x, y);
      this.mouseJoint.SetTarget(p);
    }

    World.prototype.getReal = function(p) {
      return new this.b2Vec2(p.x + 0, this.canvas.height - p.y);
    };

    return World;
});
