enchant();
window.onload = function() {
	'use strict';
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

	//used for checking for collisions in terms of y and x for hero
	var hero_x_old= -1;
	var hero_y_old = -1;
	var floor_x_old = -999;
	var floor_y_old = -999;
	//other variables:
	var records = 0, recordInc = 0, money = 0, moneyInc = 0,  recordLimit = 50; 

	var game = new Core(640,640);
	game.fps = 16;
	game.preload('background.png','spritesheet.png');
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
			var index = npcArray.indexOf(recStoreOwner);
			npcArray.splice(index, 1);
			money -= 400;
			recordInc += 0.0009;
			records += 200;
			recordLimit += 1000;
			mom.dialogue.question = 'Wow, you own a record store? I bet if you get a bit more money or records the record label will want to talk to you!';
			security.dialogue.question = 'How are you today boss? Anything I can help you with, boss?';
			security.dialogue.a =  ['Youre fine where you are. Nice day we are having.',nothing];
			security.dialogue.b = ['Who is the dumb one now? You are fired! get out of here, rent-a-cop',function() {game.rootScene.removeChild(security);	var index = npcArray.indexOf(security); npcArray.splice(index, 1); }];
			recordStoreRecords.dialogue.question = 'So many records';
			recordStoreRecords.dialogue.a = ['Mine. All Mine',nothing];
			delete recordStoreRecords.dialogue.b;
		};
		hero.buyLabel = function() {
			var endText = [ 'After all that work you are left with about $3.50<br> and a single Creed record.<br>The End','You spend all your money on hookers and blow','You get laid off','Your board of directors decides <br>they have had enough','You party with rock stars','You make tons of money doing next to nothing','You become CEO of Corporate Label Inc'];
			for (var i =0, j = endText.length; i < j; i ++) {
				var endScene = new Scene();
				var label = new Label(endText[i]);
				endScene.backgroundColor = 'black';
				label.font = '20px monospace';
				label.textAlign = 'center';
				label.color = 'rgb(128,128,128)';
				label.width = game.width-40;
				label.y = 200;
				endScene.addChild(label);
				game.pushScene(endScene);
				//removes above scenes, one per click
				if (i!==0) { //skip last scene so it sticks	
					endScene.addEventListener(Event.TOUCH_START, function() {
						game.popScene();  //doesnt remove last scene;
					});	
				}
			}
		};
		hero.sellCollection = function() {
			var endText = [ 'You go outside and enjoy life<br>The End','You are happy','You realize today is the first day<br> of the rest of your life','You join collectors anonymous','You notice how much more to life there<br> is than collecting things','You sell your records'];
			for (var i =0, j = endText.length; i < j; i ++) {
				var endScene = new Scene();
				var label = new Label(endText[i]);
				endScene.backgroundColor = 'black';
				label.font = '20px monospace';
				label.textAlign = 'center';
				label.color = 'rgb(128,128,128)';
				label.width = game.width-40;
				label.y = 200;
				endScene.addChild(label);
				game.pushScene(endScene);
				//removes above scenes, one per click
				if (i!==0) { //skip last scene so it sticks	
					endScene.addEventListener(Event.TOUCH_START, function() {
						game.popScene();  //doesnt remove last scene;
					});	
				}
			}
		};
		//////npc////////j
		var mom = new Sprite(64,64);
		mom.frame = 20;
		var recStoreOwner = new Sprite(64,64);
		recStoreOwner.frame = 21;
		var swapGuy = new Sprite(64,64);
		swapGuy.frame = 14;
		var storageGuy = new Sprite(64,64);
		storageGuy.frame = 17;
		var internetGuy = new Sprite(64,64);
		internetGuy.frame = 18;
		var cuteGirl = new Sprite(64,64);
		cuteGirl.frame = 16;
		var labelLady = new Sprite(64,64);
		labelLady.frame = 19;
		var rockerGuy = new Sprite(64,64);
		rockerGuy.frame = 23;
		var storageSpace = new Sprite(64,64);
		storageSpace.frame = 12;
		var security = new Sprite(64,64);
		security.frame = 24;
		var recordStoreRecords = new Sprite(64,64); //records you can interact with
		recordStoreRecords.frame = 22;
		var freeRecord = new Sprite(64,64); //find a free record on the street
		freeRecord.frame = 15;
		var npcArray = [mom, recStoreOwner,swapGuy,storageGuy,internetGuy,cuteGirl,labelLady,security,rockerGuy,storageSpace,recordStoreRecords,freeRecord];
		var npcCount = npcArray.length;
		for (var i =0; i < npcCount; i++) {
			npcArray[i].hit = false; //makes sure collision result only happens once per touch
			npcArray[i].image = game.assets['spritesheet.png'];
		}
