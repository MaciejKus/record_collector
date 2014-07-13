var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

//where hero starts minus 16
var heroStartX = 200;
var heroStartY = 210;
var heroSpeed = 8;

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
var records = 0, recordInc = 0, money = 0, moneyInc = 0, recCost = 2, recMultiplier = 1;
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
		//what hapens when hero buys record store
		hero.hasRecStore = function() {
			game.rootScene.removeChild(recStoreOwner);
			var index = npcArray.indexOf('recStoreOnwer');
			npcArray.splice(index, 1);
			money -= 100;
			recordInc += .0008;
			recordLimit += 1000;
		}
		//////npc////////j
		var mom = new Sprite(64,64);
		mom.frame = 3;
		var recStoreOwner = new Sprite(64,64);
		recStoreOwner.frame = 2;
		var swapGuy = new Sprite(64,64);
		swapGuy.frame = 2;
		var storageGuy = new Sprite(64,64);
		storageGuy.frame = 2;
		var internetGuy = new Sprite(64,64);
		internetGuy.frame = 2;
		var cuteGirl = new Sprite(64,64);
		cuteGirl.frame = 2;
		var labelLady = new Sprite(64,64);
		labelLady.frame = 2;
		var rockerGuy = new Sprite(64,64);
		rockerGuy.frame = 2;
		var recordStoreRecords = new Sprite(64,64); //records you can interact with
		recordStoreRecords.frame = 2;
		var freeRecord = new Sprite(64,64); //find a free record on the street
		freeRecord.frame = 2;
		var npcArray = [mom, recStoreOwner,swapGuy,storageGuy,internetGuy,cuteGirl,labelLady,rockerGuy,recordStoreRecords,freeRecord];
		//var npcArray = [mom, recStoreOwner,freeRecord,swapGuy];
		var npcCount = npcArray.length;
		for (var i =0; i < npcCount; i++) {
			npcArray[i].hit = false; //makes sure collision result only happens once per touch
			npcArray[i].image = game.assets['spritesheet.png'];
		}
/////////////mom dialogue/////// 		
		mom.allowanceFunc = function() { 
			if (Math.random() < 0.2) {
				moneyInc += 0.00001;
				mom.dialogue.question = "Honey, I hope you aren't spending all your money on those darn<br>records";
				mom.dialogue.allowance = ["Sure thing mom.",nothing];
				game.pushScene(game.makeDialogueScene({
					question:'Sure, dear. You deserve it',
					a:['Thanks mom!!',nothing]
				}));
			} else {
				coolBan = ['REM', 'Iron Maiden', 'The Clash', 'Wu Tang', 'Black Sabbath'];
				lameBan = ['Justin Bieber', 'Winger', 'Stryper', 'ICP'];
				game.pushScene(game.makeDialogueScene({
					question:'Sorry honey, maybe you can get a job somewhere?',
					a:['I bet ' + randChoice(coolBan) + ' never had to get jobs',nothing],
					b:["Now Way! I'd rather listen to " + randChoice(lameBan) ,nothing]
				}));
			}
		};
		mom.recordFunc = function() {
			if (Math.random() < 0.4) {
				records++;
				delete mom.dialogue.record;
				game.pushScene(game.makeDialogueScene({
					question:'Sure, dear. You deserve to rock! Here is a ' + bandName() + ' record',
					a:['Thanks mom!!',nothing]
				}));
			} else {
				game.pushScene(game.makeDialogueScene({
					question:"Sorry dear, I read records are detrimental to both the health and<br>morals",
					a:["That's only if you listen to them backwards",nothing],
					b:["Inconceivable!!",nothing]
				}));
			}
		};
		mom.dialogue = {
			question: "Hello dear.",
			allowance: ['Hi mom, can I have an allowance?', mom.allowanceFunc],
			record: ['Hi mom, can you buy me a record?', mom.recordFunc]
		};
