//initialize the player information
var player1 = {
	lifeTotal: 20,
	isTurn: true, //player1 always go first
	manapool: {
		red: 0,
		green: 0,
		blue: 0,
		black: 0,
		white: 0,
		colorless: 0
	},
	cardsInHand: [],
	cardsInPlay: [],
	cardsInGraveyard: [],
	cardsInDeck: [],
	playLand: false 
};

var player2 = {
	lifeTotal: 20,
	isTurn: false,
	manapool: {
		red: 0,
		green: 0,
		blue: 0,
		black: 0,
		white: 0,
		colorless: 0
	},
	cardsInHand: [],
		//name of cards that player has in hand?
		//feed in the cards here when you first get them
		//there will be land and creature cards
	cardsInPlay: [],
		//creatures that the player has put onto the field
	cardsInGraveyard: [],
		//start Empty and will add to as creatures die
	cardsInDeck: [],
	playLand: false //to keep track of whether played a land that turn
}; 

var showHand = $("#showHand");
var player1TurnCount = 1;

$(function() { 
	//query the API to get card information
	var obj = $.getJSON("https://mtgjson.com/json/LEA.json", function() { 
	 		//console.log(obj.responseJSON);
		});

	//make the arrays equal
	//create the AI, make it equal to player1
});

//prints cards in hand 
var displayHand = function() {
	var hand = player1.cardsInHand; //array of cards
	for (i=0; i<hand.length; i++) {
		var thisId = player1.cardsInHand[i].cardId;
		showHand.append("<div class='hasCard' style='background-image: url(img/"+ hand[i].image + 
			")' onclick=select(this.id) id="+ thisId +"></div>");	
	}
}

var select = function(clickId) { //use buttons on the side of the screen to move cards around
	$("#playCard").css("visibility", "visible");
	var selectedCard = clickId; //pass on this selected card ID to the button, call the button function within this function
	$("#playCard").attr("onclick", "clickButton(" + selectedCard + ")");	
}

var selectOnField = function(idName) {
	//prints the cardId of the clicked card
	var selectedDiv = idName;
	$("#tapCard").attr("onclick", "tapCard(" + selectedDiv + ")");
	$("#attack").attr("onclick", "attackFunc("+ selectedDiv+ ")");
}

var tapCard = function(classId) {
	var selectedId = $(classId).attr("id");
	//get the cardtype of the card as creature/land
		//returns {currentCard}, that is being played

	var currentObj = findCard(player1.cardsInPlay, selectedId);

	if (currentObj.hasOwnProperty("mana")) { //tapping a land
		if (!($("#" + selectedId + "").hasClass("rotated"))) {
			$("#" + selectedId + "").addClass("rotated"); 
			player1.manapool.colorless++;
			console.log(player1.manapool.colorless);

		} else if ($("#" + selectedId + "").hasClass("rotated")) {
			$("#" + selectedId + "").removeClass("rotated");
			player1.manapool.colorless--;
			console.log(player1.manapool.colorless);
		}
	} else { //tapping creature
		if (!($("#" + selectedId + "").hasClass("rotated")) && currentObj.hasSickness === false) { //if does not have class rotated && hasSickness is false
			$("#" + selectedId + "").addClass("rotated"); 
			currentObj.isTapped = true;

		} else if (!($("#" + selectedId + "").hasClass("rotated"))) {
			alert("Creature has summoning sickness!")

		} else if ($("#" + selectedId + "").hasClass("rotated")) {
			$("#" + selectedId + "").removeClass("rotated");
			currentObj.isTapped = false;
		}
	}
}

var attackFunc = function(classId) {
	var selectedId = $(classId).attr("id"); //gets id of selected card when Attack is hit
	
}

var endTurnFunc = function() {
	if (player1.isTurn === true) {
		player1.isTurn = false;
		player2.isTurn = true;
		alert("End player1 turn, player 2 start upkeep");
		player1TurnCount++;
		return player2Turn();
	} else {
		player2.isTurn = false;
		player1.isTurn = true;
	} 
		//untap the creatures
	$(".player1Field").children("div").each(function(){
		if (this.classList.contains("rotated")) {
			this.classList.remove("rotated");
		}
	});

		//remove all summoning sickness from creatures
	$(".player1Field").children("div").each(function(){
		var currCard = findCard(player1.cardsInPlay, this.id);
		if (currCard.hasSickness) {
			currCard.hasSickness = false;
		}
	});

		alert("End player2 turn, player 1 start upkeep");	
}

