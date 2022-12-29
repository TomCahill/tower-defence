"use strict";

/**
 * TowerDefence_Entity_Creep
 * Class extends from TowerDefence_Entity
 * This will handle baisc movments and pathing
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Entity_Creep = function(Entities, Camera, Map, Score, id){
	var self = new TowerDefence_Entity(Camera, Map, id),
		parent = {};

	self.type = 'creep';
	self.id = id;
	self.x = 0;
	self.y = 0;
	self.hp = 20;
	self.speed = 1;
	self.direction = 0; // 1-up, 2-right, 3-down, 4-right
	self.worth = 10;
	self.collisionBox = [0,0];

	var _path,
		_pathQueue = [],
		_pathTargetXY = false;

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){
		_path = Map.getPathing();
		_pathQueue = _path.findPathing(Map.getStartTileID(), Map.getEndTileID());

		getNewTargetXY();

		return self;
	}

	/**
	 * update
	 * Basic movment updates, if it has a target (X,Y) it will progress towards it
	 * 
	 * TODO: If target distance is less than the entity speed. Use distance
	 * @returns {void}
	 */
	function update(){
		parent.update();
		var vX = 0, vY = 0;

		if(_pathTargetXY){
			if(_pathTargetXY[0]==self.x && _pathTargetXY[1]==self.y){
				getNewTargetXY();
			}else{
				if( _pathTargetXY[0]>self.x && (_pathTargetXY[0]-self.x)<self.speed ){
					vX = (_pathTargetXY[0]-self.x);
				}else if( _pathTargetXY[0]<self.x && (self.x-_pathTargetXY[0])<self.speed ){
					vX = (self.x-_pathTargetXY[0]);
				}else if(self.x!=_pathTargetXY[0]){
					if(self.x<_pathTargetXY[0]){
						vX+=self.speed;
					}else{
						vX-=self.speed;
					}
				}
				if( _pathTargetXY[1]>self.y && (_pathTargetXY[1]-self.y)<self.speed ){
					vY = (_pathTargetXY[1]-self.y);
				}else if( _pathTargetXY[1]<self.y && (self.y-_pathTargetXY[1])<self.speed ){
					vY = (self.y-_pathTargetXY[1]);
				}else if(self.y!=_pathTargetXY[1]){
					if(self.y<_pathTargetXY[1]){
						vY+=self.speed;
					}else{
						vY-=self.speed;
					}
				}
			}

			if(vX!=0 && vX>0){
				self.direction = 2;
			}else if(vX!=0 && vX<0){
				self.direction = 4;
			}
			if(vY!=0 && vY>0){
				self.direction = 1;
			}else if(vY!=0 && vY<0){
				self.direction = 3;
			}

		}

		self.x+=vX;
		self.y+=vY;
	}

	/**
	 * render
	 * Render debug information
	 * 
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function render(ctx){
		parent.render(ctx);
		renderDebug(ctx);
		_path.renderDebug(ctx);
	}

	/**
	 * getNewTargetXY
	 * Set a new target (X,Y) if a path is aviaible. Path is made up of tileID's and
	 * calls getCenterXYByTileID to convert the tileID into a (X,Y)
	 * 
	 * @returns {void}
	 */
	function getNewTargetXY(){
		_pathTargetXY = false;
		if(_pathQueue.length>0){
			_pathTargetXY = Map.getCenterXYByTileID(_pathQueue.shift());
		}else{
			// No queue must be the end
			Score.changeLife(-1);
			_destroy();
		}
	}

	function takeDamage(damage){
		self.hp-=damage;
		if(self.hp<0){
			Score.changeGold(self.worth);
			Score.changeKill(1);
			_destroy();
		}
	}

	function checkCollision(x,y){
		if((x>=self.x && x<=self.x+self.collisionBox[0]) && (y>=self.y && y<=self.y+self.collisionBox[1])){
			return true;
		}
		return false;
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
		
	}

	function _destroy(){
		self.destroy = true;
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
	self.takeDamage = takeDamage;
	self.checkCollision = checkCollision;

	self.update = update;
	self.render = render;

	// Call method to construct the class
	return construct();
}