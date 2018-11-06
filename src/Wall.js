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
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3],
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

    this.sprite = [g_sprites.box4, g_sprites.box3, g_sprites.box2, g_sprites.box1, g_sprites.box4, g_sprites.box4, g_sprites.box4];
    this.type = "Wall";
    this.height = 30;
    this.width = 30;
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

Wall.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
    }

  //  this.cx += this.velX * du;
  //  this.cy += this.velY * du;


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
    if(this.life > 0 && this.life < 5){
        this.sprite[this.life].drawCustomImgAt(
            ctx, this.cx, this.cy, this.width, this.height
            );
    }


    /*util.fillBox(ctx, this.cx, this.cy,
                this.width, this.height,
                g_brickwall.color[this.life]);*/


};
