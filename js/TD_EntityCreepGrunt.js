"use strict";

/**
 * TowerDefence_Entity_Creep_Grunt
 * Class extends from TowerDefence_Entity_Creep
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Entity_Creep_Grunt = function(Entities, Camera, Map, Score, EntityID, EntityType, Scale){
	var self = new TowerDefence_Entity_Creep(Entities, Camera, Map, Score, EntityID, EntityType), 
		parent = {};
	
	var _sprite = false;

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){
		self.x = 304;
		self.y = 5;
		//self.name = name;

		self.hp+=Scale;

		_sprite = new TowerDefence_Sprite(self,Camera,{
			height: 8,
			width: 8,
			spriteFilename: 'entity_creep_grunt_sheet',
			spriteSheetWidth: 96,
			spriteSheetHeight: 32,
			animated: true,
			animationFrames: {
				up: [0,1,2,3,4,5,6,7,8,9,10,11],
				down: [12,13,14,15,16,17,18,19,20,21,22,23],
				right: [24,25,26,27,28,29,30,31,32,33,34,35],
				left: [36,37,38,39,40,41,42,43,44,45,46,47]
			}
		});
		self.collisionBox = [_sprite.width, _sprite.height];

		return self;
	}

	/**
	 * update
	 * Call parent update method
	 * 
	 * @returns {void}
	 */
	function update(){
		parent.update();
		_sprite.update();
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
		_renderDebug(ctx);
	}

	/**
	 * renderDebug
	 * Debug render
	 * 
	 * @returns {void}
	 */
	function _renderDebug(ctx){
		ctx.fillStyle = "#FFF";
		ctx.fillText(self.hp, self.x-Camera.x, self.y-Camera.y-10);
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