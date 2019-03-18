'use strict';

class ScreenManager {

	constructor ( screens, modals ){
    
    var scope = this;
    
    this.screens = [];
    this.modals = [];

    for( var screen_name in screens ){
      this.createScreen( screen_name, screens[screen_name] );
    };

    for( var modal_name in modals ){
      this.createModal( modal_name, modals[modal_name] );
    };

    $('[data-event]').each(function(i,e){
      var event = $(e).data('event').split(':');
      $(e).click( function(){ $(document).trigger( event[0], event[1] ); } )
    });

    $(document)
      .on( 'button-click', function( e, data ){
        var data = data.split('+');
        scope.modals[data[1]].data.buttons[data[0]].onClick();
      })
      .on( 'show-screen', function( e, data ){
        scope.showScreen( data );
      })
      .on( 'show-modal', function( e, data ){
        scope.showModal( data )
      })
      .on( 'hide-modal', function( e, data ){
      scope.hideModal( data  );
      })
    ;

  };

  createScreen( target, data ){
    var screen = new Screen( document.getElementById( target ), data );
    this.screens[target] = screen;
  };

  createModal( target, data ){
    var modal = new ModalWindow( target, data );
    this.modals[target] = modal;
  };

  showScreen( screen_name ){
    
    var scope = this;
    var screen = this.screens[screen_name];

    if ( !screen ){
      console.log("ScreenManager:", "screen no exist: " + screen_name);
      return;}

    if( this.current_screen ) {
      this.hideScreen( function(){ scope.showScreen(screen_name); } );
      return;
    }

    this.current_screen = screen;

    if( screen.data.onShow ) screen.data.onShow();

    if( screen.data.afterShow )
      var afterShow = function(){ screen.data.afterShow() };

    screen.show( afterShow );
  };

  hideScreen( onComplete ){
    if( !this.current_screen ) return;

    var screen = this.current_screen;
    if( screen.data.onHide ) screen.data.onHide();
    this.current_screen = undefined;

    screen.hide( onComplete );
  };

  showModal ( modal_name ){
    var modal = this.modals[modal_name];

    if ( !modal ){
      console.log("ScreenManager:", "screen no exist: " + modal_name);
      return;
    }

    modal.data.onShow();

    modal.show();
  };

  hideModal ( modal_name ){
    var modal = this.modals[modal_name];

    if ( !modal ){
      console.log("ScreenManager:", "screen no exist: " + modal_name);
      return;
    }

    modal.data.onHide();

    modal.hide();
  }

};
