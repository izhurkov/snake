'use strict';

(function() {
	
	new ProgressBar();

	var manifest = [
	
			// images
		  {src:"assets/Ground.png", id:"ground"},
		  {src:"assets/Wall.png", id:"wall"},
		  {src:"assets/Wall2.png", id:"wallDark"},
		  {src:"assets/snake-graphics.png", id:"snake-graphics"},
		  {src:"assets/CartoonSmoke.png", id:"cartoonSmoke"},
		  {src:"assets/Bubbles.png", id:"bubbles"},
		  {src:"assets/snake_texture.jpg", id:"snake-texture"},

		  // skybox
		  {src:"assets/dawnmountain-xpos.png", id:"dawnmountain-xpos"},
		  {src:"assets/dawnmountain-xneg.png", id:"dawnmountain-xneg"},
		  {src:"assets/dawnmountain-ypos.png", id:"dawnmountain-ypos"},
		  {src:"assets/dawnmountain-yneg.png", id:"dawnmountain-yneg"},
		  {src:"assets/dawnmountain-zpos.png", id:"dawnmountain-zpos"},
		  {src:"assets/dawnmountain-zneg.png", id:"dawnmountain-zneg"},

		  // sounds
		  {src:"assets/bonus.mp3", id:"bonus_mp3"},
		  {src:"assets/game over.mp3", id:"game_over_mp3"},
		  {src:"assets/music.mp3", id:"music_mp3"},

		  // js
		  // {src:"js/libs/pixi.min.js"},
		  // {src:"js/libs/pixi-particles.js"},
		  // {src:"js/libs/pixi-sound.js"},
		  // {src:"js/libs/three.min.js"},
		  // {src:"js/libs/SPE.min.js"},

		  // {src:"js/input controller/controller.js"},
		  // {src:"js/input controller/input_controller.js"},
		  // {src:"js/input controller/keyboard_controller.js"},
		  // {src:"js/input controller/touch_controller.js"},
		  // {src:"js/input controller/touchscreen_controller.js"},
		  // {src:"js/input controller/mouse_controller.js"},
		  
		  // {src:"js/renderer/canvas_renderer.js"},
		  // {src:"js/renderer/pixijs_renderer.js"},
		  // {src:"js/renderer/emitter_manager.js"},
		  // {src:"js/renderer/three_renderer.js"},
		  // {src:"js/renderer/renderer.js"},
		  
		  // {src:"js/sound manager/sound_manager.js"},
		  
		  // {src:"js/asset manager/asset_manager.js"},
		  // {src:"js/asset manager/timer.js"},
		  // {src:"js/asset manager/game objects/bonus.js"},
		  // {src:"js/asset manager/game objects/snake.js"},
		  // {src:"js/asset manager/game objects/area.js"},
		  // {src:"js/asset manager/game objects/apple.js"},
		  // {src:"js/asset manager/game objects/frog.js"},
		  // {src:"js/asset manager/game objects/rock.js"},
		  // {src:"js/asset manager/game objects/accelerator.js"},
		  
		  // {src:"js/screen manager/screen.js"},
		  // {src:"js/screen manager/screen_manager.js"},
		  // {src:"js/screen manager/modal_window.js"},
		  // {src:"js/screen manager/interface_controller.js"},
		  
		  // {src:"js/math/matrixArray.js"},
		  // {src:"js/math/randomInteger.js"},
		  // {src:"js/math/vector.js"},

		  // {src:"js/state machine/state_machine.js"},

		  // {src:"js/game.js"},

		  // {src:"js/game_init.js"}
		];

	new Preloader( manifest );

})();

