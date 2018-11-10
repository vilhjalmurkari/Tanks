// ====
// WALL
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_brickwall = {
//Easy to switch levels in generateWalls in entityManager
    wall:[ 
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
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
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3], 
    ],
    //using 9 to represent a random wall
    wall2:[ 
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,6,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,6,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,6,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,6,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
        [9,9,9,9,9,9,9,0,0,0,0,9,9,9,9,9,9,9,9,9],
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

    this.sprite = [g_sprites.box1, g_sprites.box3, g_sprites.box2, g_sprites.box1, g_sprites.box4, g_sprites.barrel, g_sprites.turret];
    this.type = "Wall";
    this.height = 30;
    this.width = 30;
    this.radius = this.height/2;
    this.turretfire = 100;

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

    if (this.life > 1) {
      spatialManager.register(this);
    }

    if(this.life == 0){
        this._isDeadNow = true;
    }

    if(this.life === 6){    
        if(this.turretfire == 0){
            this.fireTurret();
            this.turretfire = 100;
        }  
        this.turretfire--;
    }
};

Wall.prototype.takeBulletHit = function () {
    if(this.life > 0 && this.life < 4){
        this.life--;
        this.woodBreaking.play();
    }
    if(this.life === 5){
        entityManager.makeExplosion(
            this.cx + (this.width/2), this.cy + (this.height/2), 40);
        this.life = 0;
        this._isDeadNow = true;
    }
    if(this.life === 4 && this.life === 6){
        this.thump.play();
    }
};

Wall.prototype.takeExplosionHit = function () {
    if(this.life > 0 && this.life < 4){
        this.life--;
        this.woodBreaking.play();
    }
    if(this.life === 5){
        entityManager.makeExplosion(
            this.cx + (this.width/2), this.cy + (this.height/2), 40);
        this.life = 0;
        this._isDeadNow = true;
    }
    if(this.life === 4 && this.life === 6){
        this.thump.play();
    }
};

Wall.prototype.render = function (ctx) {

    if(this.life > 0){
        this.sprite[this.life].drawCustomImgAt(
            ctx, this.cx, this.cy, this.width, this.height
            );
    }
};

Wall.prototype.fireTurret = function() {
    var launchDist = 25;
    var xCenter = this.cx + this.width/2;
    var yCenter = this.cy + this.height/2;
    entityManager.fireBullet(
        xCenter + launchDist, yCenter,
        2, 0,
        0);

    entityManager.fireBullet(
        xCenter - launchDist, yCenter,
        -2, 0,
        0);

    entityManager.fireBullet(
        xCenter, yCenter + launchDist,
        0, 2,
        0);

    entityManager.fireBullet(
        xCenter, yCenter - launchDist,
        0, -2,
        0);
    
}