/////////////mom dialogue/////// 		
		mom.allowanceFunc = function() { 
			if (Math.random() < 0.2) {
				moneyInc += 0.00003;
				mom.dialogue.question = "Honey, I hope you aren't spending all your money on those darn<br>records";
				mom.dialogue.allowance = ["Sure thing mom.",nothing];
				game.pushScene(game.makeDialogueScene({
					question:'Sure, dear. You deserve it',
					a:['Thanks mom!!',nothing]
				}));
			} else {
				var coolBan = ['REM', 'Iron Maiden', 'The Clash', 'Wu Tang', 'Black Sabbath'];
				var lameBan = ['Justin Bieber', 'Winger', 'Stryper', 'ICP'];
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
					question:"Sorry dear, I read records are detrimental to both the healthx<br>and morals",
					a:["That's only if you listen to them backwards",nothing],
					b:["Inconceivable!!",nothing]
				}));
			}
		};
		mom.dialogue = {
			question: "Dear, I dont like all this record collecting.<br>Why not try collecting cookies instead? ",
			allowance: ['Hi mom, can I have an allowance?', mom.allowanceFunc],
			record: ['Hi mom, can you buy me a record?', mom.recordFunc]
		};
///////////////////recStoreOwner dialogue//////////
		recStoreOwner.recCost = 1.2;
		recStoreOwner.recMultiplier = Math.floor(records/5) || 1;
		recStoreOwner.shopliftCost = 1;
		recStoreOwner.buy = function() {
			if (money < recStoreOwner.shopliftCost *recStoreOwner.recCost*recStoreOwner.recMultiplier) {
				game.pushScene(game.makeDialogueScene({
                        	        question: 'Sorry, you cannot afford any records from us',
                        	        b: ['Capitalist pig-dog!!', nothing],
                        	        a: ['The best things in life are free... But I want the money', nothing]
                      	 	 }));
			} else  {
				//changes text when over 100 records
				var buyQuestion;
				recStoreOwner.recMultiplier = Math.floor(records/5) || 1;
				if (records < 100) {
					buyQuestion = 'We got a great sale going on right now. Only ' + (Math.floor(100*recStoreOwner.shopliftCost*recStoreOwner.recCost))/100 + ' dollars per <br>record!';
				} else {
					buyQuestion = 'Good records are hard to find. We are selling them for ' +(Math.floor(recStoreOwner.shopliftCost*recStoreOwner.recCost))/100 + ' dollars per record';
				}
				game.pushScene(game.makeDialogueScene({
					question: buyQuestion,
					a: ['Great I will buy ' + recStoreOwner.recMultiplier + ' ' + bandName() + ' records!', function() { money -= recStoreOwner.shopliftCost*recStoreOwner.recMultiplier * recStoreOwner.recCost; records+= recStoreOwner.recMultiplier; recStoreOwner.recCost += 0.3;}],
					b: ['Cool I will buy ' + (recStoreOwner.recMultiplier*2) + ' ' + bandName() + ' records!', function() { money -= 2*recStoreOwner.shopliftCost*recStoreOwner.recMultiplier * recStoreOwner.recCost; records+= 2*recStoreOwner.recMultiplier; recStoreOwner.recCost += 0.3;}],
					c: ['Too expensive, maybe another time.', nothing]
				}));	
			}
		}; //end buy
		recStoreOwner.sell = function() {
			recStoreOwner.recMultiplier = Math.floor(records/5) || 1;
			if (records < 1) {
				 game.pushScene(game.makeDialogueScene({
                                        question: "We both know you only have mp3s, and no records",
                                        b: ['This store sucks!', nothing]
                                 }));
                        } else  {
				game.pushScene(game.makeDialogueScene({
                                        question: 'Ok, lets look at your posuer collection... hmm..<br>I will give you ' + (Math.floor(100*recStoreOwner.recCost/(2*recStoreOwner.shopliftCost)) +1)/100  + ' dollars per record.',
                                        a: ['Neat I will sell ' + recStoreOwner.recMultiplier + ' ' + bandName() + ' records!', function() { money += recStoreOwner.recMultiplier * (1 +recStoreOwner.recCost)/(recStoreOwner.shopliftCost*2); records-= recStoreOwner.recMultiplier; recStoreOwner.recCost -= 0.2;}],
                                        b: ['OK I will sell ' + (recStoreOwner.recMultiplier*2) + ' ' + bandName() + ' records!', function() { money += recStoreOwner.recMultiplier * (1+recStoreOwner.recCost)*recStoreOwner.shopliftCost; records-= 2*recStoreOwner.recMultiplier; recStoreOwner.recCost -= 0.2;}],
                                        c: ['I need better prices than those. Maybe another time.', nothing]
                                }));
			}
		}; //end sell
		recStoreOwner.work = function() {
			var seconds = 12;
			//create x amount of scenes on top of one another
			var anim = function(i) {
				var workScene = new Scene();
				var label = new Label('<br> Working hard, please wait ' + i + ' seconds');
				label.font = '24px monospace';
				label.color = 'rgb(255,200,0)';
				label.backgroundColor = "rgb(0,0,0)";
				label.width = game.width;
				label.height = game.height;
				var wageSlave = new Label('Wage<br><br>Slave');
				wageSlave.font = '98px monospace';
				wageSlave.textAlign = 'center';
				wageSlave.color = (i%2===1) ? 'red' : 'yellow';
				wageSlave.y = 300;
				wageSlave.x = 100;
				workScene.addChild(label);
				workScene.addChild(wageSlave);
				game.pushScene(workScene);
			}
			anim(seconds);
			//removes scene then draws next one one at a time
			//before i drew all the scenes then removed one at a time
			//after drawing all at once. this way should be less resource
			//intensive
			var workIt = setInterval( function() { game.popScene(); seconds--; anim(seconds); if (seconds <1) {game.popScene(); clearInterval(workIt);} }, 1000);
		}; //end work
		recStoreOwner.job = function() {
			recStoreOwner.recMultiplier = Math.floor(records/5) || 1;
			game.pushScene(game.makeDialogueScene({
				question: 'I will pay you ' + (Math.floor(400*recStoreOwner.recMultiplier))/100 + '  records or ' +  (Math.floor(500*recStoreOwner.recCost))/100  + ' dollars to work right now',
				r: ['I will work for records', function() {recStoreOwner.work(); records+=4*recStoreOwner.recMultiplier;}],
				m: ['I will work for money', function() {recStoreOwner.work(); money+=5*recStoreOwner.recCost;}],
				n: ['I dont want to be a wage slave', nothing]
			}));
		};
		recStoreOwner.buyShop = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'You punk kid! You got more records than I do. This store does<br>not make any money, but a lot of people trade in their old<br>records. Fine, I will sell for 400 dollars.',
				y: ['Sucker, you got a deal', hero.hasRecStore],
				n: ['JK, LOL, not interested', nothing]
			}));
		};
		recStoreOwner.dialogue = {
			question: 'Welcome to If They Only Knew Records, the best record store <br>around',
			b: ['I want to buy some records',recStoreOwner.buy],
			s: ['I want to sell some records', recStoreOwner.sell],
			j: ['I want a job', recStoreOwner.job]
		};
