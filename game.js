var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

//where hero starts minus 16
var hero_start_x=100;
var hero_start_y = 110;

//how much sprite images are ofset
var offy= 28;
var offx = 16;

//checks for collisions in terms of y and x for hero
var girl_x_old= -1;
var girl_y_old = -1;
var map_x_old = -999;
var map_y_old = -999;


enchant();
window.onload = function() {
	var game = new Core(320,320);
	game.fps = 16;
	game.preload('map0.png','chara0.png');
	game.onload = function() {
		//map stuff. variables layer1, layer2 and collision can be found in map.js
		var map = new Map(16,16);
		map.image = game.assets['map0.png'];
		map.loadData(layer1,layer2);
		map.collisionData = collision;
		//hero stuff
		var girl = new Sprite(32,32);
		girl.image = game.assets['chara0.png'];
		girl.x = hero_start_x-offx;
		girl.y = hero_start_y - offy;
		girl.frame = 7;
		girl.toX = girl.x;
		girl.toY = girl.y;
		girl.dir = DIR_DOWN;
		girl.anim = [
			15,16,17,16, //left
			24, 25, 26, 24, //right
			33, 34, 35, 34, //up
			6,7,8,7]; // down


		//compared x y of hero to x y of last mouse click, if difference is large enough, hero x y change twords mouse click.
		girl.addEventListener(Event.ENTER_FRAME, function() {
			if (girl.y > girl.toY) {
				girl.dir = DIR_UP;
				//if mouse click and hero are close enough together, just move hero to where mouseclick happened:
				if (Math.abs(girl.y-girl.toY) < 4) {
					girl.y=girl.toY;
				} else if (girl.y<game.width/3 && map.y<0 && (map.hitTest(girl.x + offx+Math.abs(map.x), girl.y+offy+Math.abs(map.y)) == 0)) {
					map.y+=4;
					girl.toY+=4;
				} else {
				//if mouse click location and hero location are not close to one another move hero by certain amount towards mouse click (on y axis):
					girl.y -= 4;
				//if there is a collision undo the move made above. basically the hero did not move in the y direction:
				//the Math.abs(map.y) and Math.abs(map.x) parts account for map scrolling.
				//it is abs because the map is technically moved in the negative direction, but we are looking
				//at the hero's location, which means the hero has moved in the positive direction (relative to the map)
					if (map.hitTest(girl.x + offx+Math.abs(map.x), girl.y+offy+Math.abs(map.y))) girl.y +=4;
				}
			}
			else if (girl.y < girl.toY) {
				girl.dir = DIR_DOWN;
				if (Math.abs(girl.y-girl.toY) < 4) {
					girl.y=girl.toY;
				} else if (girl.y>game.height -(game.height/3) && map.height+map.y>game.height && (map.hitTest(girl.x + offx+Math.abs(map.x), girl.y+offy+Math.abs(map.y)) == 0)){
				map.y -= 4;
				girl.toY -=4;
				}
				else {
					girl.y +=4;
					if (map.hitTest(girl.x + offx+Math.abs(map.x), girl.y+offy +Math.abs(map.y))) girl.y -=4;
				}
			}
			if (girl.x > girl.toX) {
				girl.dir = DIR_LEFT;
				if (Math.abs(girl.x - girl.toX) < 4) {
					girl.x = girl.toX;
				} else if (girl.x<(game.width/3) && map.x<0 && (map.hitTest(girl.x + offx+Math.abs(map.x), girl.y+offy+Math.abs(map.y)) == 0)) {
					map.x+=4;
					girl.toX +=4;
				} else {
					girl.x -= 4;
					if (map.hitTest(girl.x + offx +Math.abs(map.x), girl.y+offy+Math.abs(map.y))) girl.x +=4;}
				 }
			else if (girl.x < girl.toX) {
				girl.dir = DIR_RIGHT;
					if (Math.abs(girl.x- girl.toX) < 4) {
						girl.x = girl.toX;
					//checks to see how far to the right of the window (game) the hero is and if there is any map left unseen to the right and that there are no collisions taking place:
					} else if(girl.x>game.width-(game.width/3) && map.width+map.x>game.width && (map.hitTest(girl.x + offx+Math.abs(map.x), girl.y+offy+Math.abs(map.y)) == 0)) {
						//scrolls the map
						map.x -= 4;
						girl.toX -=4;
						} 
					else {girl.x += 4;
					if (map.hitTest(girl.x + offx+Math.abs(map.x), girl.y+offy+Math.abs(map.y))) girl.x -=4;
				};
			}

		//stops animation of hero sprite if location of hero and x,y values of map havent changed since last frame:
		if(girl.x==girl_x_old && girl_y_old== girl.y && map.x==map_x_old && map.y ==map_y_old) girl.age=1;
		girl.frame = girl.anim[girl.dir*4+ (girl.age%4)];
		//changes variables for next time around to see if the hero and map have moved or not:
		girl_x_old = girl.x;
		girl_y_old = girl.y;
		map_x_old = map.x;
		map_y_old = map.y;
		});


		//listens for mouse click
		game.rootScene.addEventListener(Event.TOUCH_START,function(e) {
			girl.toX = e.x-offx ;
			girl.toY = e.y-offy;
		});
		
		//draw stuff!
		game.rootScene.addChild(map);
		game.rootScene.addChild(girl);

	};
	game.start();
};


