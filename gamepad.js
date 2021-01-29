
//Gamepad code from:
// https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/ 

function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "demo_post.asp", true);
  xhttp.send();
}

if(!!navigator.getGamepads){
    // Browser supports the Gamepad API

    var gamepads = navigator.getGamepads();
    var gamepad = navigator.getGamepads()[0];

    // Figure out deadzone of contorller
    var applyDeadzone = function(number, threshold){
        percentage = (Math.abs(number) - threshold) / (1 - threshold);
     
        if(percentage < 0)
           percentage = 0;
     
        return percentage * (number > 0 ? 1 : -1);
    }

    //Multiple gamepads
    //GamepadList {0: Gamepad, 1: Gamepad, 2: undefined, 3: undefined}
    //Each Gamepad looks like this:
    /*
    axes: Array[4]
    buttons: Array[16]
    connected: true
    id: "Xbox 360 Controller (XInput STANDARD GAMEPAD)"
    index: 0
    mapping: "standard"
    timestamp: 12
    */


    //apply deadzone
    



    //buttons

    //left trigger
    if(gamepad.buttons[6].value > 0.5){
      useBrakes()
    }

    //right trigger
    if(gamepad.buttons[7].value > 0.5){
        useGas()
    }
}




var keys = {},
    speed = 4,
    player = document.getElementById('player'),
    applyDeadzone = function(number, threshold){
        percentage = (Math.abs(number) - threshold) / (1 - threshold);
        if(percentage < 0){
            percentage = 0;
        }
        return percentage * (number > 0 ? 1 : -1);
    },
    gamepad = null,
    joystickX = 0, 
    horizontalMovement = 0,
    getHorizontalMovementFromKeys = function(){
      
      movement = 0;
      
      if(keys[37]){ //left or right arrow key
        movement = -speed;
      }
      if(keys[39]){ //left or right arrow key
        movement += speed;
      }
      
      return movement;
    },
    gameloop = function(){
      
      gamepad = navigator.getGamepads()[0];
      if(gamepad){
        joystickX = applyDeadzone(gamepad.axes[0], 0.25) * speed;
        if(Math.abs(joystickX) > 0){
          horizontalMovement = joystickX;
        }else{
          horizontalMovement = getHorizontalMovementFromKeys();
        }
      }else{
        horizontalMovement = getHorizontalMovementFromKeys();
      }
       
      if(Math.abs(horizontalMovement) > 0){
        playerLeft = parseFloat(window.getComputedStyle(player,null).getPropertyValue("left"));

        if(playerLeft){
          player.style.left = (playerLeft + horizontalMovement) + "px";
        }
      }

      window.requestAnimationFrame(gameloop);
    };

window.onkeydown = function(e){
  var e = e || window.event;
  keys[e.keyCode] = true;
}

window.onkeyup = function(e){
  var e = e || window.event;
  delete keys[e.keyCode];
}

gameloop();