///////////////////////swapGuy dialogue //////////////////
		swapGuy.quest = false;
		swapGuy.recCost = 1;
		swapGuy.swap = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Mondo cool! If you give me a box of ' + Math.floor(40 * swapGuy.recCost) + ' records, I can wheel<br>and deal and slowly increase your collection',
				y: ['Off the hook! its a deal', function() {if (records >= (40 * swapGuy.recCost)) {records-= (40 * swapGuy.recCost); recordInc += (0.0001); swapGuy.recCost += 0.4;} else { cantAfford();}}],
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
			internetGuy.killed();
			swapGuy.dialogue.question = 'What is up brah?';
			swapGuy.dialogue.y = ['I got some records I want to swap',swapGuy.swap];
			swapGuy.dialogue.n = ['Just wanted to tell you my new favorite band is ' + bandName(), nothing];
		};
		swapGuy.dialogue = {
			question: 'Hey, I run a booth at the swap meet here. Can you deliver this <br>Barry White record to my girlfriend at the record label for me?',
			y: ['Sure, I can do that for you', swapGuy.tookRecord ],
			n: ['I dont have the time', nothing]
		};

///////////////////////labelLady dialogue//////////////
		labelLady.gotRecord = function() {
			game.pushScene(game.makeDialogueScene({
				question : 'I looove Barry White! Thanks a bunch, I will call my boyfriend <br>right now and thank him!',
				a: ['No problemo, lady.',nothing]
			}));
			labelLady.dialogue.question = 'Sorry kid, no time to talk to the likes of you. Only rock stars<br>and millionaires are allowed in here.';
			labelLady.dialogue.a = ['AKA wimps and posers!',nothing];
			swapGuy.dialogue.question = 'Hey kid, what can I do you for?';
			swapGuy.dialogue.y = ['Your girlfriend loved the record you sent her', swapGuy.tip];
		};
		labelLady.dialogue = {
			question: 'Welcome to Corporate Label Inc. We make big money! We dont have<br>time for you right now.',
			a: ['Only sellouts hang out here anyway',nothing]
		};
