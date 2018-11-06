// ==========
// TANK STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Tank(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
};

Tank.prototype = new Entity();

Tank.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Tank.prototype.KEY_FORWARD = 'W'.charCodeAt(0);
Tank.prototype.KEY_BACKWARDS  = 'S'.charCodeAt(0);
Tank.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Tank.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Tank.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Tank.prototype.rotation = 0;
Tank.prototype.cx = 200;
Tank.prototype.cy = 200;
Tank.prototype.velX = 0;
Tank.prototype.velY = 0;
Tank.prototype.launchVel = 2;
Tank.prototype.numSubSteps = 1;
Tank.prototype.stepsize = 3;

// HACKED-IN AUDIO (no preloading)
/*
Tank.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
*/

Tank.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    //this.warpSound.play();

    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Tank.prototype.update = function (du) {

    // Handle warping
    /*
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }*/

    spatialManager.unregister(this);
    if (this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
    }

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet();

    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        this.warp();
    } else {
      spatialManager.register(this);
    }
    
};

Tank.prototype.computeSubStep = function (du) {

    this.moveTank(du);

    this.wrapPosition();

    if (g_allowMixedActions) {
        this.updateRotation(du);
    }
};

Tank.prototype.moveTank = function (du) {

    if (keys[this.KEY_FORWARD]) {
        this.cx += +Math.sin(this.rotation) * this.stepsize * du;
        this.cy += -Math.cos(this.rotation) * this.stepsize * du;
    }
    if (keys[this.KEY_BACKWARDS]) {
        this.cx += +Math.sin(this.rotation) * -this.stepsize * du;
        this.cy += -Math.cos(this.rotation) * -this.stepsize * du;
    }

};

Tank.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {

        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;

        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);

    }

};

Tank.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Tank.prototype.takeBulletHit = function () {
    //this.warp();
};

Tank.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

Tank.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.05;

Tank.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) {
        this.rotation -= NOMINAL_ROTATE_RATE * du;
    }
    if (keys[this.KEY_RIGHT]) {
        this.rotation += NOMINAL_ROTATE_RATE * du;
    }
};

Tank.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
