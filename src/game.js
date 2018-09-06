// Requires
var hero = require('./hero');
var mapsTools = require('./maps');
var tiles = require('./tiles');
var ctx = require('./canvas');
var enemiesTools = require('./enemy');
var texts = require('./texts');
var song = require('./song');
var player = require('./player-small');

// Constants
var prev_time = +new Date();
var time = 0;
var frametime = 0;
var normal_frametime = 16;
var frametime_coef = 0;
var total_frames = 0;
var up=1;
var right=1;
var invertUp = 1;
var invertRight = 1;
var end = false;
var current_map = 0;
var play =  false;

var tile_w = 32;
var tile_h = 32;

var maps= mapsTools.maps;

is_solid = function(x,y, mapNumber){
    var level = mapNumber ? mapNumber : current_map;
    var tile_y = Math.floor(y / tile_h);
    // Return false if the pixel is at undefined map coordinates
    if(!maps[level][tile_y]){
        return false;
    }
    var tile_x = Math.floor(x / tile_w);
    if(!maps[level][tile_y][tile_x]){
        return false;
    }
    // Return false if the tile is not solid
    if(tiles[maps[level][tile_y][tile_x]].solid === 0){
        return false;
    }
    // Return true if the tile is solid
    if(tiles[maps[level][tile_y][tile_x]].solid === 1){
        return true;
    }
};

findY = function(x, map, height){
    var y = 0;
    while(!is_solid(x,y, map)) {
        y = y +1;
    }
    return y-(height+ tile_w)-15;
};

var enemies= enemiesTools.initEnemies(findY);

var keys = {
    left: false,
    up: false,
    top: false,
    attack:false
};

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

game = function(){

    // Handle framerate
    time = +new Date();
    frametime = time - prev_time;
    prev_time = time;
    frametime_coef = frametime / normal_frametime;
    total_frames = total_frames +1;

    if(!end && play){
        hero.move(keys, frametime_coef);
    }

    canvas.width = canvas.width;

    ctx.fillStyle = 'black';
    for(i in maps[current_map]){
        for(j in maps[current_map][i]){
            if(maps[current_map][i][j] !== '0'){
                ctx.drawImage(tiles[maps[current_map][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
            }
        }
    }

    // Draw the hero
    ctx.save();

    ctx.fillStyle = 'red';
    ctx.fillRect(hero.x -20, hero.y -25, 40, 5);
    ctx.fillStyle = 'green';
    ctx.fillRect(hero.x -20, hero.y -25 ,(hero.current_hp*40)/hero.hp,5);

    //ctx.restore();
    ctx.translate(hero.x, hero.y);
    ctx.save();
    if(hero.isTouched()){
        ctx.globalAlpha = 0.4;
    }
    ctx.drawImage(hero_sprite, -16, -16, tile_w, tile_h);
    ctx.restore();

    keys.attack ?
        ctx.drawImage(keyboard_sprite2 , 5, 0, 16, 16)
        :
        ctx.drawImage(keyboard_sprite, 5, -6, 16, 16);

    //ctx.save();
    enemies[current_map].forEach(function(mob) {
        enemiesTools.rotate_enemies(mob, 0);
        total_frames % 10 ===0 && enemiesTools.switchEnemySprite(mob);
        enemiesTools.move_enemies(mob, hero, frametime_coef);
        ctx.restore();
        if(enemiesTools.isMonsterTouched(mob)){
            ctx.globalAlpha = 0.4;
        }
        ctx.drawImage(mob.current_sprite, mob.x-(mob.width/2), mob.y-(mob.height/2), mob.width, mob.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(mob.x -20, mob.y-(mob.height/2)-5, 40, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(mob.x -20, mob.y-(mob.height/2)-5 , (mob.current_hp*40)/mob.hp,5);
        //ctx.restore();

        if(!hero.isTouched() && enemiesTools.collision_enemy(mob, hero)){
            hero.current_hp = hero.current_hp-1;
            hero.timer_hit = 50;
        }

        if(keys.attack && enemiesTools.attack_enemy(mob, hero) && !enemiesTools.isMonsterTouched(mob)){
            mob.current_hp = mob.current_hp -1;
            if(mob.current_hp <= 0){
                enemies[current_map].splice( enemies[current_map].indexOf(mob), 1 );
            } else {
                mob.timer_hit = 50;
            }
        }

        enemiesTools.update_monster(mob);

    });
    hero.update(keys);

    ctx.restore();

    texts[current_map].forEach(function(text) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(text,canvas.width/2,(texts[current_map].indexOf(text)+1)* 50);
    }, texts[current_map]);

    if(hero.x > tile_w * 24){
        if(!(current_map === 9 && enemies[current_map].length !== 0)){
            current_map = mapsTools.change_step(true, current_map, hero, keys, frametime_coef, maps);
        }
    }

    if(current_map === 10){
        end=true;
    }

    if(hero.x < tile_w){
        current_map = mapsTools.change_step(false, current_map, hero, keys, frametime_coef, maps);
    }

    // Next frame
    if(hero.current_hp <= 0){
        ctx.font = '20px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('You are dead! Refresh the page to start again', 150,250);
    } else if(end){
        invertUp = up === 0 || up === 300 ? -invertUp : invertUp;
        invertRight = right === 0 || right === 20 ? -invertRight : invertRight;
        up = up + invertUp;
        right = right + invertRight;
        ctx.drawImage(nyancat, (canvas.width/2 -150+ up), (canvas.height/2 -10 + right), 32, 32);
        requestAnimationFrame(game);
    } else {
        requestAnimationFrame(game);
    }
};

playSong = function(){
    player.init(song);
    var done = 0;
    setInterval(function () {
        if(done){
            return;
        }
        done = player.generate() >= 1;

        if(done){
            var wave = player.createWave();
            var audio = document.getElementById("audioElement");
            audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
            audio.play();
        }
    }, 0);
};

switchPlay = function(){
    play=true;
}

onload = function(){
    hero.rotate(0);
    playSong();
    setTimeout(switchPlay,1000);
    game();
}