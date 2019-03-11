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
        var action = keyboard.actions_by_keycode[ e.keyCode ];
        if (!action) return;
        scope.setActionActive( action, true );
      };

      this.onKeyUp = function(e){
        if (!keyboard.enabled)
          return;
        var action = keyboard.actions_by_keycode[ e.keyCode ];
        if (!action) return;
        scope.setActionActive( action, false );
      };
    };

    target.addEventListener( 'keydown', this.onKeyDown, true );
    target.addEventListener( 'keyup', this.onKeyUp, true );
  };

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
