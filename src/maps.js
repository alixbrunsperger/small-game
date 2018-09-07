change_step = function(isForward, current_map, hero, keys, frametime_coef, maps) {
    var nextMap = 0;
    switch(current_map){
      case 0 :
        if(isForward) {
            nextMap = current_map + 1;
            //check
            hero.x = 73;
            hero.y = findY(hero.x, nextMap, hero.height);
            hero.move(keys, frametime_coef);
        }
        break;
      case 1 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 2 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 3 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 4 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 5 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 6 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 7 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 8 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 9 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = isForward ? 401 : findY(hero.x, nextMap, hero.height);
          hero.move(keys, frametime_coef);
          break;
      case 10 :
          break;
  }
  return nextMap;
};

initMaps= function(){
    var maps = [];
    var flatMap = [
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '0000000000000000000000000',
        '2222222222222222222222222',
    ];

    for(var i = 0; i < 11 ; i++){
        switch(i){
            case 0 :
            case 9 :
            case 10 :
                maps[i] = flatMap;
                break;
            case 1 :
                maps[1] = flatMap.slice();
                maps[1][12] = '0000022222000000000000000';
                break;
            default :
                maps[i] = generateLevel();
                break;
        }
    }

    return maps;
};

generateLevel =  function(){
    var height = Math.floor((Math.random() * 3));
    var nextBreak = Math.floor((Math.random() * 3)+1);
    var backgroundTile = Math.floor((Math.random() * 2));
    var emptyLine = backgroundTile.toString().repeat(25);
    var floorTile = 2;

    var map = [
        emptyLine,
        emptyLine,
        emptyLine,
        emptyLine,
        '','','','','','','','','',
        emptyLine.replace(new RegExp(backgroundTile,'g'), floorTile)
    ];

    for(var i = 0; i<25;i++){
        if(i % nextBreak === 0 && i > 0){
            nextBreak = nextBreak + Math.floor((Math.random() * 3)+1);
            height = height + Math.floor((Math.random() * 5)) -2;
        }

        for(var j= 4;j<13;j++){
            map[j] = map[j] + (j < parseInt(13-height, 10) ? backgroundTile : floorTile);
        }
    }

    return map;
};

module.exports = {
    maps: initMaps(),
    change_step: change_step
}