///////////////////recStoreOwner dialogue//////////
		recStoreOwner.buy = function() {
console.log(recCost);
			if (money < recCost*recMultiplier) {
				game.pushScene(game.makeDialogueScene({
                        	        question: 'Sorry, you cannot afford any records from us',
                        	        b: ['Capitalist pig-dog!!', nothing],
                        	        a: ['The best things in life are free... But I want the money', nothing]
                      	 	 }));
			} else  {
				//changes text when over 100 records
				if (records < 100) {
					var buyQuestion = 'We got a great sale going on right now. Only ' + recCost + ' dollars per <br>record!';
				} else {
					var buyQeustion = 'Good records are hard to find. We are selling them for ' +recCost + ' dollars per record';
				}
				game.pushScene(game.makeDialogueScene({
					question: buyQuestion,
					a: ['Great I will buy ' + recMultiplier + ' ' + bandName() + ' records!', function() { money -= recMultiplier * recCost; records+= recMultiplier;}],
					b: ['Cool I will buy ' + (recMultiplier*2) + ' ' + bandName() + ' records!', function() { money -= 2*recMultiplier * recCost; records+= 2*recMultiplier;}],
					c: ['Too expensive, maybe another time.', nothing]
				}));	
			}
		}; //end buy
		recStoreOwner.sell = function() {
			if (records < 1) {
				 game.pushScene(game.makeDialogueScene({
                                        question: "We both know you only have mp3s, and no records",
                                        b: ['This store sucks!', nothing]
                                 }));
                        } else  {
				game.pushScene(game.makeDialogueScene({
                                        question: 'Ok, lets look at your posuer collection... hmm..<br>I will give you ' + recCost/2 + ' dollars per record.',
                                        a: ['Neat I will sell ' + recMultiplier + ' ' + bandName() + ' records!', function() { money += recMultiplier * recCost/2; records-= recMultiplier;}],
                                        b: ['OK I will sell ' + (recMultiplier*2) + ' ' + bandName() + ' records!', function() { money += recMultiplier * recCost; records-= 2*recMultiplier;}],
                                        c: ['I need better prices than those. Maybe another time.', nothing]
                                }));
			}
		}; //end sell
		recStoreOwner.work = function() {
			var seconds = 15;
			//create x amount of scenes on top of one another
			for (var i =0; i < seconds; i++){
				var workScene = new Scene();
				var label = new Label('<br> Working hard, please wait ' + i + ' seconds');
				label.font = '24px monospace';
				label.color = 'rgb(255,200,0)';
				label.backgroundColor = "rgb(0,0,0)";
				label.width = game.width;
				label.height = game.height;
				workScene.addChild(label);
				game.pushScene(workScene);
			}
			//removes above scenes, one per second
			var workIt = setInterval( function() { game.popScene(); seconds--; if (seconds <0) {clearInterval(workIt);}; }, 1000);
		}; //end work
		recStoreOwner.job = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'I will pay you ' + recMultiplier/2 + '  records or ' +  (recCost/2)  + ' dollars to work right now',
				r: ['I will work for records', function() {recStoreOwner.work(); records+=recMultiplier/2;}],
				m: ['I will work for money', function() {recStoreOwner.work(); money+=recCost/2;}],
				n: ['I dont want to be a wage slave', nothing]
			}))
		};
		recStoreOwner.buyShop = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'You punk kid! You got more records than I do. This store does not make any money, but a lot of people trade in their old records. Fine, I will sell for 100 dollars.',
				y: ['Sucker, you got a deal', hero.hasRecStore],
				n: ['JK, LOL, not interesed', nothing]
			}))
		};
		recStoreOwner.dialogue = {
			question: 'Welcome to If They Only Knew Records, the best record store <br>around',
			b: ['I want to buy some records',recStoreOwner.buy],
			s: ['I want to sell some records', recStoreOwner.sell],
			j: ['I want a job', recStoreOwner.job]
		};
///////////////////////swapGuy dialogue //////////////////
		swapGuy.quest = false;
		swapGuy.swap = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Mondo cool! If you give me a box of ' + (20 * recCost) + ' records, I can wheel and deal and slowly increase your collection',
				y: ['Off the hook! its a deal', function() {records-= (20 * recCost); recordInc += (.0001 * recCost);}],
				n: ['Bummer. I dont really want to do that', nothing]
			}));
		};
		swapGuy.tookRecord = function() {
			swapGuy.quest = true;
			labelLady.dialogue.a = ['Your boyfriend told asked me to give you this record', labelLady.gotRecord];
			swapGuy.dialogue.question = 'You deliver that record to my lady yet?';
			swapGuy.dialogue.y = ['Working on it',nothing];
			delete swapGuy.dialogue.n;
		};			
		swapGuy.tip = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Wicked fresh! have a Killed by Death record for your troubles',
				a: ['Hella tight! Thanks homie', nothing]
			}));
			swapGuy.dialogue.question = 'What is up brah?';
			swapGuy.dialogue.y = ['I got some records I want to swap',swapGuy.swap];
			swapGuy.dialogue.n = ['Just wanted to tell you my new favorite band is ' + bandName(), nothing];
