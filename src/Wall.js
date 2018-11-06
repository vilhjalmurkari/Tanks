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

  wall:[ [1,4,1,3,3,2,3,0,1,2,1,5,3,1,1,5,2,2,2,5],
        [1,4,2,4,2,5,5,0,1,5,3,4,4,1,4,3,3,5,4,0],
        [5,2,1,2,4,1,4,4,0,4,1,2,0,3,1,5,1,2,3,1],
        [3,3,2,2,4,1,4,2,1,3,0,2,0,1,5,2,1,4,3,2],
        [5,3,2,1,0,4,0,4,0,3,5,0,5,2,0,5,5,5,3,3],
        [3,1,4,5,2,3,4,1,1,3,2,5,1,5,0,1,4,0,2,1],
        [4,2,4,4,5,1,3,1,1,4,3,0,0,2,0,3,5,0,1,4],
        [0,0,5,2,1,0,2,3,5,2,5,4,1,4,5,2,3,3,1,2],
        [4,3,4,0,1,5,4,0,4,1,5,1,5,2,0,3,0,4,4,1],
        [0,1,0,5,1,1,2,2,1,0,5,3,2,5,4,1,0,0,0,2],
        [4,1,2,3,1,0,0,0,0,4,0,2,1,1,3,0,4,3,3,0],
        [3,1,4,5,2,1,3,1,5,4,0,1,2,5,4,3,1,0,5,1],
        [3,3,5,2,4,1,1,2,0,0,5,5,2,3,1,0,3,1,3,0],
        [2,4,2,5,2,0,2,2,5,2,2,4,1,0,5,3,5,5,2,0],
        [5,2,3,1,4,5,0,3,3,0,1,0,4,4,3,5,0,4,1,4],
        [4,0,3,4,4,3,5,3,0,5,2,0,4,4,2,4,2,1,4,4],
        [0,5,0,1,5,5,2,1,3,5,0,4,2,2,1,1,0,2,2,2],
        [3,5,1,4,4,5,4,1,5,3,1,3,0,4,5,4,4,2,5,5],
        [5,4,3,0,0,1,0,1,5,1,0,5,2,1,5,0,3,1,3,2],
        [3,1,2,4,4,4,0,1,5,4,5,0,4,0,0,0,0,0,5,1] ],

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

    this.sprite = [g_sprites.box3, g_sprites.box2, g_sprites.box1, g_sprites.box4, g_sprites.box4, g_sprites.box4];
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

    //this.wrapPosition();

    spatialManager.register(this);

};

// HACKED-IN AUDIO (no preloading)
/*
Rock.prototype.splitSound = new Audio(
  "sounds/rockSplit.ogg");
  */

Wall.prototype.takeBulletHit = function () {
    this.life--;
    //this.kill();

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
    if(this.life >= 0 && this.life < 5){
        this.sprite[this.life].drawCustomImgAt(
            ctx, this.cx, this.cy, this.width, this.height
            );
    }


    /*util.fillBox(ctx, this.cx, this.cy,
                this.width, this.height,
                g_brickwall.color[this.life]);*/


};
