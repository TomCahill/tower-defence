"use strict";

/**
 * TowerDefence_Towers
 * Class extends from TowerDefence_Entity
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Entity_Tower = function(Entities, Camera, Map, Score, EntityID, EntityType, TileID){
	var self = new TowerDefence_Entity(Camera, Map, EntityID, EntityType, TileID), 
		parent = {};

	self.type = EntityType;
	self.x = 0;
	self.y = 0;
	self.cx = 0; // Because towers shouldn't move
	self.cy = 0; // Because towers shouldn't move
	self.range = 125;
	self.shotSpeed = 500; // 500
	self.damage = 5;
	self.cost = 30;
	
	var _sprite = false,
		_currentTarget = false,
		_lastShot = 0;

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){
		self.cx = (self.x+(Map.tileSize/2));
		self.cy = (self.y+(Map.tileSize/2));
		//_lastShot = Date.now();

		Score.changeGold(-self.cost);

		return self;
	}

	/**
	 * update
	 * Call parent update method
	 * 
	 * @returns {void}
	 */
	function update(lastFrame){
		parent.update();
		if(_currentTarget){
			// Shoot dat shit
			if((lastFrame-_lastShot)>self.shotSpeed){
				Entities.addShot(self.cx, self.cy, _currentTarget, self.damage);
				_lastShot = lastFrame;
			}
			_currentTarget = false; // Find new target for now
		}else{
			// Find new target
			_currentTarget = Entities.findClosestCreepWithin(self.cx, self.cy, self.range);
		}
	}

	/**
	 * update
	 * Call parent and sprite render emthods
	 * 
	 * @returns {void}
	 */
	function render(ctx){
		parent.render(ctx);
		renderDebug(ctx);
	}

	/**
	 * renderDebug
	 * Debugging function to render any debug text to the game view
	 *
	 * TODO: Remove at a later date
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function renderDebug(ctx){
		// ctx.strokeStyle = 'rgba(255,0,0,0.5)';
		// ctx.beginPath();
		// ctx.arc(self.cx-Camera.x, self.cy-Camera.y, self.range, 0*Math.PI, 2*Math.PI);
		// ctx.stroke();
	}


	/**
	 * Grab the methods we want to save from the parent class
	 * these can be called a later time
	 */
	parent.update = self.update;
	parent.render = self.render;

	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.update = update;
	self.render = render;

	// Call method to construct the class
	return construct();
}