///////////////////////storageGuy dialogue/////////
		storageGuy.cost = 1;
		storageGuy.soldDrums = function () {
			if (records >= 80) {
				records -= 80;
				delete storageGuy.dialogue.b;
				rockerGuy.dialogue.question = 'Oi, sweet skins. Welcome to the band.';
				rockerGuy.dialogue.n = ['Lets play a show! I wanna rock!',rockerGuy.playFirstShow];
			} else {
				cantAfford();
			}
		};
		storageGuy.sellDrums = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Yeah, I can hook you up. A drum kit will cost you 80 high<br>quality prog rock records',
				y: ['Deal! Prog rock is for burnt out hippies anyway',storageGuy.soldDrums],
				n: ['Give up my precious records? no way',nothing]
			}));
		};
		storageGuy.buySpace = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Pay me ' + Math.floor(5 *storageGuy.cost) + ' dollars and you <br>can keep ' + Math.floor(records/6) + ' records, here',
				y: ['It is a deal',function() {if ( money >= (5 *storageGuy.cost)) {recordLimit += (Math.floor(records/6)); money -=Math.floor(5*storageGuy.cost); storageGuy.cost++;} else {cantAfford(); }}],
				n: ['Your prices are crazy. No way!',nothing]
			}));
		};
		storageGuy.dialogue = {
			question: 'Welcome to Junk in a Truck Storage. You can buy storage space<br>for your records here. Sometimes I have stuff for sale from<br>abandoned storage units',
			y: ['I need more room for records.',storageGuy.buySpace],
			n: ['No thanks, I can probably find more space to keep my records in<br>my room at home. I bet mom wont mind.',nothing]
		};