//////////ADD +! FOR GETTING KILLED BY DEATH HERE
		};
		swapGuy.dialogue = {
			question: 'Hey, I run a booth at the swapmeet here. Can you deliver this <br>Barry White record to my girlfriend at the record label for me?',
			y: ['Sure, I can do that for you', swapGuy.tookRecord ],
			n: ['I dont have the time', nothing]
		};

///////////////////////labelLady dialogue//////////////
		labelLady.gotRecord = function() {
			game.pushScene(game.makeDialogueScene({
				question : 'I looove Barry White! Thanks a bunch, I will call my boyfriend <br>right now and thank him!',
				a: ['No problemo, lady.',nothing]
			}));
			labelLady.dialogue.question = 'Sorry kid, I cant let you in here. Only rock stars and <br>millionaires are allowed in here.';
			labelLady.dialogue.a = ['AKA wimps and posers!',nothing];
			swapGuy.dialogue.question = 'Hey kid, what can I do you for?';
			swapGuy.dialogue.y = ['Your girlfriend loved the record you sent her', swapGuy.tip];
		}
		labelLady.dialogue = {
			question: 'Welcome to Corporate Label Inc. We make big money! We dont have time for you right now.',
			a: ['Only sellouts hang out here anyway',nothing]
		}

///////////////////////freeRecord dialogue///////////
		freeRecord.dialogue = {
			question: 'Cool, a ' + realBands() + ' record!',
			take: ["I'm adding this to my collection!", function() {records++; game.rootScene.removeChild(freeRecord); npcArray.pop();}],
			leave: ['I always hated this record', function() {game.rootScene.removeChild(freeRecord); npcArray.pop();}]
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
				mom.dialogue.question = 'There is no more room in this house for records! You have to <br>find somewhere else to keep them!';
				records = recordLimit;
			} else {
				mom.dialogue.question = 'Honey, I dont like this record obsession. Why not try cookie collecting instead?';
			}
			if (money > 1) {
				recStoreOwner.dialogue.j = ['I want to buy your shop!',recStoreOwner.buyShop];
			} else {
				recStoreOwner.dialogue.j = ['Can I do some work around here?',recStoreOwner.job];
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
			freeRecord.x = 400+floor.x;
			freeRecord.y = 410+floor.y;
			swapGuy.x = 150+floor.x;
			swapGuy.y = 40+floor.y; //make all this into a single loop 
			labelLady.x = 200+floor.x;
			labelLady.y = 250+floor.y;
			

			if (hero.y > hero.toY) {
				hero.dir = DIR_UP;
				//if mouse click and hero are close enough together, just move hero to where mouseclick happened:
				if (Math.abs(hero.y-hero.toY) < heroSpeed) {
					hero.y=hero.toY;
				} else if (hero.y<game.width/3 && floor.y<0 && (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+offy+Math.abs(floor.y)) === false)) {
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
				} else if (hero.y>game.height -(game.height/3) && floor.height+floor.y>game.height && (floor.hitTest(hero.x + offx+Math.abs(floor.x), hero.y+(offy*2)+Math.abs(floor.y)) === false)){
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
				} else if (hero.x<(game.width/3) && floor.x<0 && (floor.hitTest(hero.x + (offx/2)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y)) === false)) {
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
					} else if(hero.x>game.width-(game.width/3) && floor.width+floor.x>game.width && (floor.hitTest(hero.x + (offx+16)+Math.abs(floor.x), hero.y+offy*2+Math.abs(floor.y)) === false)) {
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
		for (var i=0; i < npcCount; i++) {
			game.rootScene.addChild(npcArray[i]);
		}
		game.rootScene.addChild(hero);
		game.rootScene.addChild(recordLabel);
		game.rootScene.addChild(moneyLabel);
		recCost = (Math.floor(records/20) + 2); //increase cost of records. maybe move this?
		recMultiplier = 1 + Math.floor(records/10); //increases exchange amounts
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
			talk[i].y = (startY += incrementY);
			talk[i].width = game.width;
			talk[i].height = game.height - 400; //400 = game not covered by text
			scene.addChild(talk[i]);
		}
		for (var i = 1; i < keys.length; i++ ) {
//console.log(keys[i][0]);
			(function(i){ //dealing with a closure
				talk[i].addEventListener(Event.TOUCH_START, function() {
					game.popScene();
					dialogueIn[keys[i]][1]();
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
	return randChoice(first) + ' ' + randChoice(second);
}

function realBands() {
	var bands = ['Billy Bragg', 'Refused', 'Doc Watson', 'Minor Threat', 'The Coup', 'Crass', 'Wlochaty'];
	return randChoice(bands);
}

//return random array element:
function randChoice(x) {
	return x[Math.floor(Math.random()*x.length)];
}

