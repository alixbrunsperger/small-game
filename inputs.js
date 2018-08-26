/* Inputs */

// Keys pressed
keys = {
  left: false,
  up: false,
  top: false,
  attack:false
};

attack_timer = 0;

// Key down / keypress (left, top, right)
onkeydown = onkeypress = function(e){
  switch(e.keyCode){
    case 32:
      keys.attack = hero.attack_timer < 2 ;
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