var player2Turn = function() {
	console.log("Player 2 goes...")
	player2.playLand = false;
	//draw a card on upkeep
	//play the first land in the hand, if applicable
	untapLands();
	drawCard(player2);
	playLandAI();
	playCreatureAI();
	endTurnFunc();
}

var playLandAI = function() {
	//search hand for land
	for (i=0; i<player2.cardsInHand.length; i++) {
		var currCard = player2.cardsInHand[i];

		if (currCard.hasOwnProperty("mana")) {
			currCard = currCard;
			//remove card from player2.cardsInHand 
			player2.cardsInHand.splice(i, 1);
			player2.cardsInPlay.push(currCard);
			player2.playLand = true;
			break;
		} else {
			//console.log("mana fck");
		}
	}
	//play the land
	$(".player2Field").append("<div class='hasCard' style='background-image: url(img/"+ currCard.image + 
			")' id="+ currCard.cardId +"></div>");
}

var playCreatureAI = function() {
	//find how much potential mana
		//iterate over the creatures in hand
		//if their mana cost is equal to or less than the potential mana, play the creature
		//if no creatures found, break
	//redefine potential mana
		//iterate over creatures again, if can play creature
		//if no creatures, break
	//...
	var potentialMana = 0;
	var potentialCreatures = [];

	for (i=0; i<player2.cardsInPlay.length; i++) { //search cardsInPlay for potential mana
		if (player2.cardsInPlay[i].hasOwnProperty("mana")) {
			var currCardId = player2.cardsInPlay[i].cardId;
			$("#"+currCardId+"").addClass("rotated"); //make sure to untap the lands on every new turn start
			//console.log("found a potential land");
			potentialMana++;
		}
	}

	for (i=0; i<player2.cardsInHand.length; i++) { //search for potential cards
		if (player2.cardsInHand[i].hasOwnProperty("manaCost") && player2.cardsInHand[i].manaCost <= potentialMana) {
			//cool, let's play that card
			var currCard = player2.cardsInHand[i];

			$(".player2Field").append("<div class='hasCard' style='background-image: url(img/"+ currCard.image + 
			")' id="+ currCard.cardId +"></div>");
			break;
		}
	}
}

var untapLands = function() {
	$(".player2Field").children("div").each(function(){
		//this displays the current div that's on the each Loop
		if (this.classList.contains("rotated")) {
			this.classList.remove("rotated");
			//var currCardId = this.getAttribute("id");
		}
	});
}

//to click on the button, send the object into the cardsInPlay array
//send the card visibly onto the battlefield
var clickButton = function(param) {
//find the card that has this id attribute and check if the Mana cost is <= the colorless mana
	var selectedCard = $(param).attr("id"); //the ID of the selected card
	var newOnclick = param;
	var currentCard = player1.cardsInHand; //the object of the selected card

	var cardToBattlefield = function() {
	$(".player1Field").append(param);
	$("#"+selectedCard+"").prop("onclick", null);
	$("#"+selectedCard+"").attr("onclick", "selectOnField(this.id)");

		for (var i=0; i<player1.cardsInHand.length; i++) {
			if (player1.cardsInHand[i].cardId === selectedCard) {
				player1.cardsInPlay.push(player1.cardsInHand[i]); //push card to inPlay array
				player1.cardsInHand.splice(i, 1); //splice out the card
				break;
			}
		}
	}

	//returns {currentCard}, that is being played
	for (var k=0; k<player1.cardsInHand.length; k++) {
		var currentCardId = player1.cardsInHand[k].cardId;
		if (currentCardId === selectedCard) {
			//the card IDs match
			var currentCard = currentCard[k];
			break;
		} else {
			//no match
		}
	}

	if (currentCard.hasOwnProperty("mana")) {
		//alert("played a land");
		cardToBattlefield();
	} else if (player1.manapool.colorless >= currentCard.manaCost) {
		//play creature
		player1.manapool.colorless = player1.manapool.colorless - currentCard.manaCost;
		cardToBattlefield();
	} else {
		alert("not enough mana");
	}

	//FIX THE THING ABOUT THE MULTIPLE CARD NAME	
	// .remove()/return the element
}

