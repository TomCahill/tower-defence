"use strict";

//https://www.gamedevmarket.net/asset/cartoon-game-gui-pack-15-4373/

/**
 * TowerDefence_UI
 * Pretty much just a counter for the game
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @returns {function} construct
 */
var TowerDefence_UI = function(){
	var self = {};

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){
		return self;
	}

	/**
	 * update
	 * Entity Logic
	 * 
	 * @returns {void}
	 */
	function update(){

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
	self.update = update;
	self.render = render;

	// Call method to construct the class
	return construct();
}