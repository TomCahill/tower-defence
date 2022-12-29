// TODO: Manage entities
"use strict";

/**
 * TowerDefence_Entity_Manager
 * Class will handle all entities
 * THIS IS AN EXTREMELY SHIT WAY OF EXTENDING A CLASS
 *
 * @param {Object} Camera - Game Camera Class
 * @param {Object} Map - Game Map Class
 * @param {String} id - TEMP Give the entity a name
 * @returns {function} construct
 */
var TowerDefence_Entity_Manager = function(Inputs, Camera, Map, Score){
	
	var _entityID=1,
		_gameEntities = [];

	var _gameEntityTypes ={
		0: 'CREEP',
		1: 'TOWER',
		2: 'SHOT'
	}

	var _spawnCreepTick = 1500,
		_lastSpawn = 0,
		_creepI = 0;

	// TDOD: Add the ability to select
	var selectedEntity = false;

	// TODO: Handle waves, data will be passed from the map

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){

		init();

		return self;
	}

	/**
	 * init
	 * Initiate any listeners
	 *
	 * @returns {void}
	 */
	function init(){
		Inputs.requestClickCallback(function(e){
			// Check if tower has been selected
			// Try to place tower type
			addTower(Camera.mouseX,Camera.mouseY);
		});
	}

	function _createEntity(object){
		console.log('Creating Entity',object);
		_gameEntities.push(object);
		_entityID++;
	}


	function addGrunt(){
		_createEntity(new TowerDefence_Entity_Creep_Grunt(self, Camera, Map, Score, _entityID, _gameEntityTypes.CREEP,_creepI));
		_creepI++;
	}
	function addTower(x,y){
		// Check if its in a nice place
		var tileID = Map.getTileIDByXY(x,y);

		if(Score.gold<10) // Testing
			return false;

		var buildLayer = Map.getBuildLayer();
		if(buildLayer[tileID]==0)
			return false;

		if(getEntityInTile(tileID))
			return false;

		// TODO: Check to see if object has already been placed
		if(tileID!==false && tileID>=0 && tileID<Map.mapBaseCount){
			_createEntity(new TowerDefence_Entity_Tower_Basic(self, Camera, Map, Score, _entityID, _gameEntityTypes.TOWER, tileID));
		}
	}
	function addShot(x, y, targetEntity, damage){
		_createEntity(new TowerDefence_Entity_Shot(self, Camera, Map, Score, _entityID, _gameEntityTypes.SHOT, targetEntity, damage, x, y));
	}

	function getEntityInTile(tileID){
		for(var i in _gameEntities){
			if(!_gameEntities[i])
				continue;
			if(tileID == Map.getTileIDByXY(_gameEntities[i].x,_gameEntities[i].y))
				return _gameEntities[i];
		}

		return false;
	}

	function findClosestCreepWithin(x, y, r){
		for(var i in _gameEntities){
			if(!_gameEntities[i])
				continue;

			if(_gameEntities[i].type!='creep')
				continue;

			if( Math.abs(_gameEntities[i].x-x) > r || Math.abs(_gameEntities[i].y-y) > r ){
				continue;
			}

			return _gameEntities[i];
		}

		return false;
	}

	function findEntity(id){
		for(var i in _gameEntities){
			if(_gameEntities[i].id == id)
				return _gameEntities[i];
		}
		return false;
	}

	/**
	 * update
	 * Entity Logic
	 * 
	 * @returns {void}
	 */
	function update(lastFrame){
		var destroyCleanup = false;

		if((lastFrame-_lastSpawn)>_spawnCreepTick){
			addGrunt();
			_lastSpawn = lastFrame;
		}


		for(var i=0; i<_gameEntities.length; i++){
			if(_gameEntities[i])
				_gameEntities[i].update(lastFrame);

			if((_gameEntities[i].x<0 || _gameEntities[i].x>Map.mapWidth*Map.tileSize) || (_gameEntities[i].y<0 || _gameEntities[i].y>Map.mapHeight*Map.tileSize)){
				_gameEntities[i].destroy = true;
			}

			if(_gameEntities[i].destroy){
				destroyCleanup = true;
				_gameEntities[i] = false;
			}
		}
		if(destroyCleanup){
			for(var i=0; i<_gameEntities.length; i++){
				if(_gameEntities[i]===false){
					_gameEntities.splice(i,1);
					i--;
				}
			}
		}
	}

	/**
	 * render
	 * Render Entity
	 * 
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function render(ctx){
		for(var i=0;i<_gameEntities.length;i++){
			// TODO: Dont render entites off the map
			if(_gameEntities[i])
				_gameEntities[i].render(ctx);
		}
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
		ctx.fillText("Entity Count: "+(_gameEntities.length)+"",10,100);
	}


	function spawnShotOnFirstCreep(){
		
		console.log(_gameEntities);
	}


	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.addGrunt = addGrunt;
	self.addShot = addShot;
	self.spawnShotOnFirstCreep = spawnShotOnFirstCreep;

	self.findClosestCreepWithin = findClosestCreepWithin;

	self.update = update;
	self.render = render;
	self.renderDebug = renderDebug;

	// Call method to construct the class
	return construct();
}