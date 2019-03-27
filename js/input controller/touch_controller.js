'use strict';

class TouchDevice extends Controller{
  constructor(){
    super();
    this.actions_by_gestures = {};
  };

  bindActions(action){
    for (var gesture in action.gestures){
      this.actions_by_gestures[action.gestures[gesture]] = action;
    }
  };

  getCursorPositionFromEvent(e){
    return {
      x: e.screenX,
      y: e.screenY 
    };
  };

  attach( target, scope, touchdown, touchup ){

    if( !this.onTouchDown ){

      var device = this;
      var deviceMovement;

      this.onTouchDown = function(e){
        if (!device.enabled)
          return;
        var cursor_pos = device.getCursorPositionFromEvent(e);
        deviceMovement = { x: cursor_pos.x , y: cursor_pos.y };
        // console.log(deviceMovement);
      };

      this.onTouchUp = function(e){
        if (e.cancelable) {
          e.preventDefault();
        }
        if (!device.enabled)
          return;
        var cursor_pos = device.getCursorPositionFromEvent(e);
        deviceMovement = {  x:(cursor_pos.x-deviceMovement.x),
                            y: (cursor_pos.y-deviceMovement.y) };

        scope.setActionActive(action, true, cursor_pos);
        scope.setActionActive(action, false, cursor_pos);


        var minSwipeLengthTmp = device.minSwipeLength || 0;

        var absDeviceMovementX = Math.abs(deviceMovement.x);
        var absDeviceMovementY = Math.abs(deviceMovement.y);

        // CHECK LENGTH
        if (absDeviceMovementX < minSwipeLengthTmp && absDeviceMovementY < minSwipeLengthTmp){
          return;
        }
        var action = device.actions_by_gestures[ 'touchup' ];
        // if (minSwipeLengthTmp * minSwipeLengthTmp > (deviceMovement.x * deviceMovement.x + deviceMovement.y * deviceMovement.y)
        //   return;

        if ( absDeviceMovementX > absDeviceMovementY ) {
          if (deviceMovement.x < 0)
            action = device.actions_by_gestures[ 'swipe-left' ];
          else
            action = device.actions_by_gestures[ 'swipe-right' ];
        } 
        else if (absDeviceMovementX < absDeviceMovementY ) {
          if (deviceMovement.y < 0)
            action = device.actions_by_gestures[ 'swipe-up' ];
          else
            action = device.actions_by_gestures[ 'swipe-down' ];
        }

        scope.setActionActive(action, true);
        scope.setActionActive(action, false)
        deviceMovement = null;
      };
    };

    target.addEventListener( touchdown, this.onTouchDown, true );
    target.addEventListener( touchup, this.onTouchUp, true );  
  };

  detach( target, touchdown, touchup ){
    target.removeEventListener( touchdown, this.onTouchDown );
    target.removeEventListener( touchup, this.onTouchUp );
  };
}