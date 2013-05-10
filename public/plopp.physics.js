if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
// if Box2D not globaly loaded a.k.a if not client side
//
// Game physics
//
define(function(require){
  // dependecies
  var Box2D = require('../box2dweb.min.js');
  var Player = require('./plopp.player.js');
  var Wall = require('./plopp.wall.js');

  var Plopp = function(settings){
      this.debug = settings.debug || false;
      this.canvas = {};
      this.canvas.width = settings.width;
      this.canvas.height = settings.height;
      this.objects = {};
      this.bodies = {};
      this.world = null;
      this.SCALE = 10;
      this.power = 4 * this.SCALE;
      this.MAX_VELOCITY = 3;
      this.players = {};
      this.init();
    }

    Plopp.prototype.init = function(){
      this.createWorld();
      if (this.debug){
        setInterval(function(){
           this.update();
        }.bind(this), 1/60);
      }
    }

    Plopp.prototype.update = function(){
      this.world.Step(
             1 / 60   //frame-rate
          ,  10       //velocity iterations
          ,  10       //position iterations
      );
      if (this.debug){
        this.world.DrawDebugData();
      }
      this.world.ClearForces();
    }
    Plopp.prototype.createWorld = function(){
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
             new this.b2Vec2(0, 0)    //gravity
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
       
       //create roof
       bodyDef.type = b2Body.b2_staticBody;
       bodyDef.position.x = this.canvas.width / 2 / SCALE;
       bodyDef.position.y = 0;
       fixDef.shape = new b2PolygonShape;
       fixDef.shape.SetAsBox((this.canvas.width / SCALE) / 2, (10/SCALE) / 2);
       this.registerBody(bodyDef).CreateFixture(fixDef);

       // create balll
       bodyDef.type = b2Body.b2_dynamicBody;
       bodyDef.userData = 'ball';
       fixDef.shape = new b2CircleShape(
         0.1 * this.SCALE //radius
       );

       bodyDef.position.x = 5;
       bodyDef.position.y = 2;
       this.ball = this.registerBody(bodyDef);
       this.ball.CreateFixture(fixDef);
       bodyDef.userData = 'zero';

       this.createPlayer('player1', 250);
       this.createPlayer('player2', this.canvas.width * this.SCALE * 2 -250);

       this.createWall(true, this.players['player2'], this.players['player1']);
       this.createWall(false, this.players['player1'], this.players['player2']);

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
       this.addCollisionListner();
    }
    Plopp.prototype.registerBody = function(bodyDef) {
      var body = this.world.CreateBody(bodyDef);
      this.bodies[body.GetUserData()] = body;
      return body;
  }
    Plopp.prototype.addCollisionListner = function(){
       var listener = new Box2D.Dynamics.b2ContactListener;
       listener.BeginContact = function(contact) {
         var a = contact.GetFixtureA().GetBody().GetUserData();
         var b = contact.GetFixtureB().GetBody().GetUserData();
         if (a !== null && typeof a !== 'undefined'){
           if (this.objects[a] !== null && typeof this.objects[a] !== 'undefined'){
             if (this.objects[a].type == 'wall'){
              this.objects[a].hit();
             }
           }
         }
         if (this.objects[b] !== null && typeof this.objects[b] !== 'undefined'){
           if (this.objects[b].hit !== null && typeof this.objects[b].hit !== 'undefined'){
              this.objects[b].hit();
           }
         }
       }.bind(this);
       this.world.SetContactListener(listener);
    }
    Plopp.prototype.start = function(){
      var degrees = 110;
      this.ball.ApplyImpulse(
                    new this.b2Vec2(
                      Math.cos(degrees * (Math.PI / 180)) * this.power *4,
                      Math.sin(degrees * (Math.PI / 180)) * this.power *4
                    ),
                    this.ball.GetWorldCenter()
                  );
    }
    Plopp.prototype.createWall = function(left, winner, looser){
      var b2BodyDef = Box2D.Dynamics.b2BodyDef,
          b2FixtureDef = Box2D.Dynamics.b2FixtureDef, 
          b2Body = Box2D.Dynamics.b2Body,
          b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, 
          fixDef = new b2FixtureDef,
          bodyDef = new b2BodyDef;

      var id = 'leftWall';
      bodyDef.type = b2Body.b2_staticBody;
      bodyDef.position.y = this.canvas.height / 2 / this.SCALE;
      fixDef.friction = 0.1;
      fixDef.shape = new b2PolygonShape;
      if (left){
        bodyDef.position.x = 0 / this.SCALE;
      }
      else {
        //create right wall
        id = 'rightWall';
        bodyDef.position.x = this.canvas.width / this.SCALE;
      }
      fixDef.shape.SetAsBox((10/this.SCALE) / 2, (this.canvas.height / this.SCALE) / 2);
      bodyDef.userData = id;
      this.objects[id] = new Wall(id, winner.win.bind(winner), looser.death.bind(looser));
      this.registerBody(bodyDef).CreateFixture(fixDef);
    }

    Plopp.prototype.createPlayer = function(playerId, _x){
      var b2BodyDef = Box2D.Dynamics.b2BodyDef,
          b2FixtureDef = Box2D.Dynamics.b2FixtureDef, 
          b2Body = Box2D.Dynamics.b2Body,
          b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, 
          fixDef = new b2FixtureDef,
          bodyDef = new b2BodyDef;

       this.objects[playerId] = new Player(playerId, this);
       this.players[playerId] = this.objects[playerId];
       fixDef.friction = 1.1;
       fixDef.density = 11400;
       fixDef.restitution = 1.20001;
       fixDef.linearDamping = 0.1;
       bodyDef.userData = playerId;
       bodyDef.type = b2Body.b2_dynamicBody;
       bodyDef.position.x = _x / 20 / this.SCALE;
       bodyDef.position.y = this.canvas.height / 2 / this.SCALE;
       fixDef.shape = new b2PolygonShape;
       fixDef.shape.SetAsBox((5/this.SCALE) / 2, (50 / this.SCALE) / 2);
       var body = this.registerBody(bodyDef);
       body.SetFixedRotation(true);
       body.CreateFixture(fixDef);
    }
    Plopp.prototype.stopPlayer1 = function(){
        this.player1.SetLinearVelocity(new this.b2Vec2(0,0));
    }
    Plopp.prototype.movePlayer = function(id, up){
      var player = this.bodies[id];
      vel = player.GetLinearVelocity();
      if (up === true){
        var direction = 90;
        if (vel.y >= 0){
          vel.y = -this.power/2;
        }
        else if(vel.y > 4){
          vel.y = vel.y/4;
        }
        player.SetLinearVelocity(new this.b2Vec2(0, vel.y-.5));
      }
      else {
        var direction = -90;
        if (vel.y <= 0){
          vel.y = this.power/2;
        }
        player.SetLinearVelocity(new this.b2Vec2(0, vel.y+.5));
      }
      var power = 50;
      var pos = player.GetPosition();

      //this.player1.SetPosition(new this.b2Vec2(pos.x, pos.y+direction));
      //this.player1.ApplyImpulse(
                    //new this.b2Vec2(
                      //Math.cos(direction * (Math.PI / 180)) * power,
                      //Math.sin(direction * (Math.PI / 180)) * power
                    //),
                    //this.player1.GetWorldCenter()
                  //);
    }
    Plopp.prototype.setBallPosition = function(x, y, vx, vy){
      var b2 = new this.b2Vec2(x, y);
      var vel = new this.b2Vec2(vx, vy);
      this.ball.SetPosition(b2);
      this.ball.SetLinearVelocity(vel);
    }
    return function(debug) {
      return new Plopp(debug);
    }
  }
);
      
