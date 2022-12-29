"use strict";

/**
 * TowerDefence_Entity
 * Class to set a base for all entities
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Entity = function(Camera,Map,id){
	var self = {
		id: id,
		x:0,
		y:0,
		destroy:false
	};

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
	function update(){ }

	/**
	 * render
	 * Render Entity
	 * 
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function render(ctx){ }

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
	 * destroy
	 * Mark this entity to be destroyed
	 *
	 * @returns {void}
	 */
	function destroy(){
		self.destroy = true;
	}

	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.update = update;
	self.render = render;

	// Call method to construct the class
	return construct();
}