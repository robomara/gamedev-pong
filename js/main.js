// Single state game

var gameStarted;
var paddle1;
var paddle2;

var GameState = {

	preload: function(){
		// images
		game.load.image('background', 'assets/background.png');
		game.load.image('background2', 'assets/background2.png');
		game.load.image('paddle', 'assets/player.png');
		game.load.image('ball', 'assets/ball.png');

		// fonts
		game.load.bitmapFont('font','assets/font/font.png','assets/font/font.xml');

		// audio
		game.load.audio('hit',['assets/sounds/sfx_laser1.ogg','assets/sounds/sfx_laser1.wav']); 

	},

	create: function(){

   		// Load background
		game.add.sprite(0, 0, 'background');
		game.add.sprite(5, 5, 'background2');
		

		// reset bool
		gameStarted = false;
		ballVelocity = 500;
		ballLaunched = false;

		if (!gameStarted){
			startText = game.add.bitmapText(game.world.centerX,game.world.centerY,'font',"Click to Start",64);
			startText.anchor.setTo(0.5,0.5);
		}
		

		game.sound.mute = true;

	},

	update: function(){


		if(gameStarted){

			// move paddles
			controlPaddle(paddle1,game.input.y);
			//paddle2.y = game.world.height-paddle1.y;

			// initiate collisions
			game.physics.arcade.collide(paddle1,ball,function(){
				game.sound.play('hit')
			});
			game.physics.arcade.collide(paddle2,ball,function(){
				game.sound.play('hit')
			});


			// collision logic
			if (ball.body.blocked.left){
				score2++;
			}
			else if (ball.body.blocked.right){
				score1++;
			}

			paddle2.body.velocity.setTo(ball.body.velocity.y);
			paddle2.body.velocity.x = 0;
			paddle2.body.maxVelocity.y = 200;

			score1Text.text = score1;
			score2Text.text = score2;


			if(score2 == 7){
				gameover();
			}
			else if(score1 == 7){
				win();
			}
		}
		else if(!gameStarted){
			game.input.onDown.addOnce(restart,this);
		}
	}
};

// Initiate phaser framwork
var game = new Phaser.Game(800, 400, Phaser.AUTO);
game.state.add('GameState',GameState);
game.state.start('GameState');


function createPaddle(x,y){
	var paddle = game.add.sprite(x,y,'paddle');
	paddle.anchor.setTo(0.5,0.5);
	game.physics.arcade.enable(paddle);
	paddle.body.collideWorldBounds = true;
	paddle.body.immovable = true; 
	paddle.scale.setTo(0.2,1);

	return paddle;
}

function controlPaddle(paddle,y){

	paddle.y = y;
	if (paddle.y < paddle.height/2+5){
		paddle.y = paddle.height/2+5;
	}
	else if (paddle.y > game.world.height - paddle.height/2-5){
		paddle.y = game.world.height - paddle.height/2-5;
	}	
}

function createBall(x,y){
	var ball = game.add.sprite(x,y,'ball');
	ball.anchor.setTo(0.5)
	game.physics.arcade.enable(ball);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(1,1);

	return ball;
}

function moveBall(){
	if(ballLaunched){
		ball.x = game.world.centerX;
		ball.y = game.world.centerY;
		ball.body.velocity.setTo(0,0);
		ballLaunched = false;

		// should also reset paddle2
		paddle2.y = game.world.centerY
	}
	else{
		if(Math.random()>0.5){
			ball.body.velocity.x = -ballVelocity;
		}
		else {
			ball.body.velocity.x = ballVelocity;
		}
		if(Math.random()>0.5){
			ball.body.velocity.y = -ballVelocity;
		}
		else {
			ball.body.velocity.y = ballVelocity;
		}
		ballLaunched = true;
	}

}

function gameover(){
	paddle1.destroy();
	paddle2.destroy();
	ball.destroy();

	gameOverText = game.add.bitmapText(game.world.centerX,game.world.centerY,'font',"Game Over",64);
	resetText = game.add.bitmapText(game.world.centerX,game.world.centerY+32,'font',"Click to Reset",32);
	gameOverText.anchor.setTo(0.5,0.5);
	resetText.anchor.x = 0.5;

	gameStarted = false;
	ballLaunched = false;

}

function win(){
	paddle1.destroy();
	paddle2.destroy();
	ball.destroy();

	winText = game.add.bitmapText(game.world.centerX,game.world.centerY,'font',"Win",64);
	resetText = game.add.bitmapText(game.world.centerX,game.world.centerY+32,'font',"Click to Reset",32);
	winText.anchor.setTo(0.5,0.5);
	resetText.anchor.x = 0.5;

	gameStarted = false;
	ballLaunched = false;
}

function restart(){
	game.world.removeAll();

	// Load background
	game.add.sprite(0, 0, 'background');
	game.add.sprite(5, 5, 'background2');

	gameStarted = true;
	// generate paddles
	paddle1 = createPaddle(25,game.world.centerY);
	paddle2 = createPaddle(game.world.width-25,game.world.centerY);

	// load ball
	ball = createBall(game.world.centerX,game.world.centerY)
	
	moveBall();

	score1 = "0";
	score2 = "0";

	score1Text = game.add.bitmapText(10,10,'font',score1,64);
	score2Text = game.add.bitmapText(game.width - 10,10,'font',score2,64);
	score2Text.anchor.x =1;
}

