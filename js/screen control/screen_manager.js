'use strict';

class ScreenManager {

	constructor ( screens ){
    
    var scope = this;

    this.screens = [];

    for( var screen_name in screens ){
      this.createScreen( screen_name, screens[screen_name] );
      // if ( screens[screen_name].visible )
      //   this.showScreen( screen_name );
      // else
        this.hideScreen( screen_name );
    };

    $('[data-event]').each(function(i,e){
      console.log('data-event',i,e);
      var event = $(e).data('event').split(':');
      $(e).click(function(){ $(document).trigger( event[0], event[1] ); })
    });

    $(document).on('show-screen', function( e, data ){
      console.log("on show-screen: ", e, data );
      scope.showOneScreen(data);
    });

  };

  // добавить экран
  createScreen( target, data ){
    var screen = new Screen( document.getElementById( target ), data );
    this.screens[target] = screen;
  };


  // показать экран
  showScreen( screen_name ){
    
    var scope = this;
    
    if( this.current_screen ) {
      this.hideScreen( function(){ scope.showScreen(screen_name); } );
      return;
    }

    var screen = this.screens[screen_name];
    console.log('showScreen: ', screen );
    this.current_screen = screen;
    if( screen.data.onShow ) screen.data.onShow();
    screen.show();
  };


  // скрыть экран
  hideScreen( onComplete ){
    if( !this.current_screen ) return;

    var screen = this.current_screen;
    if( screen.data.onHide ) screen.data.onHide();
    this.current_screen = undefined;

    screen.hide( onComplete );

  };



  // показывает один из экранов
  showOneScreen( screen_name ){
    // for ( let screen_name in this.screens ){
    //   this.hideScreen();
    // }
    this.showScreen( screen_name );
  };

};
