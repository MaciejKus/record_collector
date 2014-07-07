var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

//where hero starts minus 16
var heroStartX = 200;
var heroStartY = 210;
var heroSpeed = 4;

//how much sprite images are ofset
var offy= 32;
var offx = 32;

//starting positions
var momStartX = 90, momStartY = 60;

//used for checking for collisions in terms of y and x for hero
var hero_x_old= -1;
var hero_y_old = -1;
var floor_x_old = -999;
var floor_y_old = -999;

//other variables:
var records = 0, recordInc = 0, money = 0, moneyInc = 0;
var recordLimit = 50; //recordLimit is the amount of storage space for records. 


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
		//hero stuff
		var hero = new Sprite(64,64);
		hero.image = game.assets['spritesheet.png'];
		hero.x = heroStartX-offx;
		hero.y = heroStartY - offy;
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
		var mom = new Sprite(64,64);
		mom.frame = 3;
		var recStoreOwner = new Sprite(64,64);
		recStoreOwner.frame = 2;
		var npcArray = [mom, recStoreOwner];
		var npcCount = npcArray.length;
		//Sprite.prototype.hit = false;
		for (var i =0; i < npcCount; i++) {
			npcArray[i].hit = false; //makes sure collision result only happens once per touch
			npcArray[i].image = game.assets['spritesheet.png'];
		}
 		
		allowanceFunc = function() { 
			if (Math.random() < 0.9) {
				moneyInc += 0.00001;
				mom.dialogue[0] = "Honey, I hope you aren't spending all your money on those darn records";
				mom.lineTwo[1][allowance] = ["Sure thing mom.",nothing];
				game.pushScene(game.makeDialogueScene(['Sure, dear. You deserve it',[{a:['Thanks mom!!',nothing]}]]));
			} else {
				game.pushScene(game.makeDialogueScene(['Sorry honey, maybe you can get a job somewhere?',[{a:['I bet Metallica never had to get jobs',nothing]},{b:["Now Way! I'd rather listen to records",nothing]}]]));
			}
		};
		momRecord = function() {
			if (Math.random() < 0.4) {
				records++;
				delete mom.dialogue.record;
				game.pushScene(game.makeDialogueScene({question:'Sure, dear. You deserve to rock! Here is a ' + bandName() + ' record',a:['Thanks mom!!',nothing]}));
			} else {
				game.pushScene(game.makeDialogueScene("Sorry dear, I read records are detrimental to both the health and morals","That's only if you listen to them backwards","Inconceivable!!",nothing,nothing));
			}
		};
		mom.dialogue = {
			question: "Hello dear.",
			allowance: ['Hi mom, can I have an allowance?', allowanceFunc],
			record: ['Hi mom, can you buy me a record?', momRecord]
		};

		recStoreOwner.dialogue = {
			question: 'Welcome to If They Only Knew Records, the best record store around',
			buy: ['I want to buy some records',function() {records++;}],
			sell: ['I want to sell some records', nothing]
		};
		
		// label for record number
		var recordLabel = new Label("Records: " + records );
		recordLabel.x = 10;
		recordLabel.y = 10;
		recordLabel.color = "black";
		//label for money
		var moneyLabel = new Label('Money:   ' + money);
		moneyLabel.x = 10;
		moneyLabel.y = 24;
		moneyLabel.color = "black";
		
		//updates recods lablel
		recordLabel.addEventListener(Event.ENTER_FRAME, function(e) {
			records += recordInc *e.elapsed;
			//checks record limits 
			if (records > recordLimit) {
				mom.lineOne = 'There is no more room in this house for records! You have to find somewhere else to keep them!';
				records = recordLimit;
			}
			this.text = "Records: " +(Math.round(records*100)/100);
		});
		//update money label
		moneyLabel.addEventListener(Event.ENTER_FRAME, function(e) {
			money += moneyInc * e.elapsed; //e.elapsed accounts for time so even if game
                                                       //is not in main tab
                                                       //money adds up
			this.text = 'Money:   ' + (Math.round(money*100)/100);
		});
		

		//compared x y of hero to x y of last mouse click, if difference is large enough, hero x y moves to mouse click.
		hero.addEventListener(Event.ENTER_FRAME, function() {
			//moves NPC the same amount as floor got moved
			//has to happen before floor values change or 
			//have to change the NPC to be drawn after the hero
			mom.x = momStartX+floor.x; 
	                mom.y = momStartY+floor.y;
			recStoreOwner.x = 280+floor.x;
			recStoreOwner.y = 300+floor.y;
			

			if (hero.y > hero.toY) {
				hero.dir = DIR_UP;
				//if mouse click and hero are close enough together, just move hero to where mouseclick happened:
				if (Math.abs(hero.y-hero.toY) < heroSpeed) {
					hero.y=hero.toY;
				} else if (hero.y<game.width/3 && floor.y<0 && (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+offy+Math.abs(floor.y)) === 0)) {
					floor.y += heroSpeed;
					hero.toY += heroSpeed;
				} else {
				//if mouse click location and hero location are not close to one another move hero by certain amount towards mouse click (on y axis):
					hero.y -= heroSpeed; 
				//if there is a collision undo the move made above. 
				//basically the hero did not move in the y direction:
				//the Math.abs(floor.y) and Math.abs(floor.x) parts 
				//account for floor scrolling.
				//it is abs because the floor is technically moved in 
				//the negative direction, but we are looking
				//at the hero's location, which means the hero has 
				//moved in the positive direction (relative to the floor)
					if (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+offy+Math.abs(floor.y))) hero.y +=heroSpeed;
				}
			}
			else if (hero.y < hero.toY) {
				hero.dir = DIR_DOWN;
				if (Math.abs(hero.y-hero.toY) < heroSpeed) {
					hero.y=hero.toY;
				} else if (hero.y>game.height -(game.height/3) && floor.height+floor.y>game.height && (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+(offy*2)+Math.abs(floor.y)) === 0)){
				floor.y -= heroSpeed;
				hero.toY -=heroSpeed;
				}
				else {
					hero.y +=heroSpeed;
					if (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+(offy*2) +Math.abs(floor.y))) hero.y -=heroSpeed;
				}
			}
			if (hero.x > hero.toX) {
				hero.dir = DIR_LEFT;
				if (Math.abs(hero.x - hero.toX) < heroSpeed) {
					hero.x = hero.toX;
				} else if (hero.x<(game.width/3) && floor.x<0 && (floor.hitTest(hero.x + (offx/2)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y)) === 0)) {
					floor.x+=heroSpeed;
					hero.toX +=heroSpeed;
				} else {
					hero.x -= heroSpeed;
					if (floor.hitTest(hero.x + (offx/2) +Math.abs(floor.x), hero.y+(offy*2)+Math.abs(floor.y))) hero.x +=heroSpeed;}
				 }
			else if (hero.x < hero.toX) {
				hero.dir = DIR_RIGHT;
					if (Math.abs(hero.x- hero.toX) < heroSpeed) {
						hero.x = hero.toX;
					//checks to see how far to the 
					//right of the window (game) the hero is 
					//and if there is any floor left unseen to 
					//the right and that there are no collisions taking place:
					} else if(hero.x>game.width-(game.width/3) && floor.width+floor.x>game.width && (floor.hitTest(hero.x + (offx+16)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y)) === 0)) {
						//scrolls the floor
						floor.x -= heroSpeed;
						hero.toX -= heroSpeed;
						} 
					else {hero.x += heroSpeed;
					if (floor.hitTest(hero.x + (offx+16)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y))) hero.x -=heroSpeed;
				}
			}