///////////////////////rockerGuy dialogue///////////
		rockerGuy.showsPlays = 1;
		rockerGuy.playShow = function () {
			var seconds = 15, pit = [];
			var anim = function(i) {
				var workScene = new Scene();
				var labels = ['You make money playing shows. Shows also','increase your fame, increasing your','merch income. Wait while we circle pit'];
				var newLine = 0; //used for space between text lines
				for (var j =0; j < 3; j++) { // j should be less than labels length above
					var label = new Label(labels[j]);
					label.font = '24px monospace';
					label.color = 'rgb(255,200,0)';
					label.backgroundColor = "rgb(0,0,0)";
					label.width = game.width;
					label.height = game.height;
					label.y = 2 + newLine;
					newLine += 26;
					workScene.addChild(label);
				}
				pit[i] = new Sprite(64,64);
				pit[i].scale(2,2);
				pit[i].frame = 3+(i%2); //3 or 4
				pit[i].x = 300;
				pit[i].y = 320;
				pit[i].image = game.assets['spritesheet.png'];
				workScene.addChild(pit[i]);
				game.pushScene(workScene); //ADD ROCKING IMAGE
			}
			anim(seconds);
			var workIt = setInterval( function() { game.popScene(); seconds--; anim(seconds); if (seconds <1) {game.popScene(); clearInterval(workIt);} }, 1000);
			money += 2*rockerGuy.showsPlays;
			rockerGuy.showsPlays++;
			cuteGirl.isMoney && (moneyInc += 0.0003);
		};
		rockerGuy.playFirstShow = function () {
			rockerGuy.dialogue.question = 'Our last show was so intense! I think our band might be the <br>shape of punk to come. We even made ' + (2*rockerGuy.showsPlays) + ' dollars';
			cuteGirl.dialogue.question = 'Hey, I really liked your show';
			cuteGirl.dialogue.a = ['Hey, Thanks! I like your hair',cuteGirl.flirt];
			cuteGirl.dialogue.b = ['Oh, now that I am in a band you want to talk to me?', cuteGirl.lessflirt];
			rockerGuy.dialogue.n = ['Lets play a show right now',rockerGuy.playShow];
			rockerGuy.playShow();
			cuteGirl.isMoney && (moneyInc += 0.0005);
		};
		rockerGuy.giveKilled = function() {
			game.pushScene(game.makeDialogueScene({
				question : 'Here you go, and remember, punx not dead! oi!',
				t: ['Thanks. Oi oi.',internetGuy.killed] 
			}));
			delete rockerGuy.dialogue.g;
			rockerGuy.dialogue.question = 'We are covering Los Crudos at our next show!';
		};
		rockerGuy.canJoin = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'You know, my band, The '+ bandName() + 's do need a drummer. <br>Can you play?',
				//scene within scene:
				n: ['I dont have a drum set. But I bet I can get one from somewhere!',function() {game.pushScene(game.makeDialogueScene({ 
					question: 'Get a drum set and you can totally rock with us.', a: ["I am so excited I can't control my fingers, I can't controll my <br>brain",nothing] 
				})); } ]
			}));
			rockerGuy.dialogue.question = 'Any luck with those drums yet?';
			rockerGuy.dialogue.n = ['Im still looking for the drums', nothing];
			storageGuy.dialogue.b = ['Hey, Do you have a drum set I can buy?',storageGuy.sellDrums];
		};
		//give a record 5 times and dialouge changes.
		rockerGuy.gaveRecs = (function() {
			var counts = 0;
			 return function addRec() {
				counts++;
				if (counts > 4) { 
					rockerGuy.dialogue.question = 'Oi. Thanks for all the records. Anything I can do for you?'; 
					rockerGuy.dialogue.g = ['Do you have any Killed by Death records I can have?', rockerGuy.giveKilled];
					rockerGuy.dialogue.n = ['I want to join your band!',rockerGuy.canJoin];
					rockerGuy.dialogue.m = ['Up the punx, oi!',nothing];
				}
			};
		})();
		rockerGuy.gaveRecsTalk = function() {
			var talkArray = ['Keep on rockin in the free world!', 'I love music', 'I wanna rock and roll all night...', 'Thank you', "You're not as nerdy as you look",'Thrash, kill destroy!'];
			game.pushScene(game.makeDialogueScene({
				question: talkArray[Math.floor(Math.random()*6)],
				a: ['I hope you enjoy it',nothing]
			}));
		};
		rockerGuy.dialogue = {
			question: "Oi! My band is playing a show soon, you should come check us<br>out. I hear you have a bunch of records. Let me have one.",
			g: ['Uhh, ok. You can have one of my records',function() {if (records >=1  ) {records--;rockerGuy.gaveRecs();rockerGuy.gaveRecsTalk();} else { cantAfford();}}],
			n: ['What? Get your own records, you bum.',nothing],
		};

///////////////////////cuteGirl dialogue////////////
		cuteGirl.isPrez = function () {
			game.pushScene(game.makeDialogueScene({
				question: 'This is so cool! I love your band! I cant wait for the next show',
				a: ['Thanks for supporting our band. You are really helping us bring in more money', nothing]
			}));
			cuteGirl.dialogue.question = 'I love running your merch! You should play more shows. We<br>should also hang out sometime';
			delete cuteGirl.dialogue.a;
			cuteGirl.dialogue.b = ['Yeah, that would be cool, but first I want to get a few more <br>records',nothing];
			moneyInc += 0.0006;
			cuteGirl.isMoney = true;
		};
		cuteGirl.isNotPrez = function () {
			cuteGirl.dialogue.question = 'Hey, so maybe I can sell merch for you now?';
			cuteGirl.dialogue.a =['Yeah, I think that is a good idea.',cuteGirl.isPrez];
			cuteGirl.dialogue.b = ['hmm, yeah, I dont think so.', nothing];
		};
		cuteGirl.flirt = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Thanks! Hey does your band need a merch lady? <br>I can help get cash and records for you by selling and<br>trading your merch',
				a: ['Totally! It would be really cool to have you work with us',cuteGirl.isPrez],
				b: ['No thanks. We do pretty well already. <br>But you should come check out our next show.',cuteGirl.idNotPrez]
			}));
		};
		cuteGirl.lessflirt = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Hey, come on, I always thought you were cute. What if I offered to sell merch for your band? I can help you trade records even outside of shows.',
				a: ['Yeah, it would be cool to make some extra records. You got a deal',cuteGirl.isPrez],
				b: ['You were too good to talk to me before, now my band is too good for you. No thanks.',cuteGirl.isNotPrez]

			}));
		};
		cuteGirl.denied = function () {
			game.pushScene(game.makeDialogueScene({
				question : "Leave me alone, you record dork.",
				a: ['Oh, excuse me.',nothing],
				b: ['Was it something I said or something I did? <br>Did my words not come out right?',nothing]
			}));
			cuteGirl.dialogue.question = 'I got no time for scrubs. Your records dont impress me.';
			cuteGirl.dialogue.a = ['Ouch, I guess every rose has its thorn',nothing];
		};
		cuteGirl.dialogue = {
			question : "...",
			a: ["Hi, how's it going?",cuteGirl.denied]
		};
