var TowerDefence_Camera = function(Inputs){
	var self = {
		x:0,
		y:0,
		mouseX:0, // With game view taken into account
		mouseY:0
	};


	function construct(){
		init();
		return self;
	}
	function init(){

	}

	function update(){
		var vx=0, vy=0;

		if(Inputs.up){
			vy+=-5;
		}
		if(Inputs.down){
			vy+=5;
		}
		if(Inputs.left){
			vx+=-5
		}
		if(Inputs.right){
			vx+=5;
		}

		if(Inputs.click){
			vx+=Inputs.mouseMoveDelta[0];
			vy+=Inputs.mouseMoveDelta[1];
		}

		self.x+=vx;
		self.y+=vy;

		self.mouseX = Inputs.mouseX + self.x;
		self.mouseY = Inputs.mouseY + self.y;

	}

	function setCameraPosition(x,y){
		self.x = x;
		self.y = y;
	}

	function renderDebug(ctx){
		ctx.fillText("Camera View (x:"+self.x+",y:"+self.y+")",10,200);
		ctx.fillText("Game Mouse (x:"+self.mouseX+",y:"+self.mouseY+")",10,220);
		ctx.fillText("Game Mouse Detla (x:"+Inputs.mouseMoveDelta[0]+",y:"+Inputs.mouseMoveDelta[1]+")",10,20);
	}

	// Public/Exposed
	self.setCameraPosition = setCameraPosition;

	self.update = update;
	self.renderDebug = renderDebug;

	return construct();
}