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
}

var tapCard = function(classId) {
	var selectedId = $(classId).attr("id");
	//get the cardtype of the card as creature/land
		//returns {currentCard}, that is being played

	var currentObj = findCard(player1.cardsInPlay, selectedId);

	if (~selectedId.indexOf("land")) {
		//console.log("LAND");
		if (!($("#" + selectedId + "").hasClass("rotated"))) {
			$("#" + selectedId + "").addClass("rotated"); //this works to tap
			player1.manapool.colorless++;
			console.log(player1.manapool.colorless);

		} else if ($("#" + selectedId + "").hasClass("rotated")) {
			$("#" + selectedId + "").removeClass("rotated");
			player1.manapool.colorless--;
			console.log(player1.manapool.colorless);
		}
	} else {
		//so tapping a creature is the same as attacking...
		//EMPLOY ATTACKING LOGIC
		//make an attack button and on click it'll attack with all of the tapped creatuers. 
		if (!($("#" + selectedId + "").hasClass("rotated"))) {
			$("#" + selectedId + "").addClass("rotated"); //this works to tap
			currentObj.isTapped = true;

		} else if ($("#" + selectedId + "").hasClass("rotated")) {
			$("#" + selectedId + "").removeClass("rotated");
			currentObj.isTapped = false;
		}
	}
}

var endTurn = function() {
	//find user where isTurn is false, change to true
	//change the other player isTurn to false 
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
	} else if (player1.manapool.colorless >= currentCard.manaCost.colorless) {
		//play creature
		cardToBattlefield();
	} else {
		alert("not enough mana");
	}

	//FIX THE THING ABOUT THE MULTIPLE CARD NAME	
	// .remove()/return the element
}

var drawCard = function() {
	var hand = player1.cardsInHand; //array of cards
	if (player1.cardsInHand.length >= 7) {
		alert("hand size cannot exceed 7 cards");
	} else {
		var newCard = player1.cardsInDeck.shift(); //remove the card and store as newCard
		player1.cardsInHand.push(newCard);
		showHand.append("<div class='hasCard' style='background-image: url(img/" + newCard.image +
		")' onclick=select(this.id) id="+ newCard.cardId +"></div>"); //id should equal this.id	
	}
}

