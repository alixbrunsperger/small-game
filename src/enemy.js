
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
}

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

// Functions
var rotate_enemies = function(enemy, angle_deg){

    // Convert in radians
    enemy.angle = angle_deg * Math.PI / 180;

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
        // Apply a negative walk acceleration to the enemy's speed
        enemy.walk_speed -= enemy.walk_acceleration;

        // Limit the enemy's speed
        if(enemy.walk_speed < -enemy.max_walk_speed){
            enemy.walk_speed = -enemy.max_walk_speed;
        }
    }

    // Walk right:
    else if(enemy.x < hero.x){
        // Apply a negative walk acceleration to the enemy's speed
        enemy.walk_speed += enemy.walk_acceleration;

        // Limit the enemy's speed
        if(enemy.walk_speed > enemy.max_walk_speed){
            enemy.walk_speed = enemy.max_walk_speed;
        }
    }

    // Idle:

    else{
        if(Math.abs(enemy.walk_speed) < 1){
            enemy.walk_speed = 0;
        }

        else{

            // If the enemy stops walking, decelerate
            if(enemy.walk_speed > 0){
                enemy.walk_speed += enemy.walk_idle_deceleration;
            }
            else if(enemy.walk_speed < 0){
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

            // Climb a slope on the right (one solid between R4 and R3, but R1 + 3 "up", C1, L1, R2 and R3 not solid)
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
        }

        // Detect collision on the left (L1,L2,L3)
        else if(enemy.walk_speed < 0){

            // Climb a slope on the left (one solid between L4 and L3, but L1 + 3 "up", C1, R1, L2 and L3 not solid)
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

        // Detect collision on the top (L1,C1,R1)
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

create_enemy = function(enemy_x, enemy_y, type) {
    var sprite = '';
    var alternate_sprite = '';
    var hp = 0;
    var gravity = 1;
    var max_walk_speed = 2;
    var width = 32;
    var height=32;
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
            hp=2;
            max_walk_speed = 0.1;
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
        width: width,
        height: height,
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
};

enemies = [];
enemies[0] = [];
enemies[1] = [create_enemy(650,401,'basic')];
enemies[2] = [create_enemy(340,370,'basic'),create_enemy(650,201,'flying')];
enemies[3] = [create_enemy(340,370,'basic'),create_enemy(700,270,'basic'),create_enemy(650,201,'flying')];
enemies[4] = [create_enemy(402,370,'basic'),create_enemy(700,271,'basic'),create_enemy(600,201,'flying'),create_enemy(650,251,'flying')];
enemies[5] = [create_enemy(256,340,'basic'),create_enemy(462,370,'basic'),create_enemy(700,401,'basic')];
enemies[6] = [create_enemy(340,370,'basic'),create_enemy(650,201,'flying')];
enemies[7] = [create_enemy(340,370,'basic'),create_enemy(650,201,'flying')];
enemies[8] = [create_enemy(340,370,'basic'),create_enemy(650,201,'flying')];
enemies[9] = [create_enemy(650,401,'boss')];
enemies[10] = [];

module.exports= {
    enemies: enemies,
    isMonsterTouched: isMonsterTouched,
    update_monster: update_monster,
    switchEnemySprite: switchEnemySprite,
    collision_enemy: collision_enemy,
    attack_enemy: attack_enemy,
    rotate_enemies:rotate_enemies,
    move_enemies: move_enemies,
    update_monster: update_monster
};