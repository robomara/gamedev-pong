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

		startText = game.add.bitmapText(game.world.centerX,game.world.centerY,'font',"Click to Start",64);
		startText.anchor.setTo(0.5,0.5);
		game.input.onDown.addOnce(restart,this);


		//game.sound.mute = true;

	},

	update: function(){


		if(gameStarted){

			// move paddles
			controlPaddle(paddle1,game.input.y);

			// initiate collisions
			game.physics.arcade.collide(paddle1,ball);
			game.physics.arcade.collide(paddle2,ball);


			// collision logic
			if (ball.body.blocked.left){
				score2++;
				moveBall();
			}
			else if (ball.body.blocked.right){
				score1++;
				moveBall();
			}

			// 'AI'
			paddle2.body.velocity.setTo(ball.body.velocity.y);
			paddle2.body.velocity.x = 0;
			paddle2.body.maxVelocity.y = 200;

			// score calculations
			score1Text.text = score1;
			score2Text.text = score2;

			// test for win/fail condition
			if(score2 == 3){
				gameover();
			}
			else if(score1 == 3){
				win();
			}

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


function gameover(){
	paddle1.destroy();
	paddle2.destroy();
	ball.visible = false;


	gameOverText = game.add.bitmapText(game.world.centerX,game.world.centerY,'font',"Game Over",64);
	resetText = game.add.bitmapText(game.world.centerX,game.world.centerY+32,'font',"Click to Reset",32);
	gameOverText.anchor.setTo(0.5,0.5);
	resetText.anchor.x = 0.5;

	gameStarted = false;
	ballLaunched = false;

	game.input.onDown.addOnce(restart,this);
}

function win(){
	paddle1.destroy();
	paddle2.destroy();
	ball.visible = false;

	winText = game.add.bitmapText(game.world.centerX,game.world.centerY,'font',"Win",64);
	resetText = game.add.bitmapText(game.world.centerX,game.world.centerY+32,'font',"Click to Reset",32);
	winText.anchor.setTo(0.5,0.5);
	resetText.anchor.x = 0.5;

	gameStarted = false;
	ballLaunched = false;

	game.input.onDown.addOnce(restart,this);
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
	

	score1 = "0";
	score2 = "0";

	score1Text = game.add.bitmapText(10,10,'font',score1,64);
	score2Text = game.add.bitmapText(game.width - 10,10,'font',score2,64);
	score2Text.anchor.x =1;

	paddle1.body.onCollide = new Phaser.Signal();
    paddle1.body.onCollide.add(rebound, this);

    paddle2.body.onCollide = new Phaser.Signal();
    paddle2.body.onCollide.add(rebound, this);
}


function rebound(paddle){
	//game.sound.play('hit');
	ballVelocity += 100;
	ball.body.velocity.x = ((paddle.x < ball.x) * 2 - 1) * Math.sqrt(2) * ballVelocity * Math.cos(Math.PI*(ball.y - paddle.y)/200);
	ball.body.velocity.y = ballVelocity * Math.sin(Math.PI*(ball.y - paddle.y)/200);
}


function launch(){

	ballVelocity = 500;
	direction = Math.random()/1.5 * Math.PI;

	ball.body.velocity.x = ballVelocity * Math.sin(direction) * ((Math.random() < Math.random()) * 2 - 1);
	ball.body.velocity.y = ballVelocity * Math.cos(direction) * ((Math.random() < Math.random()) * 2 - 1);
	ballLaunched = true;
}


function moveBall(){
	if(ballLaunched){
		ball.x = game.world.centerX;
		ball.y = game.world.centerY;
		ball.body.velocity.setTo(0,0);
		ballLaunched = false;
		// should also reset paddle2
		paddle2.y = game.world.centerY;
	}

	game.input.onDown.addOnce(launch,this);
}


function createBall(x,y){
	var ball = game.add.sprite(x,y,'ball');
	ball.anchor.setTo(0.5)
	game.physics.arcade.enable(ball);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(1,1);
	game.input.onDown.addOnce(launch,this);
	return ball;
}