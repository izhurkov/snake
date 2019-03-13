'use strict';

class ScreenManager {


  // менеджер экранов, управляет всеми экранами на странице
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

  // добавить экран
  createScreen( target ){
    var screen = new Screen( document.getElementById( target ) );
    this.screens[target] = screen;
  };

  // скрыть экран
  hideScreen( screen_name ){
    this.screens[screen_name].hide();
  };

  // показать экран
  showScreen( screen_name ){
    this.screens[screen_name].show();
  };

  // показывает один из экранов
  showOneScreen( screen_name ){
    for ( let screen_name in this.screens ){
      this.hideScreen( screen_name );
    }
    this.showScreen( screen_name );
  };

};
