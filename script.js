//initialize the player information
var player1 = {
	lifeTotal: 20,
	isTurn: false,
	manapool: {
		red: 0,
		green: 0,
		blue: 0,
		black: 0,
		white: 0
	},
	cardsInHand: [],
		//name of cards that player has in hand?
		//feed in the cards here when you first get them
		//there will be land and creature cards
	cardsInPlay: {
		//creatures that the player has put onto the field
	},
	cardsInGraveyard: {
		//start Empty and will add to as creatures die
	},
	cardsInDeck: [],
	playLand: false //to keep track of whether played a land that turn
};

var player2 = {
	lifeTotal: 20,
	isTurn: false,
	manapool: {
		red: 0,
		green: 0,
		blue: 0,
		black: 0,
		white: 0
	},
	cardsInHand: [],
		//name of cards that player has in hand?
		//feed in the cards here when you first get them
		//there will be land and creature cards
	cardsInPlay: {
		//creatures that the player has put onto the field
	},
	cardsInGraveyard: {
		//start Empty and will add to as creatures die
	},
	cardsInDeck: [],
	playLand: false //to keep track of whether played a land that turn
}; 

$(function() { //stuff that runs on page load
	//query the API to get card information
	var obj = $.getJSON("https://mtgjson.com/json/LEA.json", function() { 
	 		//console.log(obj.responseJSON);
		});

	//make the arrays equal
	//create the AI, make it equal to player1
});

var generateDecks = function() { //generate the player decks, good for now
	//from the creatures array grab 30 cards randomly, no more than 4 of each card
	//generate a reasonable amount of lands
	//push these into an ordered list, Last In First Out

	//generate 30 random Creatures, place into players deck
	for (var i=0; i<30; i++) {
		//console.log(i);
		var randNum1 = Math.floor(Math.random()*allCreatures.length); //rand creature
		player1.cardsInDeck.push(allCreatures[randNum1]);
	}

	for (var i=0; i<30; i++) {
		var randNum2 = Math.floor(Math.random()*allCreatures.length);
		player2.cardsInDeck.push(allCreatures[randNum2]);
	}
	
	//generate 15 random lands
	for (var j=0; j<15; j++) {
		var randNum1 = Math.floor(Math.random()*allLands.length);
		player1.cardsInDeck.push(allLands[randNum1]);
	}

	for (var j=0; j<15; j++) {
		var randNum2 = Math.floor(Math.random()*allLands.length);
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


var whoGoesFirst = function() { //don't deal with this for now
	//look at the first player.cards && player2.cardsInDeck 
	//the bigger one will go first
	// player with bigger.isTurn = true;
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

	

//land array
var allLands = [{
	name: "Swamp",
	mana: {
		black: 1
	}
},
{
	name: "Plains",
	mana: {
		white: 1
	}
},
{
	name: "Forest",
	mana: {
		green: 1
	}
},
{
	name: "Mountain",
	mana: {
		red: 1
	}
},
{
	name: "Water",
	mana: {
		blue: 1
	}
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
	isTapped: false
},
{
	name: "Birds Of Paradise",
	power: 0,
	toughness: 1,
	manaCost: {
		green: 0
	}, 
	hasFlying: true,
	hasSickness: false,
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false 
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: true
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
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
	isTapped: false
}];


generateDecks();
generateHands();

