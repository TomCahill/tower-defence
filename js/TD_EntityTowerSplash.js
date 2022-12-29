"use strict";

/**
 * TowerDefence_Entity_Tower_Basic
 * Class extends from TowerDefence_Entity_Tower
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Entity_Tower_Splash = function(Entities, Camera, Map, Score, EntityID, EntityType, TileID){
	var self = new TowerDefence_Entity_Tower(Entities, Camera, Map, Score, EntityID, EntityType, TileID),
		parent = {};

	var _sprite = false;

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){

		var xy = Map.getTileXY(TileID);
		self.x = xy[0];
		self.y = xy[1];
		self.cx = (self.x+(Map.tileSize/2));
		self.cy = (self.y+(Map.tileSize/2));

		_sprite = new TowerDefence_Sprite(self,Camera,{
			height: 32,
			width: 32,
			spriteFilename: 'entity_tower_basic'
		});

		return self;
	}

	/**
	 * update
	 * Call parent update method
	 * 
	 * @returns {void}
	 */
	function update(lastFrame){
		parent.update(lastFrame);
	}

	/**
	 * update
	 * Call parent and sprite render emthods
	 * 
	 * @returns {void}
	 */
	function render(ctx){
		parent.render(ctx);
		_sprite.render(ctx);
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