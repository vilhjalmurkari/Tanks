// ======
// BOMB
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bomb(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();


}

Bomb.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bomb.prototype.fireSound = new Audio(
    "../sounds/bulletCannon.wav");
    
// Initial, inheritable, default values
Bomb.prototype.rotation = 0;
Bomb.prototype.cx = 200;
Bomb.prototype.cy = 200;
Bomb.prototype.velX = 1;
Bomb.prototype.velY = 1;
Bomb.prototype.scale = 1;
//var to scroll through sprtites in animation
Bomb.prototype.spriteNr = 0;



// Convert times from milliseconds to "nominal" time units.
//vars to make bomb explode after some time
Bomb.prototype.lifespanLength = 1500 / NOMINAL_UPDATE_INTERVAL;
Bomb.prototype.lifeSpan = 1500 / NOMINAL_UPDATE_INTERVAL;

Bomb.prototype.update = function (du) {
    
    //unregister this entity
    spatialManager.unregister(this);

    //check if it is dead, then return KILL_ME_NOW
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
    //countdown to explosion, then make a exploison
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) {
        entityManager.makeExplosion(
            this.cx, this.cy, 40);
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    //rotate bomb
    this.rotation += 0.5 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    this.wrapPosition();
    
    //reregister
    spatialManager.register(this);
};

Bomb.prototype.getRadius = function () {
    return 6;
};

Bomb.prototype.render = function (ctx) {
    //scale is used to make bomb look like it flies up and then down
    var scale = 1.5 + 1.2*((-Math.abs((this.lifespanLength/2) - this.lifeSpan) + (this.lifespanLength/2)) / (this.lifespanLength/2));

    //vars used to cut the right sprite from a larger sprite image
    var spriteWidth = g_sprites.bomb.width/3;
    var spriteHeight = g_sprites.bomb.height;
    var cutX = g_sprites.bomb.width/3 * this.spriteNr;
    var cutY = 0;
    this.spriteNr++;
    //animate bomb
    if(this.spriteNr === 3) this.spriteNr = 0;
    g_sprites.bomb.customDrawWrappedCentredAt(
        ctx, this.cx, this.cy, scale*2*this.getRadius(), scale*2*this.getRadius(), this.rotation/2, cutX, cutY, spriteWidth, spriteHeight
    );

};
