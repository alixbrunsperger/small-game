ctx = canvas.getContext("2d");
canvas_rect = {};
(onresize = function(){
    if(innerWidth < innerHeight * 16 / 9){
        canvas.className = "portrait";
    }
    else {
        canvas.className = "landscape";
    }
    canvas_rect = canvas.getBoundingClientRect();
})();

var enemy_w = 32;
var enemy_h = 32;

var uright = [1,0];
var ubottom = [0,1];

var uL1 = [-16, -16];
var uC1 = [0, -16];
var uR1 = [16, -16];
var uL2 = [-16, 0];
var uR2 = [16, 0];
var uL3 = [-16, 8];
var uC3 = [0, 16];
var uR3 = [16, 8];
var uL4 = [-16, 16];
var uR4 = [16, 16];
var uL5 = [-8, 16];
var uR5 = [8, 16];

base_vectors = {
    "right": uright,
    "bottom": ubottom
};
vectors = {
    "L1": uL1,
    "C1": uC1,
    "R1": uR1,
    "L2": uL2,
    "R2": uR2,
    "L3": uL3,
    "C3": uC3,
    "R3": uR3,
    "L4": uL4,
    "R4": uR4,
    "L5": uL5,
    "R5": uR5,
};
var rotate_ennemies = function(enemy, angle_deg){
    enemy.angle = angle_deg * Math.PI / 180;
    for(var i in base_vectors){
        enemy[i] = [
            base_vectors[i][0] * Math.cos(enemy.angle) - base_vectors[i][1] * Math.sin(enemy.angle),
            base_vectors[i][0] * Math.sin(enemy.angle) + base_vectors[i][1] * Math.cos(enemy.angle)
        ];
    }
    for(var i in vectors){
        enemy[i] = [
            vectors[i][0] * enemy.right[0] + vectors[i][1] * enemy.bottom[0],
            vectors[i][0] * enemy.right[1] + vectors[i][1] * enemy.bottom[1]
        ];
    }
};
var move_ennemies = function(enemy){
    if(enemy.x > hero.x){
        enemy.walk_speed -= enemy.walk_acceleration;
        if(enemy.walk_speed < -enemy.max_walk_speed){
            enemy.walk_speed = -enemy.max_walk_speed;
        }
    }
    else if(enemy.x < hero.x){
        enemy.walk_speed += enemy.walk_acceleration;
        if(enemy.walk_speed > enemy.max_walk_speed){
            enemy.walk_speed = enemy.max_walk_speed;
        }
    }

    else{
        if(Math.abs(enemy.walk_speed) < 1){
            enemy.walk_speed = 0;
        }
        else{
            if(enemy.walk_speed > 0){
                enemy.walk_speed += enemy.walk_idle_deceleration;
            }
            else if(enemy.walk_speed < 0){
                enemy.walk_speed -= enemy.walk_idle_deceleration;
            }
        }
    }
    for(var i = 0; i < Math.abs(enemy.walk_speed) * frametime_coef; i++){
        enemy.x += enemy.right[0] * Math.sign(enemy.walk_speed);
        enemy.y += enemy.right[1] * Math.sign(enemy.walk_speed);
        if(enemy.walk_speed > 0){
            if(
                !is_solid(enemy.x + enemy.R1[0] + -3 * enemy.bottom[0], enemy.y + enemy.R1[1] + -3 * enemy.bottom[1])
                &&
                !is_solid(enemy.x + enemy.C1[0], enemy.y + enemy.C1[1])
                &&
                !is_solid(enemy.x + enemy.L1[0], enemy.y + enemy.L1[1])
                &&
                !is_solid(enemy.x + enemy.R2[0], enemy.y + enemy.R2[1])
                &&
                !is_solid(enemy.x + enemy.R3[0], enemy.y + enemy.R3[1])
            ){
                for(var j = 0; j < 4; j++){
                    if(is_solid(enemy.x + enemy.R4[0] + -j * enemy.bottom[0], enemy.y + enemy.R4[1] + -j * enemy.bottom[1])){
                        enemy.x += -enemy.bottom[0] * 4;
                        enemy.y += -enemy.bottom[1] * 4;
                        break;
                    }
                }
            }
            if(is_solid(enemy.x + enemy.R1[0], enemy.y + enemy.R1[1])
                ||
                is_solid(enemy.x + enemy.R2[0], enemy.y + enemy.R2[1])
                ||
                is_solid(enemy.x + enemy.R3[0], enemy.y + enemy.R3[1])
            ){
                enemy.walk_speed = 0;
                enemy.x -= enemy.right[0];
                enemy.y -= enemy.right[1];
                break;
            }
        }
        else if(enemy.walk_speed < 0){
            if(
                !is_solid(enemy.x + enemy.L1[0] + -3 * enemy.bottom[0], enemy.y + enemy.L1[1] + -3 * enemy.bottom[1])
                &&
                !is_solid(enemy.x + enemy.C1[0], enemy.y + enemy.C1[1])
                &&
                !is_solid(enemy.x + enemy.R1[0], enemy.y + enemy.R1[1])
                &&
                !is_solid(enemy.x + enemy.L2[0], enemy.y + enemy.L2[1])
                &&
                !is_solid(enemy.x + enemy.L3[0], enemy.y + enemy.L3[1])
            ){
                for(var j = 0; j < 4; j++){
                    if(is_solid(enemy.x + enemy.L4[0] + -j * enemy.bottom[0], enemy.y + enemy.L4[1] + -j * enemy.bottom[1])){
                        enemy.x += -enemy.bottom[0] * 4;
                        enemy.y += -enemy.bottom[1] * 4;
                        break;
                    }
                }
            }
            if(
                is_solid(enemy.x + enemy.L1[0], enemy.y + enemy.L1[1])
                ||
                is_solid(enemy.x + enemy.L2[0], enemy.y + enemy.L2[1])
                ||
                is_solid(enemy.x + enemy.L3[0], enemy.y + enemy.L3[1])
            ){
                enemy.walk_speed = 0;
                enemy.x -= -enemy.right[0];
                enemy.y -= -enemy.right[1];
                break;
            }
        }
    }
    enemy.fall_speed += enemy.gravity;

    if(enemy.fall_speed > enemy.max_fall_speed){
        enemy.fall_speed = enemy.max_fall_speed;
    }

    l1.value = enemy.fall_speed;

    mv: for(var i = 0; i < Math.abs(enemy.fall_speed) * frametime_coef; i++){
        enemy.x += enemy.bottom[0] * Math.sign(enemy.fall_speed);
        enemy.y += enemy.bottom[1] * Math.sign(enemy.fall_speed);

        if(enemy.fall_speed > 0){
            for(var j = 0; j < enemy_w; j++){
                if(is_solid(enemy.x + enemy.L4[0] + j * enemy.right[0], enemy.y + enemy.L4[1] + j * enemy.right[1])){
                    enemy.fall_speed = 0;
                    enemy.x -= enemy.bottom[0];
                    enemy.y -= enemy.bottom[1];
                    enemy.freefall = false;
                    break mv;
                }
            }
        }
        else if(
            (enemy.fall_speed < 0 &&
                (
                    is_solid(enemy.x + enemy.L1[0], enemy.y + enemy.L1[1])
                    ||
                    is_solid(enemy.x + enemy.C1[0], enemy.y + enemy.C1[1])
                    ||
                    is_solid(enemy.x + enemy.R1[0], enemy.y + enemy.R1[1])
                )
            )
        ){
            enemy.fall_speed = 0;
            enemy.x -= -enemy.bottom[0];
            enemy.y -= -enemy.bottom[1];
            break;
        }
    }
}

