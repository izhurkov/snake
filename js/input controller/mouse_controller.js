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
    console.log("detach target mouse");
    super.detach( target, 'mousedown', 'mouseup' );
  };
}
