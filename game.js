var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

//where hero starts minus 16
var hero_start_x=200;
var hero_start_y = 210;

//how much sprite images are ofset
var offy= 32;
var offx = 32;

//used for checking for collisions in terms of y and x for hero
var hero_x_old= -1;
var hero_y_old = -1;
var floor_x_old = -999;
var floor_y_old = -999;

var records = 0;


enchant();
window.onload = function() {
	var game = new Core(640,640);
	game.fps = 16;
	game.preload('background.png','spritesheet.png','chara1.png');
	game.onload = function() {
		//floor stuff. variables layer1, layer2 and collision can be found in floor.js
		var floor = new Map(32,32);
		floor.image = game.assets['background.png'];
		floor.loadData(layer1);
		floor.collisionData = collision;
	//	var buildings = new Map(32,32);
	//	buildings.image = game.assets['background.png'];
	//	buildings.loadData(layer2);
		//hero stuff
		var hero = new Sprite(64,64);
		hero.image = game.assets['spritesheet.png'];
		hero.x = hero_start_x-offx;
		hero.y = hero_start_y - offy;
		hero.frame = 11;
		hero.toX = hero.x;
		hero.toY = hero.y;
		hero.dir = DIR_DOWN;
		hero.anim = [
			6,5,7,5, //left
			9,8,10,8, //right
			1,0,2,0, //up
			3,11,4,11]; // down
		//////npc////////j
		var vil = new Sprite(64,64);
		vil.image = game.assets['spritesheet.png'];
		vil.frame = 3;
		vil.hit = false; //used to make sure collision event only happens once per collision
		//////npc2////////j
		var vil2 = new Sprite(32,32);
		vil2.image = game.assets['chara1.png'];
		vil2.x = 250;	
		vil2.y = 250;
		// label for record number
		var recordLabel = new Label("Records: " + records);
		recordLabel.x = 10;
		recordLabel.y = 10;
		recordLabel.color = "black";
		
		//updates recods lablel
		recordLabel.addEventListener(Event.ENTER_FRAME, function() {
			this.text = "Records: " +records;
		});

		//compared x y of hero to x y of last mouse click, if difference is large enough, hero x y moves to mouse click.
		hero.addEventListener(Event.ENTER_FRAME, function() {
			//moves vil the same amount as floor got moved
			//has to happen before floor values change or 
			//have to change the vil to be drawn after the hero
			vil.x = 140+floor.x; //140 and 110 in next line are where vil stands CHANGE OT NONE MAGIC NUM
	                vil.y = 110+floor.y;

			if (hero.y > hero.toY) {
				hero.dir = DIR_UP;
				//if mouse click and hero are close enough together, just move hero to where mouseclick happened:
				if (Math.abs(hero.y-hero.toY) < 4) {
					hero.y=hero.toY;
				} else if (hero.y<game.width/3 && floor.y<0 && (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+offy+Math.abs(floor.y)) == 0)) {
					floor.y+=4;
					hero.toY+=4;
				} else {
				//if mouse click location and hero location are not close to one another move hero by certain amount towards mouse click (on y axis):
					hero.y -= 4; //CHANGE 4 INTO NON MAGIC NUMBER
				//if there is a collision undo the move made above. 
				//basically the hero did not move in the y direction:
				//the Math.abs(floor.y) and Math.abs(floor.x) parts 
				//account for floor scrolling.
				//it is abs because the floor is technically moved in 
				//the negative direction, but we are looking
				//at the hero's location, which means the hero has 
				//moved in the positive direction (relative to the floor)
					if (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+offy+Math.abs(floor.y))) hero.y +=4;
				}
			}
			else if (hero.y < hero.toY) {
				hero.dir = DIR_DOWN;
				if (Math.abs(hero.y-hero.toY) < 4) {
					hero.y=hero.toY;
				} else if (hero.y>game.height -(game.height/3) && floor.height+floor.y>game.height && (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+(offy*2)+Math.abs(floor.y)) == 0)){
				floor.y -= 4;
				hero.toY -=4;
				}
				else {
					hero.y +=4;
					if (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+(offy*2) +Math.abs(floor.y))) hero.y -=4;
				}
			}
			if (hero.x > hero.toX) {
				hero.dir = DIR_LEFT;
				if (Math.abs(hero.x - hero.toX) < 4) {
					hero.x = hero.toX;
				} else if (hero.x<(game.width/3) && floor.x<0 && (floor.hitTest(hero.x + (offx/2)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y)) == 0)) {
					floor.x+=4;
					hero.toX +=4;
				} else {
					hero.x -= 4;
					if (floor.hitTest(hero.x + (offx/2) +Math.abs(floor.x), hero.y+(offy*2)+Math.abs(floor.y))) hero.x +=4;}
				 }
			else if (hero.x < hero.toX) {
				hero.dir = DIR_RIGHT;
					if (Math.abs(hero.x- hero.toX) < 4) {
						hero.x = hero.toX;
					//checks to see how far to the 
					//right of the window (game) the hero is 
					//and if there is any floor left unseen to 
					//the right and that there are no collisions taking place:
					} else if(hero.x>game.width-(game.width/3) && floor.width+floor.x>game.width && (floor.hitTest(hero.x + (offx+16)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y)) == 0)) {
						//scrolls the floor
						floor.x -= 4;
						hero.toX -=4;
						} 
					else {hero.x += 4;
					if (floor.hitTest(hero.x + (offx+16)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y))) hero.x -=4;
				};
			}

		//test for collisions between sprites and 
		//runs appropriate function if collision occures:
		//only runs if vil.hit is false, that is event only happens
		//once per collision
		if(hero.within(vil, 15) ) { //CHANGE MAGIC NUMBER 15
			if (!vil.hit) { 
				var addOne = function() {
					records++;
				}
				game.pushScene(game.makeDialogueScene('test text','wwww','something', addOne)); //ADDS DIALGE BOX
				vil.hit = true;
			}
			// CREATE VARIABLE COLISION = TRUE
		} else {
			vil.hit = false;
		}

		//stops animation of hero sprite if location of hero and x,y 
		//values of floor havent changed since last frame (if floor hasnt moved):
		if(hero.x==hero_x_old && hero_y_old== hero.y && floor.x==floor_x_old && floor.y ==floor_y_old) hero.age=1;
		hero.frame = hero.anim[hero.dir*4+ (hero.age%4)];
		//changes variables for next time around to see if the hero and floor have moved or not:
		hero_x_old = hero.x;
		hero_y_old = hero.y;
		floor_x_old = floor.x;
		floor_y_old = floor.y;
		});



		//listens for mouse click
		game.rootScene.addEventListener(Event.TOUCH_START,function(e) {
			hero.toX = e.x-offx ;
			hero.toY = e.y-offy;
		});

		//draw stuff!
		game.rootScene.addChild(floor);
		game.rootScene.addChild(vil);
		game.rootScene.addChild(vil2);
		game.rootScene.addChild(hero);