switchEnemySprite = (mob) => {
    mob.current_sprite = mob.current_sprite === mob.sprite ? mob.alternate_sprite : mob.sprite;
}

collision_enemy = function(mob){
    var hero_points = {
        r1:{ x: hero.x + hero.R1[0], y: hero.y + hero.R1[1]},
        r4:{ x: hero.x + hero.R4[0], y: hero.y + hero.R4[1]},
        l1:{ x: hero.x + hero.L1[0], y: hero.y + hero.L1[1]},
        l4:{ x: hero.x + hero.L4[0], y: hero.y + hero.L4[1]}
    };
    var mob_points = {
        r1:{ x: mob.x + mob.R1[0], y: mob.y + mob.R1[1]},
        r4:{ x: mob.x + mob.R4[0], y: mob.y + mob.R4[1]},
        l1:{ x: mob.x + mob.L1[0], y: mob.y + mob.L1[1]},
        l4:{ x: mob.x + mob.L4[0], y: mob.y + mob.L4[1]}
    };

    return collide(hero_points, mob_points);
}

attack_enemy = function(mob){
    var weapon_points = {
        r1:{ x: hero.x + 5, y: hero.y - 6},
        r4:{ x: hero.x + 5 + 16, y: hero.y -6},
        l1:{ x: hero.x + 5 + 16, y: hero.y + 16},
        l4:{ x: hero.x + 5, y: hero.y + 16}
    };
    var mob_points = {
        r1:{ x: mob.x + mob.R1[0], y: mob.y + mob.R1[1]},
        r4:{ x: mob.x + mob.R4[0], y: mob.y + mob.R4[1]},
        l1:{ x: mob.x + mob.L1[0], y: mob.y + mob.L1[1]},
        l4:{ x: mob.x + mob.L4[0], y: mob.y + mob.L4[1]}
    };

    return collide(weapon_points, mob_points);
}