var drawCard = function(player) {
	var hand = player.cardsInHand; //array of cards
	
	if (player === player1) { //if you're drawing a card as player1
		if (player.cardsInHand.length > 7) {
			alert("hand size cannot exceed 7 cards");
		} else {
			var newCard = player.cardsInDeck.shift(); //remove the card and store as newCard
			player.cardsInHand.push(newCard);
			showHand.append("<div class='hasCard' style='background-image: url(img/" + newCard.image +
			")' onclick=select(this.id) id="+ newCard.cardId +"></div>"); //id should equal this.id	
		}	
	} else { //must be player2
		if (player.cardsInHand.length > 7 && player1TurnCount > 2) { 
			console.log("player2 hand size cannot exceed 7 cards");
		} else {
			var newCard = player.cardsInDeck.shift(); //remove the card and store as newCard
			player.cardsInHand.push(newCard);
			console.log("PLAYER 2 DREW CARD");
		}
	}
}

var generateDecks = function() { //generate the player decks, possible to have two IDs of the same...
	//from the creatures array grab 30 cards randomly, no more than 4 of each card
	//generate a reasonable amount of lands
	//push these into an ordered list, Last In First Out

	//generate 30 random Creatures, place into players deck
	for (let i=0; i<30; i++) {
		var randNum1 = Math.floor(Math.random()*allCreatures.length); //rand creature
		var newCard = JSON.parse(JSON.stringify(allCreatures[randNum1])); //random element of Creatures array
		player1.cardsInDeck.push(newCard); //push card into deck
	}

	for (let i=0; i<30; i++) {
		var randNum2 = Math.floor(Math.random()*allCreatures.length);
		var newCard = JSON.parse(JSON.stringify(allCreatures[randNum2]));
		player2.cardsInDeck.push(newCard);
	}
	
	//generate 15 random lands
	for (let j=0; j<15; j++) {
		var randNum1 = Math.floor(Math.random()*allLands.length);
		var newLand = JSON.parse(JSON.stringify(allLands[randNum1]));
		player1.cardsInDeck.push(newLand);
	}

	for (let j=0; j<15; j++) {
		var randNum2 = Math.floor(Math.random()*allLands.length);
		var newLand = JSON.parse(JSON.stringify(allLands[randNum2]));
		player2.cardsInDeck.push(newLand);
	}

	for (let i=0; i<player1.cardsInDeck.length; i++) {
		player1.cardsInDeck[i].cardId = "card" + i;
	}

	for (let i=0; i<player2.cardsInDeck.length; i++) {
		player2.cardsInDeck[i].cardId = "card" + i;
	}

	shuffle(player1.cardsInDeck);
	shuffle(player2.cardsInDeck);
	//console.log(player1.cardsInDeck);
	//console.log(player2.cardsInDeck);
}

//shuffle function pulled from stackOverflow
function shuffle(array) {

	var currentIndex = array.length, temporaryValue, randomIndex;

	//while there are elements to shuffle...
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random()*currentIndex);
		currentIndex--;

		//swap with the current element
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

var generateHands = function() { //generate the player hands, good for now
	for (var i=6; i>=0; i--) {
		var index1 = player1.cardsInDeck.splice(i,1);
		player1.cardsInHand.push(index1[0]);	
		var index2 = player2.cardsInDeck.splice(i,1);
		player2.cardsInHand.push(index2[0]);	
	}
}

//finds the card Obj, enter array (player1.array) to search and cardId,  
var findCard = function(array, currentId) {
	for (i=0; i<array.length; i++) {
		var loopCardId = array[i].cardId;
		if (loopCardId === currentId) {
			var currentCard = array[i]; //the object of the matching position
			return currentCard
		}
	}
}

