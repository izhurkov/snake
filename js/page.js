'use strict';

// page manager
(function() { 
	$(document).trigger( 'page:ready' );

	// список экранов
	var screens = {
	  'startScreen': {
	    visible: true
	  },
	  'gameScreen': {
	    visible: false
	  },
	  'endScreen': {
	    visible: false
	  }
	};

  // менеджер экранов, управляющий экранами на странице
	var screenManager = new ScreenManager( screens );

	// создание модального окна с добавлением в него массива кнопок
	// кнопка: текст + функция при нажатии 
  var buttons = [];
	buttons.push( { text: "continue", func: function(){ $(document).trigger( 'modalWindow:continue'); } } );
	buttons.push( { text: "menu", func: function(){ $(document).trigger( 'modalWindow:menu' ); } } );
	var modalWindow = new ModalWindow( "pause", buttons );


	// >>> LISTENERS AND TRIGGERS >>> 
	$( '.startButton' ).click(function(e) {
    $(document).trigger( 'page:start-btn-clicked' );
	  screenManager.showOneScreen('gameScreen');
  });

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
	// <<< LISTENERS AND TRIGGERS <<<
})();

