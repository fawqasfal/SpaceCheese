/**
 * a Cheese entity
 */
game.CheeseEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , {image : "cheese.png", width : 64, height : 64}]);

  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected
    response.a.ammo += 1;
    if (response.a.body.collisionType == me.collision.types.PLAYER_OBJECT) game.data.score++; 
    this.pos.x = Math.floor(Math.random() * 32000);
    this.pos.y = Math.floor(Math.random() * 32000);

    return false
  }
}
);
/**
 * a Cheese entity
 */
game.AsteroidEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , {image : "asteroid.png", width : 128, height : 128}]);
    this.body.setVelocity(7, 7);
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
    this.alwaysUpdate = true; 
  },
  update: function(time) {
    this.renderable.angle += 5 * (Math.PI/ 180);
    var xMult = Math.random() > 0.5 ? 1 : 0;
    var yMult = Math.random() > 0.5 ? 1 : 0;
    this.body.vel.y += yMult * this.body.accel.y * time / 1000;
    this.body.vel.x += xMult * this.body.accel.x * time / 1000;
    if (this.pos.y < 0) this.pos.y = 32000;
    if (this.pos.y > 32000) this.pos.y = 0;
    if (this.pos.x < 0) this.pos.x = 32000;
    if (this.pos.x > 32000) this.pos.x = 0;
    this.body.update();
    me.collision.check(this);
    return true;
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected
    if (response.a.body.collisionType == me.collision.types.PLAYER_OBJECT) {
      response.a.pos.x = Math.floor(Math.random() * 32000);
      response.a.pos.y = Math.floor(Math.random() * 32000);
    }
    return true;
  }
}
);

game.EnemyEntity = me.Entity.extend({
  init: function(x, y, settings) {
    this._super(me.Entity, 'init', [x, y, {image: "white_enemy.png", width : 71, height : 128}]);
    this.ammo = 0;
  }, 

  onCollision : function ( response, other) {
      

  }

})

/**
 * a player entity
 */

game.PlayerEntity = me.Entity.extend({
  /**
   * constructor
   */ 
  init : function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set the default horizontal & vertical speed (accel vector)
    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    me.game.viewport.setDeadzone(0,0);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    this.renderable.addAnimation("stand",  [0]);

    // set the standing animation as default
    this.renderable.setCurrentAnimation("stand");
    this.velx = 450;
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    this.maxX = 32000 - this.width;
    this.maxY = 32000 - this.height;
    this.ammo = 0;
  },

  /*
   * update the player pos
   */
  update : function (dt) {
    me.collision.check(this);
    game.LaserAngle = this.renderable.angle; 
    this.pos.y += this.velx * dt / 700 * Math.sin(this.renderable.angle - Math.PI / 2);
    this.pos.x += this.velx * dt / 700 * Math.cos(this.renderable.angle - Math.PI / 2);
    this._super(me.Sprite, "update", [dt]);
    if (me.input.isKeyPressed("left")) {
        this.renderable.angle -= 2 * (Math.PI / 180);
    }


    if (me.input.isKeyPressed("right")) {
        this.renderable.angle += 2 * (Math.PI / 180);
    }
    this.pos.x = this.pos.x.clamp(0, this.maxX);
    this.pos.y = this.pos.y.clamp(0, this.maxY);

    return true;
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    // Make all other objects solid
    if (response.a.body.collisionType == me.collision.types.ACTION_OBJECT)
    { 
      this.ammo = Math.floor(this.ammo / 2);
      game.data.score = this.ammo;
    }
    return true;
  }
});
