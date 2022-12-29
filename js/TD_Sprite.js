"use strict";

// TODO: Split animation into seperated class
var TowerDefence_Sprite = function(Entity,Camera,options){
	var self = $.extend({
		height: 0,
		width: 0,
		spriteFilename: false,
		spriteSheetWidth: 0,
		spriteSheetHeight: 0,
		animated: false,
		animationFrames: {}
	},options);

	var _spriteLoaded = false,
		_spriteSheetPath = './TowerDefence/sprites/',
		_spriteSheet = false;

	var _animationIndex = 0,
		_animationIndexI = 0,
		_animationFrameKey = 'down';

	function construct(){
		init();
		return self;
	}
	function init(){
		if(self.spriteFilename){
			load(self.spriteFilename);
		}
	}

	function load(spriteSheetSrc){
		_spriteLoaded = false;
		_spriteSheet = document.createElement('img');
		_spriteSheet.setAttribute('src', _spriteSheetPath+spriteSheetSrc+'.png')
		_spriteSheet.onload = function(){
			_spriteLoaded = true;
		}
	}

	function update(){
		// Animation
		// TODO: Need to add timing to the animations
		if(_spriteLoaded && self.animated){
			var frameKey = false;
			if(Entity.direction==1){
				frameKey='up';
			}
			if(Entity.direction==2){
				frameKey='right';
			}
			if(Entity.direction==3){
				frameKey='down';
			}
			if(Entity.direction==4){
				frameKey='left';
			}
			if(frameKey){
				if(frameKey!=_animationFrameKey){
					_animationFrameKey = frameKey;
					_animationIndex = 0;
				}else{
					_animationIndexI++;
					if(_animationIndexI>=self.animationFrames[_animationFrameKey].length){
						_animationIndexI=0;
					}
				}
			}
			_animationIndex = self.animationFrames[_animationFrameKey][_animationIndexI];
		}
	}

	function render(ctx){
		if(_spriteLoaded){
			var spriteX = 0, spriteY = 0;
			if(self.animated){
				spriteX = (_animationIndex % (self.spriteSheetWidth/self.width)) * self.width;
				spriteY = ~~(_animationIndex / (self.spriteSheetWidth/self.width)) * self.width;
			}
			ctx.drawImage(_spriteSheet, spriteX, spriteY, self.width, self.height, Entity.x-Camera.x, Entity.y-Camera.y, self.width, self.height);
		}
	}

	self.load = load;

	self.update = update;
	self.render = render;

	return construct();
}