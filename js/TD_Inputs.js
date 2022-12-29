//TODO: Kill events when focus is lost on the game
var TowerDefence_Inputs = function(CanvasDOM){
	var self = {
		up:false,
		down:false,
		left:false,
		right:false,
		mouseX:0,
		mouseY:0,
		click: false,
		mouseMoveDelta: [0,0]
	};

	var _clickCallbacks=[],
		_mouseDownX = 0,
		_mouseDownY = 0;

	function construct(){
		init();
		return self;
	}
	function init(){
		window.addEventListener("keydown", function(e){
		    switch(e.keyCode){
		        case 65: self.left = true; break;
		        case 87: self.up = true; break;
		        case 68: self.right = true; break;
		        case 83: self.down = true; break;
		        case 16: self.sprint = true; break;
		    }
		}, false);
		window.addEventListener("keyup", function(e){
		    switch(e.keyCode){
		        case 65: self.left = false; break;
		        case 87: self.up = false; break;
		        case 68: self.right = false; break;
		        case 83: self.down = false; break;
		        case 16: self.sprint = false; break;
		    }
		}, false);

		window.addEventListener('mousemove', function(e) {
			self.mouseX = e.clientX;
			self.mouseY = e.clientY;

			if(self.click){
				self.mouseMoveDelta[0] = (self.mouseX-_mouseDownX)/70;
				self.mouseMoveDelta[1] = (self.mouseY-_mouseDownY)/70;
			}

			// var bRect = theCanvas.getBoundingClientRect();
			// mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
			// mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

			if (e.preventDefault) {
				e.preventDefault();
			} //standard
			else if (e.returnValue) {
				e.returnValue = false;
			} //older IE
			return false;

		},false);
		window.addEventListener("mousedown", function(e){
			callClickCallbacks(e);
			self.click = true;
			_mouseDownX = e.clientX;
			_mouseDownY = e.clientY;
		}, false);
		window.addEventListener("mouseup", function(e){
			self.click = false;
		},false);

	}

	function update(){

	}

	function requestClickCallback(cb){
		_clickCallbacks.push(cb);
	}
	function callClickCallbacks(e){
		for(var i in _clickCallbacks){
			_clickCallbacks[i](e);
		}
	}

	function uiUpdateSeleceted(Entity){

		document.getElementById('BottomBarEntityName').innerHTML = Entity.id;
		document.getElementById('BottomBarEntityDamage').innerHTML = Entity.damage;
		document.getElementById('BottomBarEntitySpeed').innerHTML = Entity.shotSpeed;
		document.getElementById('BottomBarEntityRange').innerHTML = Entity.range;
		document.getElementById('BottomBarEntityCost').innerHTML = Entity.cost;
	}

	function renderDebug(ctx){
		ctx.fillText("Raw Mouse (x:"+self.mouseX+",y:"+self.mouseY+")",10,160);
	}

	/**
	 * Add methods to the current class
	 * These expose them as public
	 */
	self.requestClickCallback = requestClickCallback;
	self.renderDebug = renderDebug;
	self.update = update;

	// Call method to construct the class
	return construct();


}