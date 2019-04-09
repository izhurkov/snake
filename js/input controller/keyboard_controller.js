'use strict';

class KeyboardInputDevice extends Controller{

  constructor(){
    super();
    this.actions_by_keycode = {};
  };

  bindActions(action){
    for (var keyCode in action.keyCodes){
      this.actions_by_keycode[action.keyCodes[keyCode]] = action;
    }
  };

  addActionProperties(oldAction, newAction){
    this.addNewKeys(oldAction.keyCodes, newAction.keyCodes);
  };

  addNewKeys(oldKeys, newKeys){
    newKeys.forEach(function(keyCode){
      if( oldKeys.indexOf(keyCode) == -1 ) oldKeys.push( keyCode );
    });
  };

  attach( target, scope ){

    if( !this.onKeyDown ){

      var keyboard = this;

      this.onKeyDown = function(e){
        if (!keyboard.enabled)
          return;
        var actions = keyboard.getActionsByKeycode( e.keyCode );
        for (var action in actions) {
          scope.setActionActive( actions[action], true );
        }
      };

      this.onKeyUp = function(e){
        if (!keyboard.enabled)
          return;
        var actions = keyboard.getActionsByKeycode( e.keyCode );
        for (var action in actions) {
          scope.setActionActive( actions[action], false );
        }
      };
    };

    target.addEventListener( 'keydown', this.onKeyDown, true );
    target.addEventListener( 'keyup', this.onKeyUp, true );
  };

  getActionsByKeycode( keyCode ){
    var actions = [];
    for ( var k in this.actions_by_keycode){
      if ( k == keyCode){
        actions.push( this.actions_by_keycode[ k ] )
      }
    }
    return actions;
  }

  detach( target ){
    target.removeEventListener( 'keyup', this.onKeyUp );
    target.removeEventListener( 'keydown', this.onKeyDown );
  };

  removeInput( input ){
    this.removeKey( input );
  };

  removeKey( keyCode ){
    try {
      this.actions_by_keycode[ keyCode ].active = false;
    }
    catch (e) {}
    delete this.actions_by_keycode[ keyCode ];
  };
}