//		game.rootScene.addChild(buildings);
		game.rootScene.addChild(recordLabel);
	}; //end rootScene

	//dialogue box for when collision with sprit happens
	//takes 3 dialogue lines plus what happens function 
	game.makeDialogueScene = function (firstLine,secondLine,thirdLine,whatHappens) {
		var scene = new Scene();
		var bg = new Map(16,16);

		var question = new Label(firstLine);
		question.font = "16px monospace";
		question.color = "rgb(255,255,255)";
		question.backgroundColor = "rgba(0,0,0,0.8)";
		//makes the question object be large enough to fill bottom of screen
		//MAKE THESE NOT MAGIC NUMBERS
		question.y = 200 ;
		question.width = game.width;
		question.height = game.height - 200;

		var returnLabel = new Label(secondLine);
		returnLabel.font = "16px monospace";
		returnLabel.color="rgb(255,255,255)";
		returnLabel.y = 216;
		//if clicked on returnlable then goes back to root scene
		returnLabel.addEventListener(Event.TOUCH_START, function(e) {
			whatHappens();
			game.popScene(game.makeDialogueScene());
		});

		var lastLabel = new Label("hhhhffffhhhhtttttjjjj333nnnssss111223thisistheend");//thirdLine);
                lastLabel.font = "16px monospace";
                lastLabel.color="rgb(255,255,255)";
                lastLabel.y = 270;
                //if clicked on returnlable then goes back to root scene
                lastLabel.addEventListener(Event.TOUCH_START, function(e) {
			game.popScene(game.makeDialogueScene());
			game.pushScene(game.makeDialogueScene('x text','22 text','nothing', function() {records++;} ));
		});


		//draws scene stuff
		scene.addChild(question);
		scene.addChild(returnLabel);
		scene.addChild(lastLabel);
		return scene;
	} //end of makeDialogueScene

	game.start();
};

