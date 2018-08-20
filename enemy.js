/* Hero */

/*
* The enemy is drawn as a 32 x 32 sprite, its hitbox is 22 x 28.
* Its center point is at the center of its hitbox (x = 11; y = 14)
* A few other points are placed around the hitbox to simplify the collision tests:
* L1, C1, R1 (x = 0 / 11 / 21; y = 0)
* L2, C2, R2 (x = 0 / 11 / 21; y = 14)
* L3, R3 (x = 0 / 21; y = 20)
* L4, L5, C3, R5, R4 (x = 0 / 4 / 11 / 16 / 21; y = 24)
* 
*               C1
* L1 *-----------*-----------* R1
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |           C2          |
* L2 *            *          * R2
*    |   (enemy.x; enemy.y)  |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
*    |                       |
* L3 *                       * R3
*    |                       |
*    |                       |
*    |                       |
*    |                       |
* L4 *---*-------*-------*---* R4
*       L5      C3       R5
*
*/

// Constants
var enemy_w = 22;
var enemy_h = 28;

// Base vectors (Right and Bottom vectors of length 1)
// These two vectors get rotated according to the enemy's angle
// then all the other vectors are deduced from them 
var uright = [1,0];
var ubottom = [0,1];

// Working vectors
// These vectors are not used as-is but rotated according to the enemy's angle and stored in the enemy's properties
var uL1 = [-11, -14];
var uC1 = [0, -14];
var uR1 = [11, -14];
var uL2 = [-11, 0];
var uR2 = [11, 0];
var uL3 = [-11, 8];
var uC3 = [0, 14];
var uR3 = [11, 8];
var uL4 = [-11, 14];
var uR4 = [11, 14];
var uL5 = [-7, 14];
var uR5 = [7, 14];


// The names of the base vectors to rotate using maths, and their const equivalent
base_vectors = {
    "right": uright,
    "bottom": ubottom
}

// The names of the important vectors to rotate using the base vectors, and their const equivalent
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
var rotate_ennemies = function(enemy, angle_deg){

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
var move_ennemies = function(enemy){

    // Walk left:
    if(enemy.x > hero.x && false){
        console.log('enemy walk left');
        // Apply a negative walk acceleration to the ennemy's speed
        enemy.walk_speed -= enemy.walk_acceleration;

        // Limit the enemy's speed
        if(enemy.walk_speed < -enemy.max_walk_speed){
            enemy.walk_speed = -enemy.max_walk_speed;
        }
    }

    // Walk right:
    else if(enemy.x < hero.x && false){
        console.log('enemy walk right');
        // Apply a negative walk acceleration to the enemy's speed
        enemy.walk_speed += enemy.walk_acceleration;

        // Limit the enemy's speed
        if(enemy.walk_speed > enemy.max_walk_speed){
            enemy.walk_speed = enemy.max_walk_speed;
        }
    }

    // Idle:

    else{
        console.log('enemy idle');
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
        console.log('move h', enemy.x, enemy.y, enemy.walk_speed, enemy.right[0], enemy.right[1]);
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


    // Jump:
    if(keys.up && !enemy.freefall){
        enemy.freefall = true;
        enemy.fall_speed += enemy.jump_speed;
    }

    // Freefall:
    enemy.fall_speed += enemy.gravity;

    if(enemy.fall_speed > enemy.max_fall_speed){
        enemy.fall_speed = enemy.max_fall_speed;
    }

    l1.value = enemy.fall_speed;

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

switchEnemySprite = (mob) => {
    mob.current_sprite = mob.current_sprite === mob.sprite ? mob.alternate_sprite : mob.sprite;
}

create_enemy = (enemy_x, enemy_y, type) => {
    let sprite = '';
    let alternate_sprite = '';
    switch(type){
        case 'basic':
            break
        case 'flying':
            sprite = bat;
            alternate_sprite = bat2;
            break
        case 'tank':
            sprite = tank;
            alternate_sprite = tank;
            break
        case 'boss':
            sprite = boss;
            alternate_sprite = boss;
            break
    }
    return {
        x: enemy_x, // x position of C2
        y: enemy_y, // y position of C2
        sprite: sprite,
        alternate_sprite: alternate_sprite,
        current_sprite: sprite,
        type: type,
        angle: 0, // angle in radians (0: head on top)
        // Vectors (rotated with the ennemy)
        right: [], // Normalized vector to the "right" (relative to the ennemy)
        bottom: [], // and "bottom"
        L1: [], // Position of L1 from center (C2)
        C1: [], // etc
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
        // Speeds and accelerations:
        // Constant
        max_walk_speed: 2,
        walk_acceleration: 0.2,
        walk_idle_deceleration: -1,
        jump_speed: -14,
        gravity: 0,
        // Variable
        walk_speed: 0,
        fall_speed: 0,
        max_fall_speed: 6,
        // State
        freefall: type !== 'flying' // freefall
    };
}

enemies = [];
enemies[0] = [];
enemies[1] = [create_enemy(200,200,'flying')];
//enemies[1] = [create_enemy(200,-200,'flying'), create_enemy(100,-250,'flying'), create_enemy(150,-150,'flying'), create_enemy(50,-300,'flying')];
enemies[2] = [];
enemies[3] = [];
enemies[4] = [];
enemies[5] = [];
enemies[6] = [create_enemy(200,200,'boss')];
enemies[7] = [];