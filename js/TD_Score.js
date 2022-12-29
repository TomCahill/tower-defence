"use strict";

/**
 * TowerDefence_Entity
 * Pretty much just a counter for the game
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Score = function(){
	var self = {
		kills: 0,
		hp: 50,
		gold: 75
	};

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){

		refreshDomScore();
		return self;
	}

	/**
	 * update
	 * Entity Logic
	 * 
	 * @returns {void}
	 */
	function update(){
		if(self.hp<1)
			gameOver();
	}

	/**
	 * render
	 * Render Entity
	 * 
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function render(ctx){

	}

	function changeGold(i){
		self.gold+=i;
		if(self.gold<0)
			self.gold = 0;
		refreshDomScore();
	}
	function changeKill(i){
		self.kills+=i;
		refreshDomScore();
	}
	function changeLife(i){
		self.hp+=i;
		refreshDomScore();
	}

	function refreshDomScore(){
		document.getElementById('TopbarStatusGold').children[0].innerHTML = self.gold;
		document.getElementById('TopbarStatusKills').children[0].innerHTML = self.kills;
		document.getElementById('TopbarStatusLife').children[0].innerHTML = self.hp;
	}

	/**
	 * renderDebug
	 * Debugging function to render any debug text to the game view
	 *
	 * TODO: Remove at a later date
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function renderDebug(ctx){ }

	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.changeGold = changeGold;
	self.changeKill = changeKill;
	self.changeLife = changeLife;

	self.update = update;
	self.render = render;

	// Call method to construct the class
	return construct();
}