var upkeep = function() {
	//FOR player.isTurn = true
	//move next card from cardsInDeck and place into cardsInHand
	//cardsOnField.isTapped = false
}

var firstMain = function() {
	//Play Land? If yes, player.playLand = true; add the played mana to the board
	//Play creature? If enough mana in manapool, tap mana; remove creature from cards in hand; add creature to cardsOnField
	//populate field DIV with the information of the creature that was played
	//for creatures put onto field, creature.hasSickness = true
}

var combat = function() {
	//for player.creaturesInPlay if hasSickness = false,
	//Assign attackers
		//attacking creature.isTapped = true
		//if no blockers at all then otherPlayer.life = otherPlayer.life - attackingCreature.toughness
			//do damage to defending player
		//Assign Blockers
			//if hasCreature.toughness > attackCreature.power 
				//BLOCK and NO DAMAGE
			//else if SUM (potential blockers.toughness) > attackingCreature.power
				//BLOCK and NO DAMAGE
			//else if (Have Small Blocker) Block with Smallest creature.toughness
				//Block and Small creature Dies (REMOVE CREATURE FROM GAME)
					//place creature in player.cardsInGraveyard
}

var secondMain = function() {
	//secondmain stuff, same as firstMain?
		//Play Land? If yes, player.playLand = true; add the played mana to the board
		//Play creature? If enough mana in manapool, tap mana; remove creature from cards in hand; add creature to cardsOnField
		//populate field DIV with the information of the creature that was played
		//for creatures put onto field, creature.hasSickness = true
	//player.isTurn = false, change the player who has the turn
}

var endTurn = function() {
	//find user where isTurn is false, change to true
	//change the other player isTurn to false 
}

var gameLogic = function() {
// 	//start game logic 
// 	if (player1.lifeTotal > 0 && player2.lifeTotal > 0) {
// 		//continue to play the game
// 		upkeep();
// 		firstMain();
// 		combat();
// 		secondMain();
// 	} else {
// 		if (player1.lifeTotal > 0) {
// 			console.log("Player 1 wins");
// 		} else {
// 			console.log("Player 2 wins");
// 		}
// 	}
}

//land array
var allLands = [{
	name: "Swamp",
	mana: 1,
	image: "swamp.jpg"
},
{
	name: "Plains",
	mana: 1,
	image: "plains.jpg"
},
{
	name: "Forest",
	mana: 1,
	image: "forest.jpg"
},
{
	name: "Mountain",
	mana: 1,
	image: "mountain.jpg"
},
{
	name: "Island",
	mana: 1,
	image: "island.jpg"
}];

