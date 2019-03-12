'use strict';

class ScreenManager {

	constructor ( screens ){
    this.screens = [];
    for( var screen_name in screens ){
      this.createScreen( screen_name );
      if ( screens[screen_name].visible )
        this.showScreen( screen_name );
      else
        this.hideScreen( screen_name );
    };

  };

  createScreen( target ){
    var screen = new Screen( document.getElementById( target ) );
    this.screens[target] = screen;
  };

  hideScreen( screen_name ){
    this.screens[screen_name].hide();
  };

  showScreen( screen_name ){
    this.screens[screen_name].show();
  };

};
