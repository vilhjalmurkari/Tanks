// ==========
// Powerup STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Powerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
    this.sprite = [g_sprites.bomb, g_sprites.shield];

    this.powerupType = this.getRandPowerup();
    this.type = "PowerUp";
};

Powerup.prototype = new Entity();

Powerup.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};


// Initial, inheritable, default values
Powerup.prototype.cx = 200;
Powerup.prototype.cy = 200;
Powerup.prototype.width = 20;
Powerup.prototype.height = 20;
Powerup.prototype.radius = this.width/2;
Powerup.prototype.fullScalarVar = 60;
Powerup.prototype.scalarVar = 60;

Powerup.prototype.getPowerup = new Audio(
    "sounds/shipWarp.ogg");


Powerup.prototype.update = function (du) {



    spatialManager.unregister(this);
    if (this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
    }
    
    this.scale = 1 + ((-Math.abs((this.fullScalarVar/2) - this.scalarVar) + (this.fullScalarVar/2)) / (this.fullScalarVar/(this.fullScalarVar/20)));
    this.scalarVar--;
    if(this.scalarVar === 0) this.scalarVar = 60;
/*
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        this.warp();
    } else {
      spatialManager.register(this);
    }
*/

    spatialManager.register(this);
};

Powerup.prototype.getRandPowerup = function () {
    var rand = Math.random();
    if(rand < 0.5) return 0;
    else return 1;
};


Powerup.prototype.getRadius = function () {
    return (this.width / 2) * 0.9;
};

Powerup.prototype.takeBulletHit = function () {
    if(this.powerupType === 0){
        entityManager.makeExplosion(
            this.cx, this.cy, 40);
        this._isDeadNow = true;
    }
};

Powerup.prototype.takeExplosionHit = function () {

};

Powerup.prototype.render = function (ctx) {
    var scale = this.scale;
    var spriteWidth = g_sprites.bomb.width/3;
    var spriteHeight = g_sprites.bomb.height;
    if(this.powerupType === 0){
        this.sprite[this.powerupType].customDrawWrappedCentredAt(
            ctx, this.cx, this.cy, scale*2*this.getRadius(), scale*2*this.getRadius(), this.rotation/2, 0, 0, spriteWidth, spriteHeight
        );
    }
    else{
        this.sprite[this.powerupType].customDrawWrappedCentredAt(
            ctx, this.cx, this.cy, scale*1.5*this.getRadius(), scale*1.5*this.getRadius(), this.rotation/2,
        );
    }
};
