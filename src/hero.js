var hero_w = 22;
var hero_h = 28;

var uright = [1,0];
var ubottom = [0,1];

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

base_vectors = {
    'right': uright,
    'bottom': ubottom
}

vectors = {
    'L1': uL1,
    'C1': uC1,
    'R1': uR1,
    'L2': uL2,
    'R2': uR2,
    'L3': uL3,
    'C3': uC3,
    'R3': uR3,
    'L4': uL4,
    'R4': uR4,
    'L5': uL5,
    'R5': uR5,
};
// Functions
var rotate_hero = function(angle_deg){

    // Convert in radians
    this.angle = angle_deg * Math.PI / 180;

    // Rotate base vectors
    for(var i in base_vectors){
        this[i] = [
            base_vectors[i][0] * Math.cos(this.angle) - base_vectors[i][1] * Math.sin(this.angle),
            base_vectors[i][0] * Math.sin(this.angle) + base_vectors[i][1] * Math.cos(this.angle)
        ];
    }

    // Rotate real vectors
    for(var i in vectors){
        this[i] = [
            vectors[i][0] * this.right[0] + vectors[i][1] * this.bottom[0],
            vectors[i][0] * this.right[1] + vectors[i][1] * this.bottom[1]
        ];
    }
};

// Hero moves (left / right / jump / fall)
var move_hero = function(keys, frametime_coef){
    // Walk left:
    if(keys.left && !keys.right){

        // Apply a negative walk acceleration to the hero's speed
        this.walk_speed -= this.walk_acceleration;

        // Limit the this's speed
        if(this.walk_speed < -this.max_walk_speed){
            this.walk_speed = -this.max_walk_speed;
        }
    }

    // Walk right:
    else if(keys.right && !keys.left){

        // Apply a negative walk acceleration to the this's speed
        this.walk_speed += this.walk_acceleration;

        // Limit the this's speed
        if(this.walk_speed > this.max_walk_speed){
            this.walk_speed = this.max_walk_speed;
        }
    }

    // Idle:

    else{

        if(Math.abs(this.walk_speed) < 1){
            this.walk_speed = 0;
        }

        else{

            // If the this stops walking, decelerate
            if(this.walk_speed > 0){
                this.walk_speed += this.walk_idle_deceleration;
            }
            else if(this.walk_speed < 0){
                this.walk_speed -= this.walk_idle_deceleration;
            }
        }
    }

    // Move horizontally
    for(var i = 0; i < Math.abs(this.walk_speed) * frametime_coef; i++){
        this.x += this.right[0] * Math.sign(this.walk_speed);
        this.y += this.right[1] * Math.sign(this.walk_speed);

        // Detect collision on the right (R1,R2,R3)
        if(this.walk_speed > 0){

            // Climb a slope on the right (one solid between R4 and R3, but R1 + 3 'up', C1, L1, R2 and R3 not solid)
            if(
                !is_solid(this.x + this.R1[0] + -3 * this.bottom[0], this.y + this.R1[1] + -3 * this.bottom[1])
                &&
                !is_solid(this.x + this.C1[0], this.y + this.C1[1])
                &&
                !is_solid(this.x + this.L1[0], this.y + this.L1[1])
                &&
                !is_solid(this.x + this.R2[0], this.y + this.R2[1])
                &&
                !is_solid(this.x + this.R3[0], this.y + this.R3[1])
            ){
                for(var j = 0; j < 4; j++){
                    if(is_solid(this.x + this.R4[0] + -j * this.bottom[0], this.y + this.R4[1] + -j * this.bottom[1])){
                        this.x += -this.bottom[0] * 4;
                        this.y += -this.bottom[1] * 4;
                        break;
                    }
                }
            }

            // Slide if the slope is too strong on the right
            // TODO

            // Collision
            if(is_solid(this.x + this.R1[0], this.y + this.R1[1])
                ||
                is_solid(this.x + this.R2[0], this.y + this.R2[1])
                ||
                is_solid(this.x + this.R3[0], this.y + this.R3[1])
            ){
                this.walk_speed = 0;
                this.x -= this.right[0];
                this.y -= this.right[1];
                break;
            }
        }

        // Detect collision on the left (L1,L2,L3)
        else if(this.walk_speed < 0){

            // Climb a slope on the left (one solid between L4 and L3, but L1 + 3 'up', C1, R1, L2 and L3 not solid)
            if(
                !is_solid(this.x + this.L1[0] + -3 * this.bottom[0], this.y + this.L1[1] + -3 * this.bottom[1])
                &&
                !is_solid(this.x + this.C1[0], this.y + this.C1[1])
                &&
                !is_solid(this.x + this.R1[0], this.y + this.R1[1])
                &&
                !is_solid(this.x + this.L2[0], this.y + this.L2[1])
                &&
                !is_solid(this.x + this.L3[0], this.y + this.L3[1])
            ){
                for(var j = 0; j < 4; j++){
                    if(is_solid(this.x + this.L4[0] + -j * this.bottom[0], this.y + this.L4[1] + -j * this.bottom[1])){
                        this.x += -this.bottom[0] * 4;
                        this.y += -this.bottom[1] * 4;
                        break;
                    }
                }
            }

            // Slide if the slope is too strong on the left
            // TODO

            // Collision
            if(
                is_solid(this.x + this.L1[0], this.y + this.L1[1])
                ||
                is_solid(this.x + this.L2[0], this.y + this.L2[1])
                ||
                is_solid(this.x + this.L3[0], this.y + this.L3[1])
            ){
                this.walk_speed = 0;
                this.x -= -this.right[0];
                this.y -= -this.right[1];
                break;
            }
        }
    }


    // Jump:
    if(keys.up && !this.freefall){
        this.freefall = true;
        this.fall_speed += this.jump_speed;
    }

    // Freefall:
    this.fall_speed += this.gravity;

    if(this.fall_speed > this.max_fall_speed){
        this.fall_speed = this.max_fall_speed;
    }

    // Move vertically
    mv: for(var i = 0; i < Math.abs(this.fall_speed) * frametime_coef; i++){
        this.x += this.bottom[0] * Math.sign(this.fall_speed);
        this.y += this.bottom[1] * Math.sign(this.fall_speed);

        // Detect collision on the bottom (L4,C3,R4)
        if(this.fall_speed > 0){
            for(var j = 0; j < hero_w; j++){
                if(is_solid(this.x + this.L4[0] + j * this.right[0], this.y + this.L4[1] + j * this.right[1])){
                    this.fall_speed = 0;
                    this.x -= this.bottom[0];
                    this.y -= this.bottom[1];
                    this.freefall = false;
                    break mv;
                }
            }
        }

        // Detect collision on the top (L1,C1,R1)
        else if(
            (this.fall_speed < 0 &&
                (
                    is_solid(this.x + this.L1[0], this.y + this.L1[1])
                    ||
                    is_solid(this.x + this.C1[0], this.y + this.C1[1])
                    ||
                    is_solid(this.x + this.R1[0], this.y + this.R1[1])
                )
            )
        ){
            this.fall_speed = 0;
            this.x -= -this.bottom[0];
            this.y -= -this.bottom[1];
            break;
        }
    }
}

var is_hero_touched = function(){
    return this.timer_hit > 0;
};

var update_hero = function(keys) {
    if(this.timer_hit > 0){
        this.timer_hit = this.timer_hit - 1;
    }
    if(keys.attack === true){
        this.timer_attack = this.timer_attack + 1;
    }
};

module.exports = {
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
        freefall: true,
        rotate: rotate_hero,
        move: move_hero,
        isTouched: is_hero_touched,
        update: update_hero
};