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
function EnimyTank(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.tank1;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
};

EnimyTank.prototype = new Entity();

EnimyTank.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};


// Initial, inheritable, default values
EnimyTank.prototype.rotation = 0;
EnimyTank.prototype.cx = 200;
EnimyTank.prototype.cy = 200;
EnimyTank.prototype.velX = 0;
EnimyTank.prototype.velY = 0;
EnimyTank.prototype.launchVel = 2;
EnimyTank.prototype.numSubSteps = 1;
EnimyTank.prototype.stepsize = 3;
EnimyTank.prototype.width = 25;
EnimyTank.prototype.height = 25;
EnimyTank.prototype.currentHP = 100;
EnimyTank.prototype.fullHP = 100;
EnimyTank.prototype.radius = this.width/2;
EnimyTank.prototype.lives = 3;
EnimyTank.prototype.respawnMinDist = 200;
EnimyTank.prototype.shootingBumper = 0;
EnimyTank.prototype.bombs = 0;
EnimyTank.prototype.shield = 0;
EnimyTank.prototype.shieldLifespan = 10000 / NOMINAL_UPDATE_INTERVAL;
EnimyTank.prototype.wallPadding = 5;
EnimyTank.prototype.fireRate = 0;
EnimyTank.prototype.entityAngle = 0;
EnimyTank.prototype.angleCorrection = 0;
// HACKED-IN AUDIO (no preloading)
/*
EnimyTank.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
*/

EnimyTank.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    //this.warpSound.play();

    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

EnimyTank.prototype.update = function (du) {

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

    if(this.shield > 0){
        this.shield -= du;
    }
    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }
    // Handle firing
    this.maybeFireBullet();

    var hitPowerup = this.findPowerup();
    if (hitPowerup) {
        this.handlePowerup(hitPowerup);
    }

    spatialManager.register(this);
};


EnimyTank.prototype.handlePowerup = function (hitPowerup) {
    hitPowerup._isDeadNow = true;
    if(hitPowerup.powerupType === 0){
        this.handleBombPowerup();
    }
    else if (hitPowerup.powerupType === 1){
        this.handleShieldPowerup();
    }
    
};

EnimyTank.prototype.handleBombPowerup = function () {
    this.bombs++;
};

EnimyTank.prototype.handleShieldPowerup = function () {
    this.shield = this.shieldLifespan;
    console.log("handle shield");
    
};

EnimyTank.prototype.findPowerup = function () {
    var pos = this.getPos();
    return spatialManager.findPowerupInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};


EnimyTank.prototype.computeSubStep = function (du) {

    this.moveTank(du);

    this.wrapPosition();

    if (g_allowMixedActions) {
        this.updateRotation(du);
    }
};

EnimyTank.prototype.moveTank = function (du) {
        
   // if (keys[false]) {
        var deltaX = +Math.sin(this.rotation) * this.stepsize * du;
        var deltaY = -Math.cos(this.rotation) * this.stepsize * du;
/*
        if(this.checkPadding(this.cx + deltaX, this.cy + deltaY, this.getRadius(), this.wallPadding)){
            this.cx += +Math.sin(this.rotation) * this.stepsize * du * 0.5;
            this.cy += -Math.cos(this.rotation) * this.stepsize * du * 0.5;
        }*/
        if(this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())){
            this.cx += +Math.sin(this.rotation) * this.stepsize * du * 0.8;
            this.cy += -Math.cos(this.rotation) * this.stepsize * du * 0.8;
        }
        else{
           // this.rotation += NOMINAL_ROTATE_RATE * du
        }
    //}
};

EnimyTank.prototype.canMove = function (x, y, rad) {
    var canIt = spatialManager.checkBoxCollision(
        x, y, this.getRadius() - this.wallPadding
    );

    return !canIt;
};

EnimyTank.prototype.checkPadding = function (x, y, rad, padding) {
    var canIt = spatialManager.checkBoxPadding(
        x, y, this.getRadius(), padding
    );

    return !canIt;
};

EnimyTank.prototype.maybeFireBullet = function () {
    /*
    console.log("rot");
    
    console.log(this.rotation);
    console.log("enti");
    
    console.log(this.entityAngle);
    */
    
    var fireAngleCalc = Math.abs(this.rotation-this.entityAngle);
    console.log(this.fireRate);
    console.log(this.fireRate === 40 && fireAngleCalc < 1);
    
    if (this.fireRate === 40 && fireAngleCalc < 1) {
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.6;

        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        if(this.bombs > 0){
            entityManager.fireBomb(
                this.cx + dX * launchDist, this.cy + dY * launchDist,
                this.velX + relVelX, this.velY + relVelY,
                this.rotation);
            this.bombs--;
        }
        else{
            entityManager.fireBullet(
                this.cx + dX * launchDist, this.cy + dY * launchDist,
                this.velX + relVelX, this.velY + relVelY,
                this.rotation);
        }
    
    }
    if (this.fireRate === 40) {
        this.fireRate = 0;
    }
    this.fireRate++;

};

