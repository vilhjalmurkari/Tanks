// ====
// WALL
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//Easy to switch levels in generateWalls in entityManager
//some developbent levels kept in, called wall...
//levels used in game are called levels...
//hard coded 20x20 array where number represents
//what type of wall it, like an id

var g_brickwall = {

    wall:[
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,4,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,3,3,4,3,0,0,3,5,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,4,3,3,3,0,0,3,3,3,5,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,5,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,5,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,9,9,9,9,9,0,0,9,9,9,9,9,9,9,9,9,3],
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
    ],
    //using 9 to represent a random wall
    levelRandom:[
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,0,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,0,9],
        [9,0,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,0,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,4,4,4,4,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,6,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,6,9,9,9,0,0,0,0,9,9,9,9,9,6,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,4,4,4,4,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,6,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,9,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,9,9],
        [9,0,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,0,9],
        [9,0,0,9,9,9,9,0,0,0,0,9,9,9,9,9,9,0,0,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
    ],

    level1:[
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
        [4,0,0,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,0,4],
        [4,0,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,0,0,4],
        [4,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,4],
        [4,9,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,9,0,4],
        [4,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,4],
        [4,9,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,9,0,4],
        [4,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,4],
        [0,9,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,9,0,0],
        [0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0],
        [0,9,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,9,0,0],
        [4,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,4],
        [4,9,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,9,0,4],
        [4,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,4],
        [4,9,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,9,0,4],
        [4,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,4],
        [4,9,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,9,0,4],
        [4,0,0,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,0,4],
        [4,0,0,9,0,9,0,9,0,0,0,9,0,9,0,9,0,0,0,4],
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
    ],

    wall4:[
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
        [4,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,4],
        [4,0,4,0,4,4,4,4,4,4,0,0,0,0,0,0,3,3,0,4],
        [4,0,4,0,0,0,0,0,0,0,4,4,4,4,0,0,3,3,0,4],
        [4,0,4,0,4,4,4,4,4,0,0,0,0,4,0,0,0,0,0,4],
        [4,0,4,0,4,0,0,0,0,0,4,4,0,4,0,0,3,3,0,4],
        [4,0,4,0,4,0,4,0,0,3,3,3,0,4,0,0,3,3,0,4],
        [4,0,4,0,0,0,4,0,0,0,5,3,0,4,0,4,4,4,4,4],
        [0,0,4,0,4,0,4,0,0,0,3,3,0,4,0,0,0,0,0,0],
        [4,4,4,0,4,0,4,4,4,0,0,0,0,4,4,4,4,4,4,4],
        [0,0,0,0,5,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0],
        [4,4,4,4,4,4,4,0,4,0,4,4,4,4,4,4,4,4,0,4],
        [4,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,4],
        [4,0,4,4,4,4,4,4,4,0,0,0,0,0,5,0,0,4,0,4],
        [4,0,4,0,0,0,5,0,0,0,0,0,0,0,0,5,0,4,0,4],
        [4,0,4,0,0,0,0,0,0,0,4,4,4,0,0,3,0,4,0,4],
        [4,0,4,0,0,3,3,3,5,0,0,0,4,0,0,3,0,4,0,4],
        [4,0,4,4,4,4,4,4,4,4,0,0,4,4,4,4,0,4,0,4],
        [4,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,4],
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
    ],

    level2:[
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,3,3,3,0,0,0,0,0,0,3,3,3,0,0,0,4],
        [4,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,4],
        [4,0,3,0,3,3,3,0,0,0,0,0,0,3,3,3,0,3,0,4],
        [4,0,3,0,3,0,0,0,0,0,0,0,0,0,0,3,0,3,0,4],
        [4,0,3,0,3,0,3,3,3,0,0,3,3,3,0,3,0,3,0,4],
        [4,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,4],
        [4,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,4],
        [4,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,4],
        [4,0,3,0,3,0,3,3,3,0,0,3,3,3,0,3,0,3,0,4],
        [4,0,3,0,3,0,0,0,0,0,0,0,0,0,0,3,0,3,0,4],
        [4,0,3,0,3,3,3,0,0,0,0,0,3,3,3,3,0,3,0,4],
        [4,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,4],
        [4,0,0,0,3,3,3,0,0,0,0,0,3,3,3,3,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
    ],

    level3:[
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
        [4,0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,9,9,9,9,9,9,0,0,0,0,0,0,3,0,0,4],
        [4,0,9,0,0,0,0,0,0,0,9,9,9,9,0,0,3,3,0,4],
        [4,0,9,0,9,9,9,9,9,0,0,0,0,9,0,0,0,0,0,4],
        [4,0,9,0,9,0,0,0,0,0,9,9,0,9,0,0,3,3,0,4],
        [4,0,9,0,9,0,9,0,0,3,3,3,0,9,0,0,3,3,0,4],
        [4,0,9,0,0,0,9,0,0,0,5,3,0,9,0,9,9,9,9,4],
        [0,0,9,0,9,0,9,0,0,0,3,3,0,9,0,0,0,0,0,0],
        [9,9,9,0,9,0,9,9,9,6,0,0,0,9,9,9,9,9,9,9],
        [0,0,0,0,5,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0],
        [4,9,9,9,9,9,9,0,9,0,9,9,9,9,9,9,9,9,0,4],
        [4,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,9,0,4],
        [4,0,9,9,9,9,9,9,9,0,0,0,0,0,5,0,0,9,0,4],
        [4,0,9,0,0,0,5,0,0,0,0,0,0,0,0,5,0,9,0,4],
        [4,0,9,0,0,0,0,0,0,0,9,9,9,0,0,3,0,9,0,4],
        [4,0,9,0,0,3,3,3,5,0,0,0,9,0,0,3,0,9,0,4],
        [4,0,0,9,9,9,9,9,9,9,0,0,9,9,9,9,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,4],
        [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4],
    ],

    wall7:[ 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],

    wall8:[ 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],

    startX: 0,
    startY: 0,
    height: 30,
    width:  30,
       // sprites: [g_sprites.box3, g_sprites.box2, g_sprites.box1, g_sprites.box4]
};

