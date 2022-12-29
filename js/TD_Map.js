"use strict";

/**
 * TowerDefence_Map
 * Handle all map rendering and positioning
 *
 * @param {Object} Camera - Game Camera Class
 * @returns {function} construct
 */
var TowerDefence_Map = function(Camera){
	var self = {
		mapLoaded: false,
		mapWidth: 0,
		mapHeight: 0,
		mapBaseCount: 0,
		tileSize: 0
	};

	var _mapDataPath = './TowerDefence/maps/',
		_mapData = false,
		_tileSet = false;

	var _mapWorldCollision = 0,
		_mapBuildLayer = 0;

	var _debugGridNumbers = false;

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
	 * Initialise loading of the map
	 *
	 * TODO: Map will be dynamically loaded and assets will have to be preloaded.
	 * @returns {void}
	 */
	function init(){
		load('digital-map');
	}

	/**
	 * load
	 * Load the map json and tileset, parse the data and add to _mapData
	 * Flag the map as loaded
	 *
	 * @param {String} filename - name of the map file to load
	 * @returns {void}
	 */
	function load(filename){
		self.mapLoaded = false;
		jQuery.getJSON(_mapDataPath+filename+'.json', function(mapJson){
			_mapData = mapJson;
			// Needs to preload
			_tileSet = document.createElement('img');
			_tileSet.setAttribute('src',_mapDataPath+_mapData.tilesets[0].image);

			self.mapLoaded = true;

			_parseMapData();
		});
	}

	/**
	 * _parseMapData
	 * Shit function just set some of the basic map data for other methods
	 *
	 * @returns {void}
	 */
	function _parseMapData(){
		if(self.mapLoaded && _mapData.layers.length>0){
			self.tileSize = _mapData.tilewidth;
			self.mapWidth = _mapData.width;
			self.mapHeight = _mapData.height;
			self.mapBaseCount = self.mapWidth*self.mapHeight;

			_mapWorldCollision = _mapData.properties.worldCollision;
			_mapBuildLayer = _mapData.properties.buildLayer;
		}
	}

	/**
	 * render
	 * Loop through each map layer and call renderLayer if map is loaded
	 * 
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function render(ctx){
		if(self.mapLoaded && _mapData.layers.length>0){
			for(var i=0;i<_mapData.layers.length;i++){
				if(_mapData.layers[i].properties.render=='true'){
					renderLayer(_mapData.layers[i],ctx);
				}
			}
		}
	}

	/**
	 * update
	 * Was used for updating Camera position but is now deprecated
	 * 
	 * @returns {void}
	 */
	function update(){
		if(self.mapLoaded){
			// Any updates - Camera Logic
		}
	}

	/**
	 * renderLayer
	 * loop through each tile in a layer and render it to the game view
	 * 
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function renderLayer(layer,ctx,offset){
		if(layer.type!='tilelayer' || layer.opacity<=0)
            return;

        var tile = _mapData.tilesets[0];
        for(var i=0;i<layer.data.length;i++){
            if(layer.data[i]<1)
                continue;
            var img_x, img_y, s_x, s_y;
            var img_XY = getTileXY(i);
            img_x = img_XY[0];
            img_y = img_XY[1];
            s_x = ((layer.data[i]-1) % (tile.imagewidth/self.tileSize)) * self.tileSize;
            s_y = ~~((layer.data[i]-1) / (tile.imagewidth/self.tileSize)) * self.tileSize;

            var highlight = false;
            if( (Camera.mouseX>img_x && Camera.mouseX<(img_x+self.tileSize)) && (Camera.mouseY>img_y && Camera.mouseY<(img_y+self.tileSize)) ){
            	highlight = true;
            }

            img_x -= Camera.x;
            img_y -= Camera.y;

           	ctx.drawImage(_tileSet, s_x, s_y, self.tileSize, self.tileSize, img_x, img_y, self.tileSize, self.tileSize);

           	// Draw tile numbers
           	if(_debugGridNumbers){
           		ctx.fillStyle = '#FFF';
           		ctx.fillText(i, img_x+5, img_y+15);
           	}

			if(highlight){
				ctx.fillStyle = 'rgba(225,0,0,0.5)';
				ctx.fillRect(img_x,img_y,self.tileSize,self.tileSize);
			}
        }
	}

	/**
	 * getTileXY
	 * Work out the (X,Y) from a tileID, this will provide the position of the top left.
	 * 
	 * @param {Int} i - TileID
	 * @returns {void}
	 */
	function getTileXY(i){
		return [(i % ((_mapData.width*self.tileSize) / self.tileSize)) * self.tileSize,~~(i / ((_mapData.width*self.tileSize) / self.tileSize)) * self.tileSize];
	}

	/**
	 * renderDebug
	 * Paint any debug text to the canvas context
	 * 
	 * @param {Object} ctx - Canvas context
	 * @returns {void}
	 */
	function renderDebug(ctx){
		ctx.fillText("Map Status ("+self.mapLoaded+")",10,120);
	}

	/**
	 * getTileIDByXY
	 * Get a tileID by a provide (X,Y), 
	 *
	 * TODO: Implement, is only currently used in TD_Entity to get the start position for pathing 
	 * @param {Int} x - X Position
	 * @param {Int} y - Y Position
	 * @returns {void}
	 */
	function getTileIDByXY(x,y){
		var xy = [Math.floor(x/self.tileSize),Math.floor(y/self.tileSize)*self.mapWidth];
		if(xy[0]<0 || xy[0]>=self.mapWidth)
			return false;
		if(xy[1]<0 || xy[1]>=self.mapBaseCount)
			return false;

		return xy[0]+xy[1];
	}

	/**
	 * getStartTileID
	 * Get the TileID of the start of the map
	 *
	 * TODO: Implement, fetch from map data (Problem: Could be multiple end points)
	 * @returns {void}
	 */
	function getStartTileID(){
		return 9;
	}
	/**
	 * getEndTileID
	 * Get the TileID of the end of the map
	 *
	 * TODO: Implement, fetch from map data (Problem: Could be multiple end points)
	 * @returns {void}
	 */
	function getEndTileID(){
		return 388;
	}

	/**
	 * getCenterXYByTileID
	 * Work out the (X,Y) from a tileID, this will get the center position of the tile rather than the top left.
	 *
	 * TODO: Get the actual center of the tile
	 * @param {Int} tileID - TileID
	 * @returns {Array} (X,Y) - X, Y Position on the map
	 */
	function getCenterXYByTileID(tileID){
		var xy = getTileXY(tileID);
		//var xy = getTileXY(Math.random()*15+1);
		return [Math.floor(xy[0]+(self.tileSize/2)),Math.floor(xy[1]+(self.tileSize/2))];
	}

	/**
	 * getWorldCollision
	 * Work out the (X,Y) from a tileID, this will get the center position of the tile rather than the top left.
	 *
	 * TODO: Get the actual center of the tile
	 * @returns {Array} layer_data - Array of tileID's
	 * @returns {Boolean} false - Return false if map is not loaded
	 */
	function getWorldCollision(){
		if(self.mapLoaded && _mapData.layers.length){
			return _mapData.layers[_mapWorldCollision].data;
		}
		return false;
	}
	function getBuildLayer(){
		if(self.mapLoaded && _mapData.layers.length){
			return _mapData.layers[_mapBuildLayer].data;
		}
		return false;
	}

	/**
	 * getPathing
	 * Return a new pathing object
	 *
	 * NOTE: This is only hear as Map and Camera need to be passed as dependencies
	 * @returns {Object} TowerDefence_Pathing - New Instance of Pathing class
	 */
	function getPathing(){
		return new TowerDefence_Pathing(self,Camera);
	}

	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.getTileIDByXY = getTileIDByXY;
	self.getStartTileID = getStartTileID;
	self.getEndTileID = getEndTileID;

	self.getTileXY = getTileXY;
	self.getCenterXYByTileID = getCenterXYByTileID;

	self.getWorldCollision = getWorldCollision;
	self.getBuildLayer = getBuildLayer;
	self.getPathing = getPathing;

	self.load = load;
	self.render = render;
	self.update = update;
	self.renderDebug = renderDebug;

	/**
	 * self.toggleGridNumbers
	 * Toggle the _debugGridNumbers to true or false
	 *
	 * TODO: Remove at a later date
	 * @returns {void}
	 */
	self.toggleGridNumbers = function(){
		_debugGridNumbers = (!_debugGridNumbers) ? true : false;
	}

	// Call method to construct the class
	return construct();
}