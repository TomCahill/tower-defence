"use strict";

/**
 * TowerDefence_Entity_Shot
 * Class extends from TowerDefence_Entity
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Entity_Shot = function(Entities, Camera, Map, Score, EntityID, EntityType, TargetEntity, Damage, x, y){
	var self = new TowerDefence_Entity(Camera,Map,EntityID), 
		parent = {};

	self.type = 'shot';
	self.x = 0;
	self.y = 0;
	self.speed = 3;
	self.damage = 5;
	self.direction = 0; // 360
	
	var _sprite = false;

	var _testi = 0;

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){

		self.x = x;
		self.y = y;
		self.damage = Damage;

		_sprite = new TowerDefence_Sprite(self,Camera,{
			height: 4,
			width: 4,
			spriteFilename: 'entity_shot'
		});

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
		var vX = 0, vY = 0;
		
		if(TargetEntity && !TargetEntity.destroy){
			if(TargetEntity.checkCollision(self.x, self.y)){
				self.destroy = true;
				TargetEntity.takeDamage(self.damage);
				TargetEntity = false;
			}else{
				var deltaX = TargetEntity.x - self.x,
					deltaY = TargetEntity.y - self.y;

				var angle = Math.atan2(deltaY, deltaX);

				vX = self.speed * Math.cos(angle);
				vY = self.speed * Math.sin(angle);
			}
		}else{
			self.destroy = true;
		}

		self.x+=vX;
		self.y+=vY;
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
		/*if(TargetEntity){
			ctx.fillStyle = 'rgba(225,0,0,1)';
			ctx.fillRect(
				TargetEntity.x-Camera.x,
				TargetEntity.y-Camera.y,
				6,
				6
			);
		}*/
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