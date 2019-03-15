'use strict';

// page manager
(function() { 

	// список экранов
	var screens = {
	  'menuScreen': {
	    onShow: function(){ },
	    onHide: function(){ }
	  },
	  'gameScreen': {
	    onShow: function(){
	    	$(document).trigger( 'game:start' ); },
	    afterShow: function(){
	    	$('canvas:first').focus(); },
	    onHide: function(){ },

	    'showAnimation': 'fadeIn',
	    'showDuration': 400,
	    'hideAnimation': 'fadeOut',
	    'hideDuration': 1000
	  },
	  'endScreen': {
	    onShow: function(){ },
	    onHide: function(){ }
	  }
	};

	var modals = {
	  'pauseModal': {
	  	text: 'Pause',
	  	buttons: {
	  		'continue': {
	  			value: "continue",
	  			onClick: function(){
	  				$(document).trigger( 'game:playing' );
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	    			$('canvas:first').focus();
	  			}
	  		},
	  		'menu': {
	  			value: "menu",
	  			onClick: function(){
	  				$(document).trigger( 'game:menu' );
  					$(document).trigger( 'show-screen', 'menuScreen' );
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	  			}
	  		}
		  },
		  onShow: function() { 
	    	$(document).trigger( 'game:pause' );
	    },
	    onHide: function() {
	    },
	    'hideDuration': 1000
		}
	};



  // менеджер экранов, управляющий экранами на странице
	new ScreenManager( screens, modals );

	// создание модального окна с добавлением в него массива кнопок
	// кнопка: текст + функция при нажатии 

	// var modalWindow = new ModalWindow( "pause", [
	// 	// { text: "continue", on_click_event: 'modalWindow:continue' },
	// 	{ text: "continue", func: function(){ $(document).trigger( 'modalWindow:continue' ); } },
	// 	{ text: "menu", func: function(){ $(document).trigger( 'modalWindow:menu' ); } }
	// ]);

	// >>> LISTENERS AND TRIGGERS >>> 
	// $( '.startButton' ).click(function(e) {
 //    $(document).trigger( 'page:start-btn-clicked' );
	//   screenManager.showOneScreen('gameScreen');
 //  });


  // $( document ).on( 'game:pause', function( e, data ){
  //     modalWindow.show();
  //   });

  // $( '#menu' ).click(function(e) {
  //   $(document).trigger( 'page:menu-btn-clicked' );
	 //  screenManager.showOneScreen('startScreen');
  // });

  // $( document ).on( 'game:end', function(e) {
	 //  screenManager.showOneScreen('endScreen');
  // });

  // $( document ).on( 'modalWindow:continue', function(e) {
	 //  screenManager.showOneScreen('gameScreen');
	 //  modalWindow.hide();
  // });

  // $( document ).on( 'modalWindow:menu', function(e) {
	 //  screenManager.showOneScreen('startScreen');
	 //  modalWindow.hide();
  // });


  //
 


  // 
  // screenManager.showOneScreen('startScreen');
  $(document).trigger( 'show-screen', 'menuScreen' );

  $(document).trigger( 'page:ready' );
	// <<< LISTENERS AND TRIGGERS <<<
})();