var generateDecks = function() { //generate the player decks, possible to have two IDs of the same...
	//from the creatures array grab 30 cards randomly, no more than 4 of each card
	//generate a reasonable amount of lands
	//push these into an ordered list, Last In First Out

	//generate 30 random Creatures, place into players deck
	for (var i=0; i<30; i++) {
		//console.log(i);
		var randNum1 = Math.floor(Math.random()*allCreatures.length); //rand creature
		var newCard = allCreatures[randNum1]; //random element of Creatures array
		newCard.cardId = "card" + i; //give card ID
		player1.cardsInDeck.push(newCard); //push card into deck
	}

	for (var i=0; i<30; i++) {
		var randNum2 = Math.floor(Math.random()*allCreatures.length);
		var newCard = allCreatures[randNum2];
		newCard.cardId = "card" + i;
		player2.cardsInDeck.push(allCreatures[randNum2]);
	}
	
	//generate 15 random lands
	for (var j=0; j<15; j++) {
		var randNum1 = Math.floor(Math.random()*allLands.length);
		var newLand = allLands[randNum1];
		newLand.cardId = "land" + j;
		player1.cardsInDeck.push(allLands[randNum1]);
	}

	for (var j=0; j<15; j++) {
		var randNum2 = Math.floor(Math.random()*allLands.length);
		var newLand = allLands[randNum2];
		newLand.cardId = "land" + j;
		player2.cardsInDeck.push(allLands[randNum2]);
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
//TAKE IN THE GENERATEDECK 
	//iterate randomly over the all creatures array
	//place these cards into the player.cardsInHand -- do this p1 and p2 separately
	//Give 3 lands; 4 creatures
	//no specific order of cards
	for (var i=6; i>=0; i--) {
		var index1 = player1.cardsInDeck.splice(i,1);
		player1.cardsInHand.push(index1[0]);	
		var index2 = player2.cardsInDeck.splice(i,1);
		player2.cardsInHand.push(index2[0]);	
	}
	//console.log(player1.cardsInHand);
	//console.log(player2.cardsInHand);
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
	manaCost: {
		blue: 2,
		colorless: 3
	}, 
	hasFlying: true,
	hasSickness: false,
	isTapped: false,
	image: "air-elemental.jpg"
},
{
	name: "Birds Of Paradise",
	power: 0,
	toughness: 1,
	manaCost: {
		green: 0,
		colorless: 1
	}, 
	hasFlying: true,
	hasSickness: false,
	isTapped: false,
	image: "birds-of-paradise.jpg"
},
{
	name: "Craw Wurm",
	power: 6,
	toughness: 4,
	manaCost: {
		green: 2,
		colorless: 4
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "craw-wurm.jpg"
},
{
	name: "Earth Elemental",
	power: 4,
	toughness: 5,
	manaCost: {
		red: 2,
		colorless: 3
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "earth-elemental.jpg"
},
{
	name: "Fire Elemental",
	power: 5,
	toughness: 4,
	manaCost: {
		red: 2,
		colorless: 3 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "fire-elemental.jpg"
},
{
	name: "Giant Spider",
	power: 2,
	toughness: 4,
	manaCost: {
		green: 1,
		colorless: 3 
	}, 
	hasFlying: false,
	hasReach: true,
	hasSickness: false,
	isTapped: false,
	image: "giant-spider.jpg"
},
{
	name: "Gray Ogre",
	power: 2,
	toughness: 2,
	manaCost: {
		red: 1,
		colorless: 2 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "gray-ogre.jpg"
},
{
	name: "Grizzly Bears",
	power: 2,
	toughness: 2,
	manaCost: {
		green: 1,
		colorless: 1 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "grizzly-bears.jpg"
},
{
	name: "Hill Giant",
	power: 3,
	toughness: 3,
	manaCost: {
		red: 1,
		colorless: 3 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "hill-giant.jpg"
},
{
	name: "Hurloon Minotaur",
	power: 2,
	toughness: 3,
	manaCost: {
		red: 2,
		colorless: 1 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "hurloon-minotaur.jpg"
},
{
	name: "Ironroot Treefolk",
	power: 3,
	toughness: 5,
	manaCost: {
		green: 1,
		colorless: 4 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "ironroot-treefolk.jpg"
},
{
	name: "Mahamoti Djinn",
	power: 5,
	toughness: 6,
	manaCost: {
		blue: 2,
		colorless: 4 
	}, 
	hasFlying: true,
	hasSickness: false,
	isTapped: false,
	image: "mahamoti-djinn.jpg"
},
{
	name: "Merfolk Of The Pearl Trident",
	power: 1,
	toughness: 1,
	manaCost: {
		blue: 1,
		colorless: 0 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "merfolk-of-the-pearl-trident.jpg"
},
{
	name: "Mons's Goblin Raiders",
	power: 1,
	toughness: 1,
	manaCost: {
		red: 1,
		colorless: 0 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "monss-goblin-raiders.jpg"
},
{
	name: "Obsianus Golem",
	power: 4,
	toughness: 6,
	manaCost: {
		colorless: 6, 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "obsianus-golem.jpg"
},
{
	name: "Pearled Unicorn",
	power: 2,
	toughness: 2,
	manaCost: {
		white: 1,
		colorless: 2 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "pearled-unicorn.jpg"
},
{
	name: "Phantom Monster",
	power: 3,
	toughness: 3,
	manaCost: {
		blue: 1,
		colorless: 4 
	}, 
	hasFlying: true,
	hasSickness: false,
	isTapped: false,
	image: "phantom-monster.jpg"
},
{
	name: "Roc Of Kher Ridges",
	power: 3,
	toughness: 3,
	manaCost: {
		red: 1,
		colorless: 3 
	}, 
	hasFlying: true,
	hasSickness: false,
	isTapped: true,
	image: "roc-of-kher-ridges.jpg"
},
{
	name: "Savannah Lions",
	power: 2,
	toughness: 1,
	manaCost: {
		white: 1,
		colorless: 0 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "savannah-lions.jpg"
},
{
	name: "Scathe Zombies",
	power: 2,
	toughness: 2,
	manaCost: {
		black: 1,
		colorless: 2 
	}, 
	hasFlying: false,
	hasSickness: false,
	isTapped: false,
	image: "scathe-zombies.jpg"
},
{
	name: "Scryb Sprites",
	power: 1,
	toughness: 1,
	manaCost: {
		green: 1,
		colorless: 0
	}, 
	hasFlying: true,
	hasSickness: false,
	isTapped: false,
	image: "scryb-sprites.jpg"
},
{
	name: "Serra Angel",
	power: 4,
	toughness: 4,
	manaCost: {
		white: 2,
		colorless: 3 
	}, 
	hasFlying: true,
	hasDefender: false,
	hasVigilance: true,
	hasSickness: false,
	isTapped: false,
	image: "serra-angel.jpg"
},
{
	name: "Wall Of Air",
	power: 1,
	toughness: 5,
	manaCost: {
		blue: 2,
		colorless: 1 
	}, 
	hasFlying: true,
	hasDefender: true,
	hasSickness: false,
	isTapped: false,
	image: "wall-of-air.jpg"
},
{
	name: "Wall Of Ice",
	power: 0,
	toughness: 7,
	manaCost: {
		green: 1,
		colorless: 2 
	}, 
	hasFlying: false,
	hasDefender: true,
	hasSickness: false,
	isTapped: false,
	image: "wall-of-ice.jpg"
},
{
	name: "Wall Of Stone",
	power: 0,
	toughness: 8,
	manaCost: {
		red: 2,
		colorless: 1 
	}, 
	hasFlying: false,
	hasDefender: true,
	hasSickness: false,
	isTapped: false,
	image: "wall-of-stone.jpg"
},
{
	name: "Wall Of Swords",
	power: 3,
	toughness: 5,
	manaCost: {
		white: 1,
		colorless:3 
	}, 
	hasFlying: true,
	hasDefender: true,
	hasSickness: false,
	isTapped: false,
	image: "wall-of-swords.jpg"
},
{
	name: "Wall Of Wood",
	power: 0,
	toughness: 3,
	manaCost: {
		green: 1,
	}, 
	hasFlying: false,
	hasDefender: true,
	hasSickness: false,
	isTapped: false,
	image: "wall-of-wood.jpg"
},
{
	name: "Water Elemental",
	power: 5,
	toughness: 4,
	manaCost: {
		blue: 2,
		colorless: 3 
	}, 
	hasFlying: false,
	hasDefender: false,
	hasSickness: false,
	isTapped: false,
	image: "water-elemental.jpg"
}];


generateDecks();
generateHands();
displayHand();



