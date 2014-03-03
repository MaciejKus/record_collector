var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

enchant();
window.onload = function() {
	var game = new Core(320,320);
	game.fps = 16;
	game.preload('map0.png','chara0.png');
	game.onload = function() {
		var bg = new Sprite(320,320);
		var maptip = game.assets['map0.png'];
		var image = new Surface(320,320);
		for (var j = 0; j < 320; j+=16) {
			for (var i = 0; i < 320; i +=16) {
				image.draw(maptip, 0,0,16,16,i,j,16,16);	
			}
		}
		bg.image=image;
		game.rootScene.addChild(bg);
		var girl = new Sprite(32,32);
		girl.image = game.assets['chara0.png'];
		girl.x = 160-16;
		girl.y = 160 - 16;
		girl.frame = 7;
		girl.toX = girl.x;
		girl.toY = girl.y;
		girl.dir = DIR_DOWN;
		girl.anim = [
			15,16,17,16, //left
			24, 25, 26, 24, //right
			33, 34, 35, 34, //up
			6,7,8,7]; // down
		game.rootScene.addChild(girl);
		girl.addEventListener(Event.ENTER_FRAME, function() {
			if (girl.y > girl.toY) {
				girl.dir = DIR_UP;
				if (Math.abs(girl.y-girl.toY) < 3) {
					girl.y=girl.toY;
				} else {
					girl.y -= 3;
				}
			}
			else if (girl.y < girl.toY) {
				girl.dir = DIR_DOWN;
				if (Math.abs(girl.y-girl.toY) < 3) {
					girl.y=girl.toY;
				} else {
					girl.y +=3;
				}
			}
			if (girl.x > girl.toX) {
				girl.dir = DIR_LEFT;
				if (Math.abs(girl.x - girl.toX) < 3) {
					girl.x = girl.toX;
				} else {
					girl.x -= 3;}
				} else if (girl.x < girl.toX) {
				girl.dir = DIR_RIGHT;
				if (Math.abs(girl.x- girl.toX) < 3) {
					girl.x = girl.toX;
				} else {girl.x += 3;}
			}
		if (girl.x== girl.toX && girl.y == girl.toY) girl.age=1; 
		girl.frame = girl.anim[girl.dir*4+ (girl.age%4)];
		});

		bg.addEventListener(Event.TOUCH_START,function(e) {
			girl.toX = e.x -16;
			girl.toY = e.y-16;
		});
		bg.addEventListener(Event.TOUCH_MOVE, function(e) {
			girl.toX = e.x -16;
			girl.toY = e.y -16;
		});	

		
	};
	game.start();
};