// A generic contructor which accepts an arbitrary descriptor object
function Wall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    //use id, i.e. life of wall as index in this array when rendering
    this.sprite = [g_sprites.box1,
                   g_sprites.box3,
                   g_sprites.box2, 
                   g_sprites.box1, 
                   g_sprites.box4,
                   g_sprites.barrel, 
                   g_sprites.turret];

    this.type = "Wall";
    this.height = 30;
    this.width = 30;
    this.radius = this.height/2;
    //rate of turretfire
    this.turretfire = 100;
    //hp of turret
    this.currentHP = 50;
    this.fullHP = 50;
    this.rotation = 0;
    //var to help turret shoot at sertain angles
    this.shoot1 = true;
    this.shoot2 = true;
    this.shoot3 = true;
    this.shoot4 = true;
    //used in bullet so turrets dont take damage from other turrets
    if(this.life === 6){
        this.wallType = "turret";
    }

};

Wall.prototype = new Entity();

Wall.prototype.woodBreaking = new Audio(
    "../sounds/woodBreaking.wav");

Wall.prototype.thump = new Audio(
    "../sounds/thump.wav");

Wall.prototype.getHeight = function () {
    return this.height;
};

Wall.prototype.getWidth = function () {
    return this.width;
};


Wall.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
    }

    //kill if life gets to 0
    if(this.life == 0){
        this._isDeadNow = true;
    }

    //if this is a turret, rotate it and shoot at Math.PI/2 interval
    if(this.life === 6){ 
        //update rotation
        this.rotation += Math.PI/100;
        //some boolean gymnastics to get it to work
        if(this.rotation > Math.PI*2){
            this.fireTurret(4);
            this.rotation = 0;
            this.shoot1 = true;
            this.shoot2 = true;
            this.shoot3 = true;
        }
        else if(this.rotation > 3*(Math.PI/2) && this.shoot3){
            this.shoot3 = false;
            this.fireTurret(2);
        }
        else if(this.rotation > Math.PI && this.shoot2){
            this.shoot2 = false;
            this.fireTurret(3);
        }
        else if(this.rotation > Math.PI/2 && this.shoot1){
            this.shoot1 = false;
            this.fireTurret(1);
        }
        this.turretfire--;
    }

    if (this.life > 1) {
        spatialManager.register(this);
      }
};

