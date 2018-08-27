/* Inputs */

// Keys pressed
keys = {
  left: false,
  up: false,
  top: false,
  attack:false
};


// Key down / keypress (left, top, right)
onkeydown = onkeypress = function(e){
  switch(e.keyCode){
    case 32:
      keys.attack = hero.timer_attack < 1 ;
      break;
    case 37:
      keys.left = true;
      break;
    case 38:
      keys.up = true;
      break;
    case 39:
      keys.right = true;
      break;
  }
};

// Key up (left, top, right)
onkeyup = function(e){
  switch(e.keyCode){
    case 32:
        hero.timer_attack = 0;
      keys.attack = false;
      break;
    case 37:
      keys.left = false;
      break;
    case 38:
      keys.up = false;
      break;
    case 39:
      keys.right = false;
      break;
  }
};