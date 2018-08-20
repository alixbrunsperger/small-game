/* Game loop */


// Constants
var prev_time = +new Date();
var time = 0;
var frametime = 0;
var normal_frametime = 16;
var frametime_coef = 0;
var total_frames = 0;

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
    move_hero();

    // Draw the scene
    canvas.width = canvas.width;

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
    ctx.translate(hero.x, hero.y);
    ctx.drawImage(hero_sprite, -16, -16, tile_w, tile_h);

    keys.attack ?
        ctx.drawImage(dagger_sprite2 , 5, 0, 16, 16)
        :
        ctx.drawImage(dagger_sprite, 5, -6, 16, 16);

    enemies[current_map].forEach((mob) => {
        rotate_ennemies(mob, 0);
        total_frames % 10 ===0 && switchEnemySprite(mob);
        console.log(mob.x, mob.y);
        move_ennemies(mob);
        console.log('moved', mob.x, mob.y);
        ctx.drawImage(mob.current_sprite, mob.x, mob.y, 32, 32);
    });

    ctx.restore();

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

    // Debug
    enemies[current_map].forEach((mob) => {
        for(var i in vectors){
            ctx.fillStyle = "red";
            ctx.fillRect(mob.x + mob[i][0]-1, mob.y + mob[i][1]-1,2,2);
        }
    })

    if(hero.x > tile_w * 24){
        change_step(true);
    }

    if(hero.x < tile_w){
        change_step(false);
    }

    // Next frame
    requestAnimationFrame(game);
};

onload = function(){
    rotate_hero(0);
    game();
}