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
    game.data.score++; 
    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    // remove it
    me.game.world.removeChild(this);

    return false
  }
}
);


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
    this.maxX = 32000 - this.width;
    this.maxY = 32000 - this.height;
  },

  /*
   * update the player pos
   */
  update : function (dt) {
    me.collision.check(this);
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
    return true;
  }
});

/**
 * an enemy Entity
 */
game.EnemyEntity = me.Entity.extend({
  init: function (x, y, settings) {
    // define this here instead of tiled
    settings.image = "black_enemy";

    // save the area size defined in Tiled
    var width = 128;
    var height = 128;

    // adjust the size setting information to match the sprite size
    // so that the entity object is created with the right size
    settings.framewidth = settings.width = 128;
    settings.frameheight = settings.height = 128;

    // redefine the default shape (used to define path) with a shape matching the renderable
    settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);

    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.endX   = x + width - settings.framewidth
    this.pos.x  = x + width - settings.framewidth;

    // to remember which side we were walking
    this.walkLeft = false;

    // walking & jumping speed
    this.body.setVelocity(4, 6);

  },

  /**
   * update the enemy pos
   */
  update : function (dt) {

    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
      }
      else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
      }

      // make it walk
      this.renderable.flipX(this.walkLeft);
      this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    }
    else {
      this.body.vel.x = 0;
    }

    // update the body movement
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
        this.renderable.flicker(750);
      }
      return false;
    }
    // Make all other objects solid
    return true;
  }
});