///////////////////insert collison stuff here ///////////****************
		var npcLength = npcArray.length;
		for (var i = 0; i < npcLength; i++ ) {
			var curNpc = npcArray[i];
			if(hero.within(curNpc, 15) ) { //CHANGE MAGIC NUMBER 15
				if (!curNpc.hit) { 
					game.pushScene(game.makeDialogueScene(curNpc.dialogue)); //ADDS DIALGE BOX
					curNpc.hit = true;
				}
				// CREATE VARIABLE COLISION = TRUE
			} else {
				curNpc.hit = false;
			}
		}// end of for npcLength

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
		game.rootScene.addChild(mom);
		game.rootScene.addChild(recStoreOwner);
		game.rootScene.addChild(hero);
//		game.rootScene.addChild(buildings);
		game.rootScene.addChild(recordLabel);
		game.rootScene.addChild(moneyLabel);
	}; //end rootScene

	//dialogue box for when collision with sprit happens
	//takes object {question:'text',label:['text',function],etc}
	game.makeDialogueScene = function(dialogueIn) {
		var scene = new Scene();

		var startY = 400;
		var incrementY = 48;
		var keys = Object.keys(dialogueIn);
		var talk = [];
		talk[0] = new Label(dialogueIn['question']); //queston is not clickable and white
		talk[0].font = "16px monospace";
		talk[0].color = "rgb(255,255,255)";
		talk[0].backgroundColor = "rgba(0,0,0,0.8)";
		talk[0].y = 400;
		talk[0].width = game.width;
		talk[0].height = game.height - 400; //400 = game not covered by text
                scene.addChild(talk[0]);
		for (var i = 1, ii = keys.length; i < ii; i++ ) {
			talk[i] = new Label(dialogueIn[keys[i]][0]);
			talk[i].font = "16px monospace";
			talk[i].color = "rgb(255,255,0)";
			talk[i].backgroundColor = "rgba(0,0,0,0.8)";
			talk[i].y = (startY += incrementY);
			talk[i].width = game.width;
			talk[i].height = game.height - 400; //400 = game not covered by text
			scene.addChild(talk[i]);
		}
		for (var i = 1; i < keys.length; i++ ) {
			(function(i){ //dealing with a closure
				talk[i].addEventListener(Event.TOUCH_START, function() {
					dialogueIn[keys[i]][1]();
					game.popScene();//(game.makeDialogueScene);
				});
			})(i);
		}
		return scene;
	}; //end of makeDialogueScene

	game.start();
};

var nothing = function() {};

//creates random band name
function bandName() {
	var first = ['Liqued', 'Rancid', 'Squishy', 'Brown'];
	var second = ['Toast', 'Brains', 'Girls', 'Bones'];
	return first[Math.floor(Math.random()*first.length)] + ' ' + second[Math.floor(Math.random()*second.length)];
}
