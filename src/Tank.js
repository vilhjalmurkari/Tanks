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
    this.sprite = this.sprite || g_sprites.tank1;

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


// Initial, inheritable, default values
Tank.prototype.rotation = 0;
Tank.prototype.cx = 200;
Tank.prototype.cy = 200;
Tank.prototype.velX = 0;
Tank.prototype.velY = 0;
Tank.prototype.launchVel = 2;
Tank.prototype.numSubSteps = 1;
Tank.prototype.stepsize = 3;
Tank.prototype.width = 30;
Tank.prototype.height = 30;
Tank.prototype.currentHP = 100;
Tank.prototype.fullHP = 100;
Tank.prototype.radius = this.width/2;
Tank.prototype.lives = 3;
Tank.prototype.respawnMinDist = 200;

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

Tank.prototype.computeSubStep = function (du) {

    this.moveTank(du);

    this.wrapPosition();

    if (g_allowMixedActions) {
        this.updateRotation(du);
    }
};

Tank.prototype.moveTank = function (du) {

    if (keys[this.KEY_FORWARD]) {
        var deltaX = +Math.sin(this.rotation) * this.stepsize * du;
        var deltaY = -Math.cos(this.rotation) * this.stepsize * du;
        if(this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius)){
            this.cx += +Math.sin(this.rotation) * this.stepsize * du;
            this.cy += -Math.cos(this.rotation) * this.stepsize * du;
        }
    }
    if (keys[this.KEY_BACKWARDS]) {
        var deltaX = +Math.sin(this.rotation) * -this.stepsize * du;
        var deltaY = -Math.cos(this.rotation) * -this.stepsize * du;
        if(this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius)){
            this.cx += +Math.sin(this.rotation) * -this.stepsize * du;
            this.cy += -Math.cos(this.rotation) * -this.stepsize * du;
        }
    }

};

Tank.prototype.canMove = function (x, y, rad) {
    var canIt = spatialManager.checkBoxCollision(
        x, y, this.getRadius()
    );

    return !canIt;
};

Tank.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {

        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.6;

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
    return (this.width / 2) * 0.9;
};

Tank.prototype.takeBulletHit = function () {
    this.currentHP -= 10;
    if (this.currentHP <= 0) {
        this.lives--;

        entityManager.makeExplosion(
          this.cx, this.cy, 20);

        if (this.lives > 0) {
          this.currentHP = this.fullHP;
          this.respawn()
        }
        else {
          this._isDeadNow = true;
          gameOver(this.player);
      }
    }

};

/* Tank respawns at a mostly random location. Distance between old and new
location must be at least respawnMinDist on both the x- and the y-axis.*/
Tank.prototype.respawn = function () {
    //Available space on the x-axis
    var availableX = g_canvas.width - this.respawnMinDist*2;
    //Available space on the y-axis
    var availableY = g_canvas.height - this.respawnMinDist*2;
    var distCX = this.cx + this.respawnMinDist;
    var distCY = this.cy + this.respawnMinDist;

    this.cx = util.randRange(distCX, distCX + availableX);
    this.cy = util.randRange(distCY, distCY + availableY);
    this.wrapPosition();

    //Adjust new position if the tank lands on a box
    while (!this.canMove(this.cx, this.cy, this.radius)) {
      this.cx += 30;
      this.cy +=30;
      this.wrapPosition();
    }

}

Tank.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

Tank.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.08;

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
    this.sprite.customDrawWrappedCentredAt(
	ctx, this.cx, this.cy, this.width, this.height, this.rotation
    );
    this.sprite.scale = origScale;

    //hp bar
    var barHeight = 5;
    var barWidth = this.width;
    util.fillBox(ctx, this.cx - this.width/2, this.cy - (this.height/2) - 10,
        barWidth, barHeight,
        "Red");
    if(this.currentHP > 0){
        util.fillBox(ctx, this.cx - this.width/2, this.cy - (this.height/2) - 10,
        barWidth * (this.currentHP/this.fullHP), barHeight,
        "Green");
    }
};