collide = function(obj1, obj2){
    if(obj1.r1.x >= obj2.l1.x && obj1.r1.x <= obj2.r1.x
        && obj1.r1.y >= obj2.l1.y && obj1.r1.y <= obj2.l4.y){
        return true;
    }
    if(obj1.r4.x >= obj2.l1.x && obj1.r4.x <= obj2.r1.x
        && obj1.r4.y >= obj2.l1.y && obj1.r4.y <= obj2.l4.y){
        return true;
    }
    if(obj1.l1.x >= obj2.l1.x && obj1.l1.x <= obj2.r1.x
        && obj1.l1.y >= obj2.l1.y && obj1.l1.y <= obj2.l4.y){
        return true;
    }
    if(obj1.l4.x >= obj2.l1.x && obj1.l4.x <= obj2.r1.x
        && obj1.l4.y >= obj2.l1.y && obj1.l4.y <= obj2.l4.y){
        return true;
    }
    return false;
};

update_monster = function(mob) {
    if(mob.timer_hit > 0){
        mob.timer_hit = hero.timer_hit - 1;
    }
};

isMonsterTouched = function(monster){
    return monster.timer_hit > 0;
};

create_enemy = (enemy_x, enemy_y, type) => {
    var sprite = '';
    var alternate_sprite = '';
    var hp = 0;
    var gravity = 1;
    var max_walk_speed = 2;
    switch(type){
        case 'basic':
            sprite = monster;
            alternate_sprite = monster2;
            hp=1;
            max_walk_speed = 0.2;
            break;
        case 'flying':
            sprite = flying;
            alternate_sprite = flying2;
            hp=1;
            gravity= 0;
            break;
        case 'boss':
            sprite = boss;
            alternate_sprite = boss2;
            hp=5;
            break;
    }
    return {
        x: enemy_x,
        y: enemy_y,
        sprite: sprite,
        alternate_sprite: alternate_sprite,
        current_sprite: sprite,
        type: type,
        angle: 0,
        right: [],
        bottom: [],
        L1: [],
        C1: [],
        R1: [],
        L2: [],
        R2: [],
        L3: [],
        C3: [],
        R3: [],
        L4: [],
        R4: [],
        L5: [],
        R5: [],
        max_walk_speed: max_walk_speed,
        walk_acceleration: 0.2,
        walk_idle_deceleration: -1,
        jump_speed: -14,
        gravity: gravity,
        walk_speed: 0,
        fall_speed: 0,
        max_fall_speed: 6,
        hp: hp,
        current_hp: hp,
        freefall: type !== 'flying'
    };
}

enemies = [];
enemies[0] = [];
enemies[1] = [create_enemy(650,401,'basic')];
enemies[2] = [create_enemy(340,370,'basic'),create_enemy(650,201,'flying')];
enemies[3] = [create_enemy(340,370,'basic'),create_enemy(700,270,'basic'),create_enemy(650,201,'flying')];
enemies[4] = [create_enemy(402,370,'basic'),create_enemy(700,271,'basic'),create_enemy(600,201,'flying'),create_enemy(650,251,'flying')];
enemies[5] = [create_enemy(256,340,'basic'),create_enemy(462,370,'basic'),create_enemy(700,401,'basic')];
enemies[6] = [create_enemy(650,401,'boss')];
enemies[7] = [];

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