///////////////////////internetGuy /////////////
		internetGuy.flipCost = 2;
		internetGuy.flip = function() {
			game.pushScene(game.makeDialogueScene({
				question: 'Neat, give me ' + internetGuy.flipCost*60 + ' records and I will flip them',
				y: ['Yeah, I think of this as an investment, here you go', function() { if (records>= internetGuy.flipCost*60) {records -= internetGuy.flipCost*60; recordInc += 0.0005; internetGuy.flipCost+=1;} else { cantAfford();} }],
				a: ['No thanks, the internet is for porn not flipping records',nothing]
			}));
		};
		internetGuy.questDone = function() {
			game.pushScene(game.makeDialogueScene({
				question: "Hah! I bet. Do you like Math rock? I can flip records for you on<br>the internet. Give me some to start with and I will<br>multiply them",
				a: ['Yeah, that sounds good. Flip me some records, dude.',internetGuy.flip],
				b: ['Maybe some other time. I dont really trust computers',nothing]
			}));
			internetGuy.dialogue.question = 'Hey d00d, want me to flip some records for you on the net?';
			internetGuy.dialogue.a = ['Yeah, I want to get more records!',internetGuy.flip];
			internetGuy.dialogue.b = ['Not right now.', nothing];
		};
		internetGuy.killed = (function() {
			var count =0;
			return function addRed() {
				count++;
				if (count > 2) {
					internetGuy.dialogue.question = 'Sweet, you found all the Killed by Death records I wanted';
					internetGuy.dialogue.a = ['It was easy.',internetGuy.questDone];
				}
			};
		})();
		internetGuy.dialogue = {
			question: 'I trade records on the Internet. Only rare ones. I might be<br>willing to work for you if you can find me 3 Killed by<br>Death records.',
			a: ['I bet I can find them all',function() {internetGuy.dialogue.question = 'You still have not found all the Killed by Death records, huh?'; delete internetGuy.dialogue.b;}],
			b:['Nerd, find your own records!',nothing]			
		};
////////////////////////security dialoge
		security.dialogue = {
			question: 'Best not be trying to steal anything, you dumb kid.',
			a: ['I would not dream of it',nothing]
		};
///////////////////////recordStoreReords///////
		recordStoreRecords.killed = true;
		recordStoreRecords.stole = function () {
			if ((Math.random()*3.5) <recStoreOwner.shopliftCost ) { //the more you get caught the more likely you will be to get caught again
				recStoreOwner.shopliftCost += 0.3;
				if (recStoreOwner.shopliftCost >3.2) { recStoreOwner.shopliftCost =3;}
				game.pushScene(game.makeDialogueScene({
					question:"Son, you ain't no Pretty Boy Floyd. You just got caught<br>stealing. We are taking a fifth of your recrods away",
					a: ['Instead of going to jail I am willing to pay<br>Here, take my records!', function () { records -= records/5; }] 
				}));
				security.dialogue.question = 'Seems like shoplifters have to pay more for records around here<br>Stupid kid, dont try to steal anything else!';
				security.dialogue.a = ['I was framed!',nothing];
			} else {
				var q = '';
				if (recordStoreRecords.killed) {
					q = ' And a Killed by Death record!';
					internetGuy.killed();
					recordStoreRecords.killed = false;
				}
				game.pushScene(game.makeDialogueScene({
					question: 'Shoplifters of the world unite, you just got away with 15 <br>free records' + q,
					a: ['I fought the law, and I won!',function() {records += 15; } ]
				 }));
			}
		}; //end stole
		recordStoreRecords.dialogue = {
			question: 'Look at all these records!',
			a: ['I bet I could take a few without anyone noticing. <br>I will take some!',recordStoreRecords.stole],
			b: ['One day these will all be mine. If I want any right now I<br>need to buy them from the owner',nothing]
		};
