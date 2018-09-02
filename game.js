// Requires
var hero = require('./hero');

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

game = function(){

    // Handle framerate
    time = +new Date();
    frametime = time - prev_time;
    prev_time = time;
    frametime_coef = frametime / normal_frametime;
    total_frames = total_frames +1;
    //l3.value = frametime_coef;

    //zzz+=1;
    //rotate_hero(zzz);

    // Make the hero move, walk, jump, fall...
    if(!end){
        move_hero();
    }

    // Draw the scene
    canvas.width = canvas.width;

    /*
    for map 0
    ctx.font = "30px Arial";
ctx.fillText("Hello World",10,50);
     */

    ctx.fillStyle = "black";
    for(i in maps[current_map]){
        for(j in maps[current_map][i]){
            if(maps[current_map][i][j] != "0"){
                ctx.drawImage(tiles[maps[current_map][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
            }
        }
    }

    // Draw the hero
    ctx.save();

    ctx.fillStyle = "red";
    ctx.fillRect(hero.x -20, hero.y -25, 40, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(hero.x -20, hero.y -25 ,(hero.current_hp*40)/hero.hp,5);

    //ctx.restore();
    ctx.translate(hero.x, hero.y);
    ctx.save();
    if(isHeroTouched()){
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
        rotate_ennemies(mob, 0);
        total_frames % 10 ===0 && switchEnemySprite(mob);
        move_ennemies(mob);
        ctx.restore();
        if(isMonsterTouched(mob)){
            ctx.globalAlpha = 0.4;
        }
        ctx.drawImage(mob.current_sprite, mob.x-16, mob.y-16, mob.width, mob.height);
        ctx.fillStyle = "red";
        ctx.fillRect(mob.x -20, mob.y -25, 40, 5);
        ctx.fillStyle = "green";
        ctx.fillRect(mob.x -20, mob.y -25 , (mob.current_hp*40)/mob.hp,5);
        //ctx.restore();

        if(!isHeroTouched() && collision_enemy(mob)){
            hero.current_hp = hero.current_hp-1;
            hero.timer_hit = 50;
        }

        if(keys.attack && attack_enemy(mob) && !isMonsterTouched(mob)){
            mob.current_hp = mob.current_hp -1;
            if(mob.current_hp <= 0){
                enemies[current_map].splice( enemies[current_map].indexOf(mob), 1 );
            } else {
                mob.timer_hit = 50;
            }
        }


        update_monster(mob);

    });
    update_hero();

    ctx.restore();

    texts[current_map].forEach(function(text) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(text,canvas.width/2,(texts[current_map].indexOf(text)+1)* 50);
    }, texts[current_map]);

    l3.value = hero.x + ' ' + hero.y + ' ' + current_map;

    // Debug
    /*for(var i in vectors){
      ctx.fillStyle = "red";
      ctx.fillRect(hero.x + hero[i][0]-1, hero.y + hero[i][1]-1,2,2);
    }

    for(var j = 0; j < hero_w; j++){
      ctx.fillStyle = "green";
      ctx.fillRect(hero.x + hero.L4[0] + j * hero.right[0], hero.y + hero.L4[1] + j * hero.right[1],2,2);
    }*/

    // Debug enemies
    /*enemies[current_map].forEach(function(mob) {
        for(var i in vectors){
            ctx.fillStyle = "red";
            ctx.fillRect(mob.x + mob[i][0]-1, mob.y + mob[i][1]-1,2,2);
        }
    })*/

    if(hero.x > tile_w * 24){
        if(!(current_map === 6 && enemies[current_map].length !== 0)){
            change_step(true);
        }
    }

    if(hero.x < tile_w){
        change_step(false);
    }

    // Next frame
    if(hero.current_hp <= 0){
        ctx.font = "20px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("You're dead! Refresh the page to start again", 150,250);
    } else if (end) {
        invertUp = up == 0 || up == 300 ? -invertUp : invertUp;
        invertRight = right == 0 || right == 20 ? -invertRight : invertRight;
        up = up + invertUp*1;
        right = right + invertRight*1;
        ctx.drawImage(nyancat, (canvas.width/2 -150+ up), (canvas.height/2 -10 + right), 32, 32);
    }
        requestAnimationFrame(game);
};

onload = function(){
    hero.rotate(0);
    game();
}