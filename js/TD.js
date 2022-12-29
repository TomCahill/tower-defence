// http://maciejkus.com/tower/
// http://maciejkus.com/tower/mainLoop.js
// https://raw.githubusercontent.com/TomCahill/Poko/master/public_html/assets/js/game.js

"use strict";

/* -- Erik Moller - rAF Polyfill --  */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/* -- */

/**
 * TowerDefence
 * The main game class to manage everything
 *
 * @param {String} id - DOM Id of the canvas object.
 * @returns {function} construct
 */
var TowerDefence = function(CanvasID){
	// El/Hooks
	var self = {},
		_canvas,
		_ctx;

	// Core Vars
	var _mainLoop = false,
		_frameTarget = 60,
		_firstFrame = Date.now(),
		_lastFrame = Date.now(),
		_delta = 0,
		_deltaTime = 0,
		_frameCount = 0,
		_debug = false;

	var _gameWidth = 0,
		_gameHeight = 0;

	var _gameInit = false;

	// Core Libs 
	var inputs = {},
		map = {},
		camera = {},
		score = {},
		entities = {};

	/**
	 * construct
	 * Function is called when class is created.
	 *
	 * @returns {Object} self - Returns the current class
	 */
	function construct(){

		_canvas = document.getElementById(CanvasID);
		_ctx = _canvas.getContext('2d');

		_gameWidth = _canvas.width;
		_gameHeight = _canvas.height;

		preload();

		return self;
	}

	/**
	 * init
	 * Initialise some of the dependencies (Game classes and jQuery requirments).
	 *
	 * @returns {void}
	 */
	function init(){
		// jQuery events - Pass data through to keep deps together
		$(window).resize(function(){
			canvasResize($(window).width(),$(window).height());
		});
		$(window).resize();

		inputs = new TowerDefence_Inputs(_canvas);
		camera = new TowerDefence_Camera(inputs);
		map = new TowerDefence_Map(camera);
		score = new TowerDefence_Score();
		entities = TowerDefence_Entity_Manager(inputs, camera, map, score);

		document.getElementById('btnShowDebug').addEventListener("mousedown", function(e){
			_debug = (_debug) ? false : true;
		},false);

		start();
	}

	function loaded(){
		camera.setCameraPosition(map.mapWidth*map.tileSize - _gameWidth + (map.mapWidth*map.tileSize/2), 0);

		_gameInit = true;
		return false;
	}

	/**
	 * preload
	 * Get preloads from game dependencies and preload any media assets. Maybe dep scripts.
	 *
	 * TODO: Needs implementing at a later date. 
	 *
	 * @returns {void}
	 */
	function preload(){
		init();
	}

	/**
	 * main
	 * Main game loop, uses browser requestAnimationFrame to make sure the loop doesn't run to fast
	 * and at a speed the browser can handle. Function is passed as a callback to requestAnimationFrame
	 * which is then called again on the next cycle. Polyfill at the top is used for unsupported browsers.
	 * update and render are only called when the target fps is met.
	 *
	 * TODO: Needs implementing at a later date. 
	 * @returns {void}
	 */
	function main(){
		if(_mainLoop){
			if(map.mapLoaded && !_gameInit)
				loaded();

			var now = Date.now();
			_delta = now - _firstFrame;
			if(_delta > (1000/_frameTarget)){
				_lastFrame = now - (_delta % (1000/_frameTarget));
                _frameCount++;

				update();
				render();
			}
			window.requestAnimationFrame(main);
		}
	}

	/**
	 * update
	 * Update game logic, call update methods of game classes and entities.
	 * 
	 * @returns {void}
	 */
	function update(){

		// Pass through camera information
		camera.update();
		map.update();
		entities.update(_lastFrame);

	}

	/**
	 * render
	 * Handle all painting to the canvas context, call render methods of game classes and entities.
	 *
	 * TODO: Don't render entities off the map. 
	 * @returns {void}
	 */
	function render(){
		_ctx.clearRect(0,0,_canvas.width,_canvas.height);

		map.render(_ctx);

		entities.render(_ctx);

        _ctx.font = "12px Arial";
		_ctx.fillStyle = "#FFF";
		if(_debug)
			renderDebug(_ctx);
	}

	/**
	 * start
	 * Switch game control var to true call main to start loop if delta is 0
	 * 
	 * @returns {void}
	 */
	function start(){
		_mainLoop = true;
		if(_delta==0)
			main();
	}

	/**
	 * pause
	 * Toggle game control var
	 *
	 * TODO: Rework
	 * @returns {void}
	 */
	function pause(){
		if(_mainLoop)
			_mainLoop = false;
		else
			_mainLoop = true;
	}

	/**
	 * canvasResize
	 * Resize the canvas based on the width and height
	 *
	 * @param {String} w - Width of browser
	 * @param {String} h - Height of browser
	 * @returns {void}
	 */
	function canvasResize(w,h){
		_canvas.width=w;
		_canvas.height=h;
		_gameWidth=w;
		_gameHeight=h;
	}

	/**
	 * renderDebug
	 * Debugging function to render any debug text to the game view
	 *
	 * TODO: Remove at a later date
	 * @returns {void}
	 */
	function renderDebug(){
       	_ctx.fillText("Frame Size (x:"+_gameWidth+",y:"+_gameHeight+")",10,40);
       	_ctx.fillText("FPS "+parseInt(_frameCount/((_lastFrame-_firstFrame)/1000))+"",10,60);
       	_ctx.fillText("Frame "+(_frameCount)+"",10,80);
       	inputs.renderDebug(_ctx);
		camera.renderDebug(_ctx);
		map.renderDebug(_ctx);
		entities.renderDebug(_ctx);
	}

	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.pause = pause;

	/**
	 * self.spawnShit
	 * Temp function to spawn shit
	 *
	 * TODO: Remove at a later date
	 * @returns {void}
	 */
	self.spawnShit = function(){
		entities.addGrunt();
	}

	/**
	 * self.spawnShotOnFirstCreep
	 * Temp function to spawn a shot
	 *
	 * TODO: Remove at a later date
	 * @returns {void}
	 */
	self.spawnShotOnFirstCreep = function(){
		entities.spawnShotOnFirstCreep();
	}

	/**
	 * self.toggleGridNumbers
	 * Temp function to toggle rendering a game grid
	 *
	 * TODO: Remove at a later date
	 * @returns {void}
	 */
	self.toggleGridNumbers = function(){
		map.toggleGridNumbers();
	}

	// Call method to construct the class
	return construct();
};