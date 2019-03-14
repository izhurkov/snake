'use strict';

// page manager
(function() { 

	// список экранов
	var screens = {
	  'startScreen': {
	    onShow: function(){
	    	// console.log('onShow');
	    },
	    onHide: function() {
	    	// console.log('onHide');
	    },
	    'hideAnimation': 'fadeOut',
	    'hideDuration': 200,

	  },
	  'gameScreen': {
	    // show
	    beforeShow: function(){
	    	
	    },
	    onShow: function(){
	    	$(document).trigger( 'game:start' );
	    },
	    afterShow: function() {
	    	$('canvas:first').focus();
	    },
	    // hide
	    beforeHide: function(){ 
	    },
	    onHide: function(){
	    	$(document).trigger( 'game:pause' );
	    },
	    afterHide: function() {},

	    'showAnimation': 'fadeIn',
	    'showDuration': 400,
	    'hideAnimation': 'fadeOut',
	    'hideDuration': 1000
	  },
	  'endScreen': {
	    onShow: function(){
	    	// console.log('onShow');
	    },
	    onHide: function() {
	    	// console.log('onHide');
	    }
	  }
	};

  // менеджер экранов, управляющий экранами на странице
	new ScreenManager( screens );

	// создание модального окна с добавлением в него массива кнопок
	// кнопка: текст + функция при нажатии 

	var modalWindow = new ModalWindow( "pause", [
		// { text: "continue", on_click_event: 'modalWindow:continue' },
		{ text: "continue", func: function(){ $(document).trigger( 'modalWindow:continue' ); } },
		{ text: "menu", func: function(){ $(document).trigger( 'modalWindow:menu' ); } }
	]);

	// >>> LISTENERS AND TRIGGERS >>> 
	// $( '.startButton' ).click(function(e) {
 //    $(document).trigger( 'page:start-btn-clicked' );
	//   screenManager.showOneScreen('gameScreen');
 //  });

/*
  $( '#pause' ).click(function(e) {
    $(document).trigger( 'page:pause-btn-clicked' );
		modalWindow.show();
  });

  $( '#menu' ).click(function(e) {
    $(document).trigger( 'page:menu-btn-clicked' );
	  screenManager.showOneScreen('startScreen');
  });

  $( document ).on( 'game:end', function(e) {
	  screenManager.showOneScreen('endScreen');
  });

  $( document ).on( 'modalWindow:continue', function(e) {
	  screenManager.showOneScreen('gameScreen');
	  modalWindow.hide();
  });

  $( document ).on( 'modalWindow:menu', function(e) {
	  screenManager.showOneScreen('startScreen');
	  modalWindow.hide();
  });
*/

  //
 


  // 
  // screenManager.showOneScreen('startScreen');
  $(document).trigger( 'show-screen','startScreen' );

  $(document).trigger( 'page:ready' );
	// <<< LISTENERS AND TRIGGERS <<<
})();