EnimyTank.prototype.getRadius = function () {
    return (this.width / 2) * 0.9;
};

EnimyTank.prototype.takeBulletHit = function () {
    if(this.shield > 0){

    }
    else{
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
    }

};

EnimyTank.prototype.takeExplosionHit = function () {
    if(this.shield > 0){

    }
    else{
        this.currentHP -= 30;
        if (this.currentHP <= 0) {
            this.lives--;
    
            entityManager.makeExplosion(
              this.cx, this.cy, 20);
    
            if (this.lives > 0) {
              this.currentHP = this.fullHP;
              this.respawn()
            }
            else this._isDeadNow = true;
        }
    }
};

/* EnimyTank respawns at a mostly random location. Distance between old and new
location must be at least respawnMinDist on both the x- and the y-axis.*/
EnimyTank.prototype.respawn = function () {
    //Available space on the x-axis
    var availableX = g_canvas.width - this.respawnMinDist*2;
    //Available space on the y-axis
    var availableY = g_canvas.height - this.respawnMinDist*2;
    var distCX = this.cx + this.respawnMinDist;
    var distCY = this.cy + this.respawnMinDist;

    this.cx = util.randRange(distCX, distCX + availableX);
    this.cy = util.randRange(distCY, distCY + availableY);
    this.wrapPosition();

    //Adjust new position if the EnimyTank lands on a box
    while (!this.canMove(this.cx, this.cy, this.radius)) {
      this.cx += 30;
      this.cy +=30;
      this.wrapPosition();
    }

}

EnimyTank.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

EnimyTank.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.08;

EnimyTank.prototype.findRotationToTargetEntity = function () {
    var nearestTank = spatialManager.findNearestTank(this.cx, this.cy);
    var nearestPowerup = spatialManager.findNearestPowerup(this.cx, this.cy);
    var targetEntity = nearestTank.tank;
    if(nearestPowerup.dist < nearestTank.dist/2){
        var targetEntity = nearestPowerup.powerup;
    }
    if(targetEntity){
        var calcRotation = this.calculateRotation(targetEntity);
        return calcRotation;
    }
    return false;
}

EnimyTank.prototype.calculateRotation = function (nearestTank) {   
    var delta_x = nearestTank.cx - this.cx;
    var delta_y = this.cy - nearestTank.cy;
    var theta_radians = Math.PI/2 - Math.atan2(delta_y, delta_x);
    if(theta_radians < 0){
        theta_radians = Math.PI*2 + theta_radians;
    }
    return theta_radians;
    
}

EnimyTank.prototype.updateRotation = function (du) {
    var deltaX = +Math.sin(this.rotation) * this.stepsize * du;
    var deltaY = -Math.cos(this.rotation) * this.stepsize * du;

    if(!this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())){
        console.log(this.rotation);
        
        this.rotation += NOMINAL_ROTATE_RATE * du;
    }
    else{
        this.entityAngle = this.findRotationToTargetEntity();
        var diff = Math.abs(this.entityAngle - this.rotation);
        if(diff > Math.PI - 0.1 && diff < Math.PI + 0.1){
            this.angleCorrection = true;
        }
    
        if(this.angleCorrection){
            this.rotation += NOMINAL_ROTATE_RATE * du;
            diff = Math.abs(this.entityAngle - this.rotation);
            if(diff < Math.PI/2){
                this.angleCorrection = false;
            }
        }
        else if (this.entityAngle > this.rotation) {
            this.rotation += NOMINAL_ROTATE_RATE * du;
        }
        else if (this.entityAngle < this.rotation) {
            this.rotation -= NOMINAL_ROTATE_RATE * du;
        }
    
        if(this.rotation > Math.PI * 2){
            this.rotation = 0;
        }
        if(this.rotation < 0){
            this.rotation = Math.PI *2;
        }
    }
    
};

EnimyTank.prototype.render = function (ctx) {

    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.customDrawWrappedCentredAt(
	ctx, this.cx, this.cy, this.width, this.height, this.rotation
    );
    this.sprite.scale = origScale;
    
    if(this.shield > 0){
        //shield bar
        var barHeight = 5;
        var barWidth = this.width;
        util.fillBox(ctx, this.cx - this.width/2, this.cy - (this.height/2) - 10,
            barWidth, barHeight,
            "Grey");
        util.fillBox(ctx, this.cx - this.width/2, this.cy - (this.height/2) - 10,
            barWidth * (this.shield/this.shieldLifespan), barHeight,
            "Blue");
        g_sprites.shield.customDrawWrappedCentredAt(
            ctx, this.cx, this.cy, 3.5*this.getRadius(), 3.5*this.getRadius(), 0,
        );
    }
    else{
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
    }
};
