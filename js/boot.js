// Single state game

var boot = function(game){
	console.log('Game Start');
}

boot.prototype = {
		preload: function(){
		this.game.load.image('background', 'assets/background.png');
		this.game.load.image('paddle', 'assets/player.png');
		this.game.load.image('ball', 'assets/ball.png');

		this.game.load.bitmapFont('font','assets/font/font.png','assets/font/font.xml');

		this.game.load.audio('hit',['assets/sounds/sfx_laser1.ogg','assets/sounds/sfx_laser1.wav']); 
	},

	create: function(){
		this.game.state.start("GameState");
	}

}