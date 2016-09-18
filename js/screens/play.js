game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // load a level
        me.levelDirector.loadLevel("area02");
        me.pool.register("CheeseEntity", game.CheeseEntity);
        me.pool.register("EnemyEntity", game.EnemyEntity);
        me.pool.register("AsteroidEntity", game.AsteroidEntity);
        random_xy = [];
        for (i = 0; i < 1600; i++) {
            me.game.world.addChild(me.pool.pull("CheeseEntity", Math.random() * 32000, Math.random() * 32000));
        }
        for (i = 0; i < 125; i++) me.game.world.addChild(me.pool.pull("AsteroidEntity", Math.random() * 32000, Math.random() * 32000));




        // reset the score
        game.data.score = 0;

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 3);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
