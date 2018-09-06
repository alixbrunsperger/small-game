var base_vectors = {
    'right': [1,0],
    'bottom': [0,1]
}

var vectors = {};

// Functions
var rotate_enemies = function(enemy, angle_deg){

    // Convert in radians
    enemy.angle = angle_deg * Math.PI / 180;

    vectors = {
        'L1': [-(enemy.width/2), -(enemy.height/2)],
        'C1': [0, -(enemy.height/2)],
        'R1': [(enemy.width/2), -(enemy.height/2)],
        'L2': [-(enemy.width/2), 0],
        'R2': [(enemy.width/2), 0],
        'L3': [-(enemy.width/2), (enemy.height/4)],
        'C3': [0, (enemy.height/2)],
        'R3': [(enemy.width/2), (enemy.height/4)],
        'L4': [-(enemy.width/2), (enemy.height/2)],
        'R4': [(enemy.width/2), (enemy.height/2)],
        'L5': [-(enemy.width/4), (enemy.height/2)],
        'R5': [(enemy.width/4), (enemy.height/2)],
    }

    // Rotate base vectors
    for(var i in base_vectors){
        enemy[i] = [
            base_vectors[i][0] * Math.cos(enemy.angle) - base_vectors[i][1] * Math.sin(enemy.angle),
            base_vectors[i][0] * Math.sin(enemy.angle) + base_vectors[i][1] * Math.cos(enemy.angle)
        ];
    }

    // Rotate real vectors
    for(var i in vectors){
        enemy[i] = [
            vectors[i][0] * enemy.right[0] + vectors[i][1] * enemy.bottom[0],
            vectors[i][0] * enemy.right[1] + vectors[i][1] * enemy.bottom[1]
        ];
    }
}

