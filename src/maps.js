change_step = function(isForward, current_map, hero, keys, frametime_coef, maps) {
    var nextMap = 0;
    switch(current_map){
      case 0 :
        if(isForward) {
            nextMap = current_map + 1;
            //check
            hero.x = 73;
            hero.y = findY(hero.x, nextMap);
            hero.move(keys, frametime_coef);
        }
        break;
      case 1 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 2 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 3 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 4 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 5 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 6 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 7 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 8 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
          hero.move(keys, frametime_coef);
          break;
      case 9 :
          nextMap = isForward ? current_map + 1 : current_map - 1;
          hero.x = isForward ? 73 : 680;
          hero.y = findY(hero.x, nextMap);
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
        '1111111111111111111111111',
    ];

    for(var i = 0; i < 11 ; i++){
        switch(i){
            case 0 :
            case 9 :
            case 10 :
                maps[i] = flatMap;
                break;
            case 1 :
                maps[1] = flatMap
                maps[1][12] = '0000011111000000000000000';
                break;
            default :
                maps[i] = generateLevel();
                break;
        }
    }

    return maps;
};

generateLevel =  function(){
    var map = [];
    var height = Math.floor((Math.random() * 3));
    var hasCellar = height === 3;
    var nextBreak = Math.floor((Math.random() * 3)+1);
    var emptyLine = '0000000000000000000000000';
    var cellarLine = '0000444444444444444440000';
    var emptyTile = 0;
    var tile = Math.floor((Math.random() * 3)+1)

    map = [
        (hasCellar ? cellarLine : emptyLine),
        emptyLine,
        emptyLine,
        emptyLine,
        '','','','','','','','','',
        emptyLine.replace(/0/g, tile)
    ];

    for(var i = 0; i<25;i++){
        if(i % nextBreak === 0 && i > 0){
            nextBreak = nextBreak + Math.floor((Math.random() * 3)+1);
            height = height + Math.floor((Math.random() * 5)) -2;
        }

        for(var j= 4;j<13;j++){
            map[j] = map[j] + (j < parseInt(13-height, 10) ? emptyTile : tile);
        }
    }

    return map;
};

module.exports = {
    maps: initMaps(),
    change_step: change_step
}
