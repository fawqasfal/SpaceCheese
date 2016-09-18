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
    this.maxX = me.game.viewport.width - this.width;
  },

  /*
   * update the player pos
   */
  update : function (dt) {
    this.pos.y += this.velx * dt / 500 * Math.sin(this.renderable.angle - Math.PI / 2);
    this.pos.x += this.velx * dt / 500 * Math.cos(this.renderable.angle - Math.PI / 2);
    this._super(me.Sprite, "update", [dt]);
    if (me.input.isKeyPressed("left")) {
        this.renderable.angle -= 4 * (Math.PI / 180);
    }

    if (me.input.isKeyPressed("right")) {
        this.renderable.angle += 4 * (Math.PI / 180);
    }

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