game = function(){

    time = +new Date();
    frametime = time - prev_time;
    prev_time = time;
    frametime_coef = frametime / normal_frametime;
    total_frames = total_frames +1;

    if(!end){
        move_hero();
    }
    canvas.width = canvas.width;

    ctx.fillStyle = "black";
    for(i in maps[current_map]){
        for(j in maps[current_map][i]){
            if(maps[current_map][i][j] != "0"){
                ctx.drawImage(tiles[maps[current_map][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
            }
        }
    }
    ctx.save();

    ctx.fillStyle = "red";
    ctx.fillRect(hero.x -20, hero.y -25, 40, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(hero.x -20, hero.y -25 ,hero.current_hp*8,5);

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
    enemies[current_map].forEach((mob) => {
        rotate_ennemies(mob, 0);
    total_frames % 10 ===0 && switchEnemySprite(mob);
    move_ennemies(mob);
    ctx.restore();
    if(isMonsterTouched(mob)){
        ctx.globalAlpha = 0.4;
    }
    ctx.drawImage(mob.current_sprite, mob.x-16, mob.y-16, 32, 32);
    ctx.fillStyle = "red";
    ctx.fillRect(mob.x -20, mob.y -25, 40, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(mob.x -20, mob.y -25 , mob.current_hp*40,5);

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

    texts[current_map].forEach((text) => {
        ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(text,canvas.width/2,(texts[current_map].indexOf(text)+1)* 50);
}, texts[current_map]);

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
        end=true;
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
    rotate_hero(0);
    game();
}

var hero_w = 22;
var hero_h = 28;

base_vectors = {
    "right": uright,
    "bottom": ubottom
};

vectors = {
    "L1": uL1,
    "C1": uC1,
    "R1": uR1,
    "L2": uL2,
    "R2": uR2,
    "L3": uL3,
    "C3": uC3,
    "R3": uR3,
    "L4": uL4,
    "R4": uR4,
    "L5": uL5,
    "R5": uR5,
};


var hero = {
    x: 50,
    y: 401,
    angle: 0,
    right: [],
    bottom: [],
    L1: [],
    C1: [],
    R1: [],
    L2: [],
    R2: [],
    L3: [],
    C3: [],
    R3: [],
    L4: [],
    R4: [],
    L5: [],
    R5: [],
    max_walk_speed: 3,
    walk_acceleration: 0.3,
    walk_idle_deceleration: -1,
    jump_speed: -14,
    gravity: 1,
    walk_speed: 0,
    fall_speed: 0,
    max_fall_speed: 6,
    hp: 10,
    current_hp: 10,
    damage: 1,
    timer_attack: 0,
    timer_hit: 0,
    freefall: true
};

var rotate_hero = function(angle_deg){
    hero.angle = angle_deg * Math.PI / 180;
    for(var i in base_vectors){
        hero[i] = [
            base_vectors[i][0] * Math.cos(hero.angle) - base_vectors[i][1] * Math.sin(hero.angle),
            base_vectors[i][0] * Math.sin(hero.angle) + base_vectors[i][1] * Math.cos(hero.angle)
        ];
    }
    for(var i in vectors){
        hero[i] = [
            vectors[i][0] * hero.right[0] + vectors[i][1] * hero.bottom[0],
            vectors[i][0] * hero.right[1] + vectors[i][1] * hero.bottom[1]
        ];
    }
}

var move_hero = function(){
    if(keys.left && !keys.right){
        hero.walk_speed -= hero.walk_acceleration;
        if(hero.walk_speed < -hero.max_walk_speed){
            hero.walk_speed = -hero.max_walk_speed;
        }
    }

    else if(keys.right && !keys.left){
        hero.walk_speed += hero.walk_acceleration;
        if(hero.walk_speed > hero.max_walk_speed){
            hero.walk_speed = hero.max_walk_speed;
        }
    }
    else{

        if(Math.abs(hero.walk_speed) < 1){
            hero.walk_speed = 0;
        }
        else{
            if(hero.walk_speed > 0){
                hero.walk_speed += hero.walk_idle_deceleration;
            }
            else if(hero.walk_speed < 0){
                hero.walk_speed -= hero.walk_idle_deceleration;
            }
        }
    }
    for(var i = 0; i < Math.abs(hero.walk_speed) * frametime_coef; i++){
        hero.x += hero.right[0] * Math.sign(hero.walk_speed);
        hero.y += hero.right[1] * Math.sign(hero.walk_speed);
        if(hero.walk_speed > 0){
            if(
                !is_solid(hero.x + hero.R1[0] + -3 * hero.bottom[0], hero.y + hero.R1[1] + -3 * hero.bottom[1])
                &&
                !is_solid(hero.x + hero.C1[0], hero.y + hero.C1[1])
                &&
                !is_solid(hero.x + hero.L1[0], hero.y + hero.L1[1])
                &&
                !is_solid(hero.x + hero.R2[0], hero.y + hero.R2[1])
                &&
                !is_solid(hero.x + hero.R3[0], hero.y + hero.R3[1])
            ){
                for(var j = 0; j < 4; j++){
                    if(is_solid(hero.x + hero.R4[0] + -j * hero.bottom[0], hero.y + hero.R4[1] + -j * hero.bottom[1])){
                        hero.x += -hero.bottom[0] * 4;
                        hero.y += -hero.bottom[1] * 4;
                        break;
                    }
                }
            }
            if(is_solid(hero.x + hero.R1[0], hero.y + hero.R1[1])
                ||
                is_solid(hero.x + hero.R2[0], hero.y + hero.R2[1])
                ||
                is_solid(hero.x + hero.R3[0], hero.y + hero.R3[1])
            ){
                hero.walk_speed = 0;
                hero.x -= hero.right[0];
                hero.y -= hero.right[1];
                break;
            }
        }
        else if(hero.walk_speed < 0){
            if(
                !is_solid(hero.x + hero.L1[0] + -3 * hero.bottom[0], hero.y + hero.L1[1] + -3 * hero.bottom[1])
                &&
                !is_solid(hero.x + hero.C1[0], hero.y + hero.C1[1])
                &&
                !is_solid(hero.x + hero.R1[0], hero.y + hero.R1[1])
                &&
                !is_solid(hero.x + hero.L2[0], hero.y + hero.L2[1])
                &&
                !is_solid(hero.x + hero.L3[0], hero.y + hero.L3[1])
            ){
                for(var j = 0; j < 4; j++){
                    if(is_solid(hero.x + hero.L4[0] + -j * hero.bottom[0], hero.y + hero.L4[1] + -j * hero.bottom[1])){
                        hero.x += -hero.bottom[0] * 4;
                        hero.y += -hero.bottom[1] * 4;
                        break;
                    }
                }
            }
            if(
                is_solid(hero.x + hero.L1[0], hero.y + hero.L1[1])
                ||
                is_solid(hero.x + hero.L2[0], hero.y + hero.L2[1])
                ||
                is_solid(hero.x + hero.L3[0], hero.y + hero.L3[1])
            ){
                hero.walk_speed = 0;
                hero.x -= -hero.right[0];
                hero.y -= -hero.right[1];
                break;
            }
        }
    }
    if(keys.up && !hero.freefall){
        hero.freefall = true;
        hero.fall_speed += hero.jump_speed;
    }
    hero.fall_speed += hero.gravity;

    if(hero.fall_speed > hero.max_fall_speed){
        hero.fall_speed = hero.max_fall_speed;
    }

    l1.value = hero.fall_speed;
    mv: for(var i = 0; i < Math.abs(hero.fall_speed) * frametime_coef; i++){
        hero.x += hero.bottom[0] * Math.sign(hero.fall_speed);
        hero.y += hero.bottom[1] * Math.sign(hero.fall_speed);

        if(hero.fall_speed > 0){
            for(var j = 0; j < hero_w; j++){
                if(is_solid(hero.x + hero.L4[0] + j * hero.right[0], hero.y + hero.L4[1] + j * hero.right[1])){
                    hero.fall_speed = 0;
                    hero.x -= hero.bottom[0];
                    hero.y -= hero.bottom[1];
                    hero.freefall = false;
                    break mv;
                }
            }
        }
        else if(
            (hero.fall_speed < 0 &&
                (
                    is_solid(hero.x + hero.L1[0], hero.y + hero.L1[1])
                    ||
                    is_solid(hero.x + hero.C1[0], hero.y + hero.C1[1])
                    ||
                    is_solid(hero.x + hero.R1[0], hero.y + hero.R1[1])
                )
            )
        ){
            hero.fall_speed = 0;
            hero.x -= -hero.bottom[0];
            hero.y -= -hero.bottom[1];
            break;
        }
    }
}

isHeroTouched = function(){
    return hero.timer_hit > 0;
};

update_hero = function() {
    if(hero.timer_hit > 0){
        hero.timer_hit = hero.timer_hit - 1;
    }
    if(keys.attack === true){
        hero.timer_attack = hero.timer_attack + 1;
    }
};

keys = {
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

maps = [];
maps[0] = [
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "1111111111111111111111111",
];
maps[1] = [
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000011111000000000000000",
    "1111111111111111111111111",
];
maps[2] = [
    "0000444444444444444444444",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "1111100000000000000000000",
    "2222222000000000000000000",
    "2222222222000000000000000",
    "2222222222220000000000000",
    "2222222222222222222222222",
];
maps[3] = [
    "4444444444444444444440000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000011111",
    "0000000000000000002222222",
    "0000000000000002222222222",
    "0000000000000222222222222",
    "2222222222222222222222222",
];
maps[4] = [
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000033333",
    "0000000000000000003333333",
    "0000000000000003333333333",
    "0000000033333333333333333",
    "1111111333333333333333333",
];
maps[5] = [
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "3333300000000000000000000",
    "3333333000000000000000000",
    "3333333333000000000000000",
    "3333333333333333300000000",
    "3333333333333333331111111",
];
maps[6] = [
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "1111111111111111111111111",
];
maps[7] = [
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "0000000000000000000000000",
    "1111111111111111111111111",
];
current_map = 0;

change_step = (isForward) => {
    switch(current_map){
        case 0 :
            if(isForward) {
                current_map = current_map + 1;
                hero.x = 73;
                hero.y = 401;
                move_hero();
            }
            break;
        case 1 :
            current_map = isForward ? current_map + 1 : current_map - 1;
            hero.x = isForward ? 73 : 680;
            hero.y = isForward ? 273 : 401;
            move_hero();
            break;
        case 2 :
            current_map = isForward ? current_map + 1 : current_map - 1;
            hero.x = isForward ? 73 : 680;
            hero.y = isForward ? 401 : 401;
            move_hero();
            break;
        case 3 :
            current_map = isForward ? current_map + 1 : current_map - 1;
            hero.x = isForward ? 73 : 680;
            hero.y = isForward ? 401 : 401;
            move_hero();
            break;
        case 4 :
            current_map = isForward ? current_map + 1 : current_map - 1;
            hero.x = isForward ? 73 : 680;
            hero.y = isForward ? 273 : 273;
            move_hero();
            break;
        case 5 :
            current_map = isForward ? current_map + 1 : current_map - 1;
            hero.x = isForward ? 73 : 680;
            hero.y = isForward ? 401 : 273;
            move_hero();
            break;
        case 6 :
            current_map = isForward ? current_map + 1 : current_map - 1;
            hero.x = isForward ? 73 : 680;
            hero.y = isForward ? 401 : 401;
            move_hero();
            end=true;
            break;
        case 7 :
            break;
    }
};

texts = [];
texts[0] = ["The source of Internet has been stolen ! Everyone is offline !","You have to fix that! Take your keyboard and go !","(use arrows to move, and space to attack)"];
texts[1] = [];
texts[2] = [];
texts[3] = [];
texts[4] = [];
texts[5] = [];
texts[6] = [];
texts[7] = ["You have freed the source of Internet: the nyancat !", "Thanks for playing :)"];

tile_w = 32;
tile_h = 32;
tiles = {
    "0": {
        sprite: void_sprite,
        solid: 0
    },
    "1": {
        sprite: ground_tile1,
        solid: 1
    },
    "2": {
        sprite: ground_tile2,
        solid: 1
    },
    "3": {
        sprite: ground_tile3,
        solid: 1
    },
    "4": {
        sprite: ceiling_tile,
        solid: 1
    },
};

is_solid = function(x,y){
    var tile_y = Math.floor(y / tile_h);
    if(!maps[current_map][tile_y]){
        return false;
    }
    var tile_x = Math.floor(x / tile_w);
    if(!maps[current_map][tile_y][tile_x]){
        return false;
    }
    if(tiles[maps[current_map][tile_y][tile_x]].solid === 0){
        return false;
    }
    if(tiles[maps[current_map][tile_y][tile_x]].solid === 1){
        return true;
    }
};