Wall.prototype.takeBulletHit = function () {
    //normal box cracks and loses a life
    if(this.life > 0 && this.life < 4){
        this.life--;
        this.woodBreaking.play();
        //last break of the box maybe gives a powerup
        if(this.life === 1){
            var rand = Math.random();
            if(rand > 0.3){
                entityManager.makePowerup(
                    this.cx + g_brickwall.width/2, this.cy + g_brickwall.height/2);
            }
        }
    }
    //gazoline barrel that explodes and kills self
    else if(this.life === 5){
        entityManager.makeExplosion(
            this.cx + (this.width/2), this.cy + (this.height/2), 40);
        this.life = 0;
        this._isDeadNow = true;
    }
    //unbreakable wall
    else if(this.life === 4){
        this.thump.play();
    }
    //turret that has hp and then explodes
    else if(this.life === 6){
        this.thump.play();
        this.currentHP -= 10;
        if(this.currentHP <= 0){
            entityManager.makeExplosion(
                this.cx + (this.width/2), this.cy + (this.height/2), 40);
            this.life = 0;
            this._isDeadNow = true;
        }
    }
};

//pretty much the same as takeBulletHit()
Wall.prototype.takeExplosionHit = function () {
    if(this.life > 0 && this.life < 4){
        this.life--;
        this.woodBreaking.play();
    }
    else if(this.life === 5){
        entityManager.makeExplosion(
            this.cx + (this.width/2), this.cy + (this.height/2), 40);
        this.life = 0;
        this._isDeadNow = true;
    }
    else if(this.life === 4){
        this.thump.play();
    }
    else if(this.life === 6){
        this.thump.play();
        this.currentHP -= 20;
        if(this.currentHP <= 0){
            entityManager.makeExplosion(
                this.cx + (this.width/2), this.cy + (this.height/2), 40);
            this.life = 0;
            this._isDeadNow = true;
        }
    }
};


//fire a bullet in a certain direction marked as "turretbullet"
//this is done so other turrets dont take damage of that bullet
Wall.prototype.fireTurret = function(direction) {
    var launchDist = 25;
    var xCenter = this.cx + this.width/2;
    var yCenter = this.cy + this.height/2;
    if(direction === 1){
        entityManager.fireBullet(
            xCenter + launchDist, yCenter,
            2, 0,
            0,
            "turretBullet");
    }
    else if(direction === 2){
        entityManager.fireBullet(
            xCenter - launchDist, yCenter,
            -2, 0,
            0,
            "turretBullet");
    }
    else if(direction === 3){
        entityManager.fireBullet(
            xCenter, yCenter + launchDist,
            0, 2,
            0,
            "turretBullet");
    }
    else if(direction === 4){
        entityManager.fireBullet(
            xCenter, yCenter - launchDist,
            0, -2,
            0,
            "turretBullet");
    }
}

Wall.prototype.render = function (ctx) {

    if(this.life > 0 && this.life !== 6){
        this.sprite[this.life].drawCustomImgAt(
            ctx, this.cx, this.cy, this.width, this.height
            );
    }

    //is turret and has a HP bar and has to rotate
    else if(this.life === 6){
        
        this.sprite[this.life].drawCustomImgAt2(
            ctx, this.cx, this.cy, this.width, this.height, this.rotation
            );
        //hp bar of turret
        var barHeight = 5;
        var barWidth = this.width;
        util.fillBox(ctx, this.cx , this.cy - (this.height/2) - 10,
            barWidth, barHeight,
            "Red");
        if(this.currentHP > 0){
            util.fillBox(ctx, this.cx, this.cy - (this.height/2) - 10,
            barWidth * (this.currentHP/this.fullHP), barHeight,
            "Green");
        }
    }
};