// Hero moves (left / right / jump / fall)
var move_enemies = function(enemy, hero, frametime_coef){

    // Walk left:
    if(enemy.x > hero.x){
        enemy.isWalkingLeft = true;
        // Apply a negative walk acceleration to the enemy's speed
        enemy.walk_speed -= enemy.walk_acceleration;

        // Limit the enemy's speed
        if(enemy.walk_speed < -enemy.max_walk_speed){
            enemy.walk_speed = -enemy.max_walk_speed;
        }
    } else if(enemy.x < hero.x){
        enemy.isWalkingLeft = false;
        // Apply a negative walk acceleration to the enemy's speed
        enemy.walk_speed += enemy.walk_acceleration;

        // Limit the enemy's speed
        if(enemy.walk_speed > enemy.max_walk_speed){
            enemy.walk_speed = enemy.max_walk_speed;
        }
    } else {
        if(Math.abs(enemy.walk_speed) < 1){
            enemy.walk_speed = 0;
        } else {

            // If the enemy stops walking, decelerate
            if(enemy.walk_speed > 0){
                enemy.walk_speed += enemy.walk_idle_deceleration;
            } else if(enemy.walk_speed < 0){
                enemy.walk_speed -= enemy.walk_idle_deceleration;
            }
        }
    }

    // Move horizontally
    for(var i = 0; i < Math.abs(enemy.walk_speed) * frametime_coef; i++){
        enemy.x += enemy.right[0] * Math.sign(enemy.walk_speed);
        enemy.y += enemy.right[1] * Math.sign(enemy.walk_speed);

        // Detect collision on the right (R1,R2,R3)
        if(enemy.walk_speed > 0){
            // Climb a slope on the right (one solid between R4 and R3, but R1 + 3 'up', C1, L1, R2 and R3 not solid)
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

            // Slide if the slope is too strong on the right
            // TODO

            // Collision
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
        } else if(enemy.walk_speed < 0){

            // Climb a slope on the left (one solid between L4 and L3, but L1 + 3 'up', C1, R1, L2 and L3 not solid)
            if(!is_solid(enemy.x + enemy.L1[0] + -3 * enemy.bottom[0], enemy.y + enemy.L1[1] + -3 * enemy.bottom[1])
                &&
                !is_solid(enemy.x + enemy.C1[0], enemy.y + enemy.C1[1])
                &&
                !is_solid(enemy.x + enemy.R1[0], enemy.y + enemy.R1[1])
                &&
                !is_solid(enemy.x + enemy.L2[0], enemy.y + enemy.L2[1])
                &&
                !is_solid(enemy.x + enemy.L3[0], enemy.y + enemy.L3[1])){
                for(var j = 0; j < 4; j++){
                    if(is_solid(enemy.x + enemy.L4[0] + -j * enemy.bottom[0], enemy.y + enemy.L4[1] + -j * enemy.bottom[1])){
                        enemy.x += -enemy.bottom[0] * 4;
                        enemy.y += -enemy.bottom[1] * 4;
                        break;
                    }
                }
            }

            // Slide if the slope is too strong on the left
            // TODO

            // Collision
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

    // Freefall:
    enemy.fall_speed += enemy.gravity;

    if(enemy.fall_speed > enemy.max_fall_speed){
        enemy.fall_speed = enemy.max_fall_speed;
    }

    // Move vertically
    mv: for(var i = 0; i < Math.abs(enemy.fall_speed) * frametime_coef; i++){
        enemy.x += enemy.bottom[0] * Math.sign(enemy.fall_speed);
        enemy.y += enemy.bottom[1] * Math.sign(enemy.fall_speed);

        // Detect collision on the bottom (L4,C3,R4)
        if(enemy.fall_speed > 0){
            for(var j = 0; j < enemy.width; j++){
                if(is_solid(enemy.x + enemy.L4[0] + j * enemy.right[0], enemy.y + enemy.L4[1] + j * enemy.right[1])){
                    enemy.fall_speed = 0;
                    enemy.x -= enemy.bottom[0];
                    enemy.y -= enemy.bottom[1];
                    enemy.freefall = false;
                    break mv;
                }
            }
        } else if(
            (enemy.fall_speed < 0 &&
                (is_solid(enemy.x + enemy.L1[0], enemy.y + enemy.L1[1])
                    ||
                    is_solid(enemy.x + enemy.C1[0], enemy.y + enemy.C1[1])
                    ||
                    is_solid(enemy.x + enemy.R1[0], enemy.y + enemy.R1[1]))
            )
        ){
            enemy.fall_speed = 0;
            enemy.x -= -enemy.bottom[0];
            enemy.y -= -enemy.bottom[1];
            break;
        }
    }
}

switchEnemySprite = function(mob) {
    mob.current_sprite = mob.current_sprite === mob.sprite ? mob.alternate_sprite : mob.sprite;
};

collision_enemy = function(mob, hero){
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

attack_enemy = function(mob, hero){
    var weapon_points = {
        r1:{ x: hero.x + 5, y: hero.y - 6},
        r4:{ x: hero.x + 5 + 20, y: hero.y -6},
        l1:{ x: hero.x + 5 + 20, y: hero.y + 16},
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
        mob.timer_hit = mob.timer_hit - 1;
    }
};

isMonsterTouched = function(monster){
    return monster.timer_hit > 0;
};

create_enemy = function(enemy_x, enemy_y, type, width, height) {
    var sprite = '';
    var alternate_sprite = '';
    var hp = 0;
    var gravity = 1;
    var max_walk_speed = Math.floor(Math.random() * 3 + 2);
    var walk_speed = Math.floor(Math.random() * 4 +1) / 10;
    var baseWidth = width ? width : 32;
    var baseHeight = height ? height : 32;
    switch(type){
        case 'basic':
            sprite = monster;
            alternate_sprite = monster2;
            hp=1;
            break;
        case 'flying':
            sprite = flying;
            alternate_sprite = flying2;
            hp=1;
            gravity= 0;
            max_walk_speed = max_walk_speed/2;
            walk_speed = walk_speed/2;
            break;
        case 'boss':
            sprite = boss;
            alternate_sprite = boss2;
            hp=3;
            max_walk_speed = 2;
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
        width: baseWidth,
        height: baseHeight,
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
        isWalkingLeft: false,
        max_walk_speed: max_walk_speed,
        walk_acceleration: walk_speed,
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
};

initEnemies= function(findY){
    var enemies = [];

    for(var i = 0; i < 11 ; i++){
        switch(i){
            case 0 :
            case 10 :
                enemies[i] = [];
                break;
            case 1 :
                enemies[i] = [create_enemy(650,321,'basic')];
                break;
            case 9 :
                enemies[i] = [create_enemy(650,321,'boss', 64, 64)];
                break;
            default :
                enemies[i] = generateEnemies(i, findY);
                break;
        }
    }

    return enemies;
};

generateEnemies = function(mapNumber, findY){
    var number = Math.floor((Math.random() * 4)+1);
    var enemy_type = '';
    var x = 0;
    var y = 0;
    var enemies =[];
    var width = 32;
    var height = 32;

    for(var i = 0 ; i<number; i++){
         enemy_type = Math.floor(Math.random() * 2) ? 'basic' : 'flying';
         x = Math.floor((Math.random() * 301)+350);
         y = findY(x, mapNumber, height);
         y = enemy_type === 'flying' ? y - Math.floor((Math.random() * 101)) : y;

        enemies.push(create_enemy(x,y,enemy_type,width,height));
    }

    return enemies;
};

module.exports= {
    initEnemies: initEnemies,
    isMonsterTouched: isMonsterTouched,
    update_monster: update_monster,
    switchEnemySprite: switchEnemySprite,
    collision_enemy: collision_enemy,
    attack_enemy: attack_enemy,
    rotate_enemies:rotate_enemies,
    move_enemies: move_enemies,
    update_monster: update_monster
};