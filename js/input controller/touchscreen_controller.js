'use strict';

class TouchscreenInputDevice extends TouchDevice{
  constructor(){
    super();;
  };

  attach( target, scope ){
    super.attach( target, scope, 'touchstart', 'touchend' );
  };

  getCursorPositionFromEvent(e){
    return {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
  };

  detach( target ){
    console.log("detach target touchscreen");
    super.detach( target, 'touchstart', 'touchend' );
  };
}
