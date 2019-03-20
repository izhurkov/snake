'use strict';

class MouseInputDevice extends TouchDevice{

  constructor(){
    super();
  };

  attach( target, scope ){
    super.attach( target, scope, 'mousedown', 'mouseup' )
  };

  getCursorPositionFromEvent(e){
    return {
      x: e.offsetX,
      y: e.offsetY
    };
  };

  detach( target ){
    super.detach( target, 'mousedown', 'mouseup' );
  };
}
