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

  wall:[ [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
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
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3], ],

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

    this.sprite = [g_sprites.box4, g_sprites.box3, g_sprites.box2, g_sprites.box1, g_sprites.box4, g_sprites.barrel];
    this.type = "Wall";
    this.height = 30;
    this.width = 30;
    this.radius = this.height/2;
    // Default sprite and scale, if not otherwise specified
    //this.sprite = this.sprite || g_sprites.rock;
    //this.scale  = this.scale  || 1;

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

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
    if(this.life === 4){
        this.thump.play();
    }
};

Wall.prototype.render = function (ctx) {
  /*
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    */
    if(this.life > 0){
        this.sprite[this.life].drawCustomImgAt(
            ctx, this.cx, this.cy, this.width, this.height
            );
    }

};