//creature array, still need to add the URL information
var allCreatures = [{
	name: "Air Elemental",
	power: 4,
	toughness: 4,
	manaCost: 5, 
	hasFlying: true,
	hasSickness: true,
	isTapped: false,
	image: "air-elemental.jpg"
},
{
	name: "Birds Of Paradise",
	power: 0,
	toughness: 1,
	manaCost: 1, 
	hasFlying: true,
	hasSickness: true,
	isTapped: false,
	image: "birds-of-paradise.jpg"
},
{
	name: "Craw Wurm",
	power: 6,
	toughness: 4,
	manaCost: 6, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "craw-wurm.jpg"
},
{
	name: "Earth Elemental",
	power: 4,
	toughness: 5,
	manaCost: 5, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "earth-elemental.jpg"
},
{
	name: "Fire Elemental",
	power: 5,
	toughness: 4,
	manaCost: 5, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "fire-elemental.jpg"
},
{
	name: "Giant Spider",
	power: 2,
	toughness: 4,
	manaCost: 4, 
	hasFlying: false,
	hasReach: true,
	hasSickness: true,
	isTapped: false,
	image: "giant-spider.jpg"
},
{
	name: "Gray Ogre",
	power: 2,
	toughness: 2,
	manaCost: 3, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "gray-ogre.jpg"
},
{
	name: "Grizzly Bears",
	power: 2,
	toughness: 2,
	manaCost: 2, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "grizzly-bears.jpg"
},
{
	name: "Hill Giant",
	power: 3,
	toughness: 3,
	manaCost: 4, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "hill-giant.jpg"
},
{
	name: "Hurloon Minotaur",
	power: 2,
	toughness: 3,
	manaCost: 3, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "hurloon-minotaur.jpg"
},
{
	name: "Ironroot Treefolk",
	power: 3,
	toughness: 5,
	manaCost: 5, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "ironroot-treefolk.jpg"
},
{
	name: "Mahamoti Djinn",
	power: 5,
	toughness: 6,
	manaCost: 6, 
	hasFlying: true,
	hasSickness: true,
	isTapped: false,
	image: "mahamoti-djinn.jpg"
},
{
	name: "Merfolk Of The Pearl Trident",
	power: 1,
	toughness: 1,
	manaCost: 1, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "merfolk-of-the-pearl-trident.jpg"
},
{
	name: "Mons's Goblin Raiders",
	power: 1,
	toughness: 1,
	manaCost: 1, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "monss-goblin-raiders.jpg"
},
{
	name: "Obsianus Golem",
	power: 4,
	toughness: 6,
	manaCost: 6, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "obsianus-golem.jpg"
},
{
	name: "Pearled Unicorn",
	power: 2,
	toughness: 2,
	manaCost: 3, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "pearled-unicorn.jpg"
},
{
	name: "Phantom Monster",
	power: 3,
	toughness: 3,
	manaCost: 5, 
	hasFlying: true,
	hasSickness: true,
	isTapped: false,
	image: "phantom-monster.jpg"
},
{
	name: "Roc Of Kher Ridges",
	power: 3,
	toughness: 3,
	manaCost: 4, 
	hasFlying: true,
	hasSickness: true,
	isTapped: true,
	image: "roc-of-kher-ridges.jpg"
},
{
	name: "Savannah Lions",
	power: 2,
	toughness: 1,
	manaCost: 1, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "savannah-lions.jpg"
},
{
	name: "Scathe Zombies",
	power: 2,
	toughness: 2,
	manaCost: 3, 
	hasFlying: false,
	hasSickness: true,
	isTapped: false,
	image: "scathe-zombies.jpg"
},
{
	name: "Scryb Sprites",
	power: 1,
	toughness: 1,
	manaCost: 1, 
	hasFlying: true,
	hasSickness: true,
	isTapped: false,
	image: "scryb-sprites.jpg"
},
{
	name: "Serra Angel",
	power: 4,
	toughness: 4,
	manaCost: 5, 
	hasFlying: true,
	hasDefender: false,
	hasVigilance: true,
	hasSickness: true,
	isTapped: false,
	image: "serra-angel.jpg"
},
{
	name: "Wall Of Air",
	power: 1,
	toughness: 5,
	manaCost: 3, 
	hasFlying: true,
	hasDefender: true,
	hasSickness: true,
	isTapped: false,
	image: "wall-of-air.jpg"
},
{
	name: "Wall Of Ice",
	power: 0,
	toughness: 7,
	manaCost: 3, 
	hasFlying: false,
	hasDefender: true,
	hasSickness: true,
	isTapped: false,
	image: "wall-of-ice.jpg"
},
{
	name: "Wall Of Stone",
	power: 0,
	toughness: 8,
	manaCost: 3, 
	hasFlying: false,
	hasDefender: true,
	hasSickness: true,
	isTapped: false,
	image: "wall-of-stone.jpg"
},
{
	name: "Wall Of Swords",
	power: 3,
	toughness: 5,
	manaCost: 4, 
	hasFlying: true,
	hasDefender: true,
	hasSickness: true,
	isTapped: false,
	image: "wall-of-swords.jpg"
},
{
	name: "Wall Of Wood",
	power: 0,
	toughness: 3,
	manaCost: 1, 
	hasFlying: false,
	hasDefender: true,
	hasSickness: true,
	isTapped: false,
	image: "wall-of-wood.jpg"
},
{
	name: "Water Elemental",
	power: 5,
	toughness: 4,
	manaCost: 5, 
	hasFlying: false,
	hasDefender: false,
	hasSickness: true,
	isTapped: false,
	image: "water-elemental.jpg"
}];


generateDecks();
generateHands();
displayHand();