///////////////////////storageSpace///////////////
		storageSpace.choseDoor = function() {
			var ann,qu,gainedRecs = 10; 
			if (Math.random()*3 <  1) {
				qu = 'Awesome, the space you chose to clean had a bunch of records!<br>You just gained ' + gainedRecs + ' records!';
				ann = 'All due to a positive mental attitude';
				records += gainedRecs;
			}  else {
				qu = 'Shoot, you did not find anything other than lint and <br>hairballs in the storage space. Better luck next time';
				ann = "That's what it's like workin for the Man every night and day";
			}
			game.pushScene(game.makeDialogueScene({
				question: qu,
				b: ['I want to clean some more!',storageSpace.clean],
				a: [ann,nothing]
			}));
		};
		storageSpace.clean = function() {
			var scene = new Scene();
			scene.backgroundColor = 'black';
			var label = new Label('Select a storage space to clean');
			label.font = '20px monospace';
			label.textAlign = 'center';
			label.color = 'rgb(0,255,0)';
			scene.addChild(label);
			var door = [];
			var doorX = 116;
			function chooseADoor() { //used bellow to avoind function in loop
				return function() {
					game.popScene();
					storageSpace.choseDoor();
				};
			}
			for (i =0; i < 3; i++ ) {
				door[i] = new Sprite(64,64);
				door[i].scale(2,2);
				door[i].image = game.assets['spritesheet.png'];
				door[i].frame = 13;
				door[i].x = doorX;
				doorX += 140;
				door[i].y = 320;
				scene.addChild(door[i]);
				door[i].addEventListener(Event.TOUCH_START, chooseADoor());	
			}
			game.pushScene(scene);
		};
		storageSpace.dialogue = {
			question : 'Do you want to help clean out storage units? We<br>cannot afford to  pay you.',
			y: ['Sure, I can help you out and I might find something cool<br>in there',storageSpace.clean],
			n: ['No thanks, I dont work for free.',nothing]
		};
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
		//storage space label
		var storageLabel = new Label('Storage Space: ' + recordLimit);
		storageLabel.x = 10;
		storageLabel.y = 24;
		storageLabel.color = 'black';
		//label for money
		var moneyLabel = new Label('Money:   ' + money);
		moneyLabel.x = 10;
		moneyLabel.y = 38;
		moneyLabel.color = "black";
		
		//updates recods lablel
		recordLabel.addEventListener(Event.ENTER_FRAME, function(e) {
			records += recordInc *e.elapsed;
			//checks record limits 
			if (records > recordLimit) {
				records = recordLimit;
			}
			this.text = "Records: " +(Math.round(records*100)/100);
		});
		//storage space label
		storageLabel.addEventListener(Event.ENTER_FRAME, function() {
			this.text = 'Storage Space: ' + recordLimit;
		});
		//update money label
		moneyLabel.addEventListener(Event.ENTER_FRAME, function(e) {
			money += moneyInc * e.elapsed; //e.elapsed accounts for time 
                                                       //so even if game
                                                       //is not in main tab
                                                       //money adds up
			this.text = 'Money:   ' + (Math.round(money*100)/100);
		});
		
		//checks to seeif dialogue needs to change
		function checkStats() {
			if (records > recordLimit && !hero.hasRecStore) {
				mom.dialogue.question = 'There is no more room in this house for records! You have to <br>find somewhere else to keep them!';
			} 
			if (money > 400 && recStoreOwner) {
				recStoreOwner.dialogue.j = ['I want to buy your shop!',recStoreOwner.buyShop];
			} else {
				recStoreOwner.dialogue.j = ['Can I do some work around here?',recStoreOwner.job];
			}
			if (money > 1400 || records > 1400) {
				labelLady.dialogue.question = 'Wow, you sure have done well for yourself. How can Corporate <br>Label Inc. help you?';
				if (money > 1400) {
					labelLady.dialogue.c = ['I want to buy this record label and become CEO!', hero.buyLabel];
				} else { 
					delete labelLady.dialogue.c;
				}
				if (records > 1400) {
					labelLady.dialogue.b = ['I want to sell my whole record collection', hero.sellCollection];
				} else { 
					delete labelLady.dialogue.b;
				}
			}
		} //end of checkStats

		hero.addEventListener(Event.ENTER_FRAME, function() {
			//moves NPC the same amount as floor got moved
			//has to happen before floor values change or 
			//have to change the NPC to be drawn after the hero
			mom.x = 90+floor.x; 
	                mom.y = 50+floor.y;
			recStoreOwner.x = 355+floor.x;
			recStoreOwner.y = 210+floor.y;
			recordStoreRecords.x = 505+floor.x;
			recordStoreRecords.y = 206+floor.y;
			freeRecord.x = 724+floor.x;
			freeRecord.y = 640+floor.y;
			swapGuy.x = 680+floor.x;
			swapGuy.y = 50+floor.y; 
			labelLady.x = 530+floor.x;
			labelLady.y = 750+floor.y;
			storageGuy.x = 670+floor.x;
			storageGuy.y = 440+floor.y;
			rockerGuy.x = 224+floor.x;
			rockerGuy.y = 610+floor.y;
			cuteGirl.x = 110+floor.x;
			cuteGirl.y = 608+floor.y;
			internetGuy.x = 90+floor.x;
			internetGuy.y = 330+floor.y;
			storageSpace.x = 740+floor.x;
			storageSpace.y = 400+floor.y;
			security.x = 450+floor.x;
			security.y = 280+floor.y;
			
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
		var npcLength = npcArray.length;
		for (var i = 0; i < npcLength; i++ ) {
			var curNpc = npcArray[i];
			if(hero.within(curNpc, 16) ) { //number  is radius of collision
				if (!curNpc.hit) { 
					checkStats(); //checks and makes needed dialogue updates
					game.pushScene(game.makeDialogueScene(curNpc.dialogue)); //adds dialogue box
					curNpc.hit = true;
				}
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
		for (i=0; i < npcCount; i++) {
			game.rootScene.addChild(npcArray[i]);
		}
		game.rootScene.addChild(hero);
		game.rootScene.addChild(recordLabel);
		game.rootScene.addChild(moneyLabel);
		game.rootScene.addChild(storageLabel);
		//recCost = (Math.floor(records/20) + 2); //increase cost of records. maybe move this?
		//recMultiplier = 1 + Math.floor(records/10); //increases exchange amounts
	}; //end rootScene

	//dialogue box for when collision with sprit happens
	//takes object {question:'text',label:['text',function],etc}
	game.makeDialogueScene = function(dialogueIn) {
		var scene = new Scene();

		var startY = 400;
		var incrementY = 48;
		var keys = Object.keys(dialogueIn);
		var talk = [];
		talk[0] = new Label(dialogueIn.question); //queston is not clickable and white
		talk[0].font = "16px monospace";
		talk[0].color = "rgb(255,255,255)";
		talk[0].backgroundColor = "rgba(0,0,0,0.8)";
		talk[0].y = 400;
		talk[0].width = game.width;
		talk[0].height = game.height - 400; //400 = game not covered by text
                scene.addChild(talk[0]);
		for (var i = 1, j = keys.length; i < j; i++ ) {
			talk[i] = new Label(dialogueIn[keys[i]][0]);
			talk[i].font = "16px monospace";
			talk[i].color = "rgb(255,255,0)";
			talk[i].y = (startY += incrementY);
			talk[i].width = game.width;
			talk[i].height = game.height - 400; //400 = game not covered by text
			scene.addChild(talk[i]);
		}
		//popBellow is used in the foor loop bellow. avoiding having to use closure. 
		function popBellow(x) {
			return function() {
			game.popScene();
				dialogueIn[keys[x]][1]();
			};
		} 
		for (var i = 1; i < keys.length; i++ ) {
			talk[i].addEventListener(Event.TOUCH_START, popBellow(i));
		}
		return scene;
	}; //end of makeDialogueScene

//////////functions:
	var nothing = function() {};

	//creates random band name
	function bandName() {
		var first = ['Liqued', 'Rancid', 'Squishy', 'Brown', 'Swampy', 'Edgy', 'Monotone'];
		var second = ['Toast', 'Brain', 'Bone', 'Animal','Worm','Graphic'];
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
	
	//makes sure hero can afford something	
	function cantAfford() {
		game.pushScene(game.makeDialogueScene({
			question: 'Quit trying to cheat the system, you cannot afford that!',
			a: ['Sorry, sometimes I dont know how to math',nothing]
		}));
	}
	game.start();
};

