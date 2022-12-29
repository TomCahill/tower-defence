"use strict";

/**
 * TowerDefence_Pathing
 * Handle any path finding calculations
 *
 * TODO: Come up with a more efficient way of calculating the pathing
 * @param {Object} Map - Game Map Class
 * @param {Object} Camera - Game Camera Class
 * @returns {function} construct
 */
var TowerDefence_Pathing = function(Map,Camera){
	var self = {};

	var _pathState = {
		'INVALID': 0,
		'VALID': 1,
		'BLOCKED': 3,
		'VISITED': 6,
		'START': 4,
		'END': 5
	}

	var _startTileID=0,
		_targetTileID=0,
		_mapNodes = {};

	var _pathI = 0,
		_debugPathQueue = [];

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
	 * _checkNode
	 * Check current tile ID and assign it a state
	 *
	 * TODO: To many states
	 * @param {Object} node - Simple data object giving information about the current tile
	 * @returns {Int} _pathState - Path state
	 */
	function _checkNode(node){
		_debugPathQueue.push(node.tileID);
		if(node.tileID<0 || node.tileID>=Map.mapBaseCount){
			return _pathState.INVALID;
		}else if(node.tileID===_targetTileID){
			return _pathState.END;
		}else if(_mapNodes[node.tileID]==_pathState.VISITED){
			return _pathState.VISITED;
		}else if(_mapNodes[node.tileID]==_pathState.BLOCKED){
			return _pathState.BLOCKED;
		}else{
			return _pathState.VALID;
		}
	}

	/**
	 * _checkNode
	 * Creates a new node instance and changes the position based on direction
	 * The new node is then passed on to _checkNode to get it's state
	 *
	 * TODO: To many states
	 * @param {Object} node - Simple data object giving information about the current tile
	 * @param {Int} dir - Directional int currently has 4 states
	 * @returns {Object} node - Simple data object giving information about the current tile
	 */
	function _checkNodeDirections(node,dir){
		var newPath = node.path.slice();
		newPath.push(node.tileID);

		var newNode = {
			tileID: node.tileID,
			path: newPath,
			status: 'Unknown'
		};

		if(dir==1){ // Up: 1
			newNode.tileID -= Map.mapHeight;
		}else if(dir==2){ // Down: 2
			newNode.tileID += Map.mapHeight;
		}else if(dir==3){ // Left: 3
			newNode.tileID -= 1;
		}else if(dir==4){ // Right: 4
			newNode.tileID += 1;
		}

		newNode.status = _checkNode(newNode);

		if(newNode.status===_pathState.VALID){
			_mapNodes[node.tileID] = _pathState.VISITED;
		}

		return newNode;
	}

	/**
	 * findPathing
	 * Main method to initiate pathing, it will create a start node and pass it to node queue.
	 * the loop will repeat until it has no more nodes to check. Each tileID from the queue is 
	 * pass through _checkNodeDirections for each up, down, left, right and it state is checked.
	 * 
	 * If the target tileID is found, the path queue to that tile is returned
	 *
	 * TODO: To many states
	 * @param {Int} startTileID - Start tileID
	 * @param {Int} targetTileID - End/Target tileID
	 * @returns {Array} path - Array containing path tileID's
	 * @returns {Boolean} false - Returns false if failed to find path
	 */
	function findPathing(startTileID,targetTileID){

		_mapNodes[startTileID] = _pathState.START;
		_mapNodes[targetTileID] = _pathState.END;
		_startTileID = startTileID;
		_targetTileID = targetTileID;

		var _worldCollision = Map.getWorldCollision();
		for(var i=0;i<_worldCollision.length;i++){
			if(_worldCollision[i]!=0){
				_mapNodes[i] = _pathState.BLOCKED;
			}
		}

		//console.log('Start: '+ _startTileID);
		//console.log('End: '+ _targetTileID);

		// Generate blocked map tiles
		var nodeQueue = [{
			tileID: startTileID,
			path: [],
			status: 'Start'
		}];

		_pathI=0;

		while(nodeQueue.length>0){
			var currentNode = nodeQueue.shift();

			// TEMP - Check if tileID has already been visited
			if(_mapNodes[currentNode.tileID]==_pathState.VISITED){
				console.log('Skipping '+currentNode.tileID);
				continue;
			}

			_pathI++;

			// LOTS of repeat code, trim down!

			// Up: 1
			var newNode = _checkNodeDirections(currentNode, 1);
			if(newNode.status === _pathState.END){
				return findPathingReturn(newNode.path);
			} else if (newNode.status === _pathState.VALID) {
				nodeQueue.push(newNode);
		    }
			// Down: 2	
			var newNode = _checkNodeDirections(currentNode, 2);
			if(newNode.status === _pathState.END){
				return findPathingReturn(newNode.path);
			} else if (newNode.status === _pathState.VALID) {
				nodeQueue.push(newNode);
		    }
			// Left: 3
			var newNode = _checkNodeDirections(currentNode, 3);
			if(newNode.status === _pathState.END){
				return findPathingReturn(newNode.path);
			} else if (newNode.status === _pathState.VALID) {
				nodeQueue.push(newNode);
		    }
			// Right: 4
			var newNode = _checkNodeDirections(currentNode, 4);
			if(newNode.status === _pathState.END){
				return findPathingReturn(newNode.path);
			} else if (newNode.status === _pathState.VALID) {
				nodeQueue.push(newNode);
		    }

		    // TEMP break to stop it getting stuck in a endless loop
		    if(_pathI>100)
		    	break;

		}

		return false; // Failed to find path;
	}

	function findPathingReturn(path){
		path.push(_targetTileID);
		return path;
	}

	/**
	 * _renderPathing
	 * Debugging function to render any debug information to the game view
	 *
	 * TODO: Remove at a later date
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function _renderPathing(ctx){
		if(_debugPathQueue && _debugPathQueue.length>0){
			for(var i=0;i<_debugPathQueue.length;i++){
				if(i==0){
					ctx.fillStyle = 'rgba(0,0,225,0.1)';
				}else if(i>=(_debugPathQueue.length-1)){
					ctx.fillStyle = 'rgba(225,225,0,0.1)';
				}else{
					ctx.fillStyle = 'rgba(225,0,0,0.1)';
				}
				ctx.fillRect(
					((_debugPathQueue[i] % ((Map.mapWidth*Map.tileSize) / Map.tileSize)) * Map.tileSize)-Camera.x,
					(~~(_debugPathQueue[i] / ((Map.mapWidth*Map.tileSize) / Map.tileSize)) * Map.tileSize)-Camera.y,
					Map.tileSize,
					Map.tileSize
				);
			}
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
		//_renderPathing(ctx);
	}

	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.findPathing = findPathing;
	self.renderDebug = renderDebug;

	// Call method to construct the class
	return construct();
}