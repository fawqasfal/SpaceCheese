game.Laser = me.Entity.extend({
    init : function (x, y) {
        this._super(me.Entity, "init", [x, y, { width: game.Laser.width, height: game.Laser.height }]);
        this.z = 5;
        this.velx = 600;
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.renderable = new (me.Renderable.extend({
            init : function () {
                this._super(me.Renderable, "init", [0, 0, game.Laser.width, game.Laser.height]);
            },
            destroy : function () {},
            draw : function (renderer) {
                var color = renderer.globalColor.toHex();
                renderer.setColor('#5EFF7E');
                renderer.fillRect(0, 0, this.width, this.height);
                renderer.setColor(color);
            }
        }));
        this.alwaysUpdate = true;
    },

    update : function (time) {
        console.log(this.pos.y);
        var angle = me.game.LaserAngle;
        this.pos.y += this.velx * Math.sin(angle - Math.PI / 2);
        this.pos.x += this.velx * Math.cos(angle - Math.PI / 2);
        if (this.pos.y + this.height <= 0 || this.pos.x + this.height <= 0 || this.pos.y - this.height >= 32000 || this.pos.x - this.height >= 32000) {
            me.game.world.removeChild(this);
        }


        this.body.update();
        me.collision.check(this);

        return true;
    }
});

game.Laser.width = 5;
game.Laser.height = 28;