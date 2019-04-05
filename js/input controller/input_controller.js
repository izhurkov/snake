'use strict';

class InputController {

  constructor( config, target ){
    
    this.ACTION_ACTIVATED = "input-controller:action-activated";
    this.ACTION_DEACTIVATED = "input-controller:action-deactivated";
    
    this.enabled = true;
    this.actions = {};

    var default_devices = {
      keyboard: {
        enabled: true,
        device_class: KeyboardInputDevice
      },
      mouse: {
        enabled: true,
        device_class: MouseInputDevice
      },
      touchscreen: {
        enabled: true,
        device_class: TouchscreenInputDevice
      }
    }


    this.active_devices = {};

    for( var device_name in config.devices ){
      var device_config = config.devices[device_name];
      if( !device_config.enabled ) continue;
      var device_object = default_devices[device_name];
      if( !device_object && typeof(device_config.device_class) !== undefined) {
        this.active_devices[ device_name ] = new device_config.device_class();  
      }else{
        this.active_devices[ device_name ] = new device_object.device_class();
        if (device_config)
          this.addProperties(this.active_devices[device_name], device_config);
      }
    };
     
    if( config.actions ){
      this.bindActions( config.actions );
    };

    this.attach( target );
  };

  addProperties( device, device_config ){
    for( var config_name in device_config ){
      device[config_name] = device_config[config_name];
    }
  };

  bindActions( actionsToBind ){

    var newActions = this.actions;
    
    for (var actionName in actionsToBind){
      
      var action = actionsToBind[actionName];
      var new_action = newActions[actionName];

      if (!new_action){
        new_action = newActions[actionName] = Object.assign({},action);
        if( new_action.enabled === undefined ) new_action.enabled = true;
        new_action.name = actionName;
        new_action.active = false;
      }
      else{
        for( var device_name in this.active_devices ){
          var device = this.active_devices[ device_name ];
          device.addActionProperties( new_action, action );
        }
      }

      // set actions by input in controllers
      for( var device_name in this.active_devices ){
        var device = this.active_devices[ device_name ];
        device.bindActions( new_action );
      }
    }
  };

  // remove some input (key code, swipe name, etc.) from actions
  removeInputFormAction( input ){
    for( var device_name in this.active_devices ){
      var device = this.active_devices[ device_name ];
      device.removeInput( input );
    }
  };

  enableInputDevice( deviceName, value ){
    this.active_devices[deviceName].enabled = value;
  };

  attach( target, dontEnable ){
    this.target = target;

    if (!this.target) return;
    this.enabled = ( dontEnable === true ) ? false : true;

    var scope = this;

        // >>> FOCUS >>>
    if( !this.onFocus ){

      this.onFocus = function(e){
        scope.attach(scope.target);
      }

      this.onBlur = function(e){
        scope.deactiveAllActions();
      }
    };

    this.target.addEventListener( 'focus', this.onFocus, true );
    this.target.addEventListener( 'blur', this.onBlur, true );
    // <<< FOCUS <<<

    for( var device_name in this.active_devices ){
      var device = this.active_devices[ device_name ];
      device.attach( target, scope );
    }

    $( target ).focus();

  };

  detach(){

    this.deactiveAllActions();
    if ( !this.target ) return;
    
    for( var device_name in this.active_devices ){
      var device = this.active_devices[ device_name ];
      device.detach( this.target );
    }

    this.target.removeEventListener( 'focus', this.onFocus, true );
    this.target.removeEventListener( 'blur', this.onBlur, true );
    this.target = null;
  };

  // >>> ACTIONS >>>
  enableAction( actionName, value ){
    var newAction = this.actions[actionName];
    if (!newAction) return;
    newAction.enabled = value;
  };

  setActionActive( action, _active, cursor_pos ){

    if (!this.enabled) return;

    if ( !action ) return;
    if ( !action.enabled ) return false;
    if ( action.active === _active ) return;

    action.active = _active;
    var event =  _active ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED;
    // document.dispatchEvent( event );
    $(document).trigger( event, {detail: { action_name: action.name, cursor_pos: cursor_pos } } );
  };

  deactiveAllActions(){

    for (var actionName in this.actions){
      this.actions[actionName].active = false;
    }
    $(document).trigger( "deactiveAllActions" );

    // for( var device_name in this.active_devices ){
    //   var device = this.active_devices[ device_name ];
    //   device.detach( this.target );
    // }
  };

  isActionActive( actionName ){

    var action = this.actions[actionName];
    if ( !action ) return;
    
    return action.enabled && action.active;
  };

  isActionEnable( actionName ){

    var action = this.actions[actionName];
    if ( !action ) return;
    
    return action.enabled;
  };
  // <<< ACTIONS <<<
}
