http = require("http");
url_n = "http://shtike.scriptrapps.io/Nasa/pulldata";
url_d = "http://shtike.scriptrapps.io/Nasa/resetdate";
var number;
var date;

http.get(url_n, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var values = JSON.parse(body);
        number = values.response.result;
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

http.get(url_d, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        var values = JSON.parse(body);
        date = values.response.result.year + "/" + values.response.result.month + "/" + values.response.result.day;
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

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
        for (i = 0; i < number; i++) me.game.world.addChild(me.pool.pull("AsteroidEntity", Math.random() * 32000, Math.random() * 32000));




        // reset the score
        game.data.score = 0;
        game.date = date; 

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
