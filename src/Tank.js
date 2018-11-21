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
    this.type = "Tank";
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
Tank.prototype.extraSpeed = 1;
Tank.prototype.launchVel = 2;
Tank.prototype.numSubSteps = 1;
Tank.prototype.stepsize = 3;
Tank.prototype.width = 25;
Tank.prototype.height = 25;
Tank.prototype.currentHP = 100;
Tank.prototype.fullHP = 100;
Tank.prototype.radius = this.width/2;
Tank.prototype.lives = 3;
Tank.prototype.respawnMinDist = 200;
Tank.prototype.shootingBumper = 0;
Tank.prototype.bombs = 0;
Tank.prototype.shield = 0;
Tank.prototype.shieldLifespan = 10000 / NOMINAL_UPDATE_INTERVAL;
Tank.prototype.wallPadding = 5;
Tank.prototype.fireRate = 0;
Tank.prototype.orginalFireSpeed = 20;
Tank.prototype.fireSpeed = 20;
// HACKED-IN AUDIO (no preloading)


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


Tank.prototype.handlePowerup = function (hitPowerup) {
    hitPowerup._isDeadNow = true;
    if(hitPowerup.powerupType === 0){
        this.handleBombPowerup();
    }
    else if (hitPowerup.powerupType === 1){
        this.handleShieldPowerup();
    }
    else if (hitPowerup.powerupType === 2){
        this.handleSpeedPowerup();
    }
    else if (hitPowerup.powerupType === 3){
        this.handleReaperPowerup();
    }
    else if (hitPowerup.powerupType === 4){
        this.handleFirepowerPowerup();
    }

};

Tank.prototype.handleBombPowerup = function () {
    this.bombs++;
};

Tank.prototype.handleShieldPowerup = function () {
    this.shield = this.shieldLifespan;
};

Tank.prototype.handleSpeedPowerup = function () {
    if(this.extraSpeed < 1.8){
        this.extraSpeed += 0.1;
    }
};

Tank.prototype.handleReaperPowerup = function () {
    this.lives++;
    // this.currentHP = 100;
};

Tank.prototype.handleFirepowerPowerup = function () {
    if(this.fireSpeed > 8){
        this.fireSpeed = this.fireSpeed - 2
    }
};

Tank.prototype.handleResetPowerup = function () {
    this.extraSpeed = 1;
    this.shield = 0;
    this.bombs = 0;
    this.fireSpeed = this.orginalFireSpeed;
};

Tank.prototype.findPowerup = function () {
    var pos = this.getPos();
    return spatialManager.findPowerupInRange(
        pos.posX, pos.posY, this.getRadius()
    );
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
        var deltaX = +Math.sin(this.rotation) * this.stepsize * du * this.extraSpeed;
        var deltaY = -Math.cos(this.rotation) * this.stepsize * du * this.extraSpeed;

        if(this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())){
            this.cx += +Math.sin(this.rotation) * this.stepsize * du * this.extraSpeed;
            this.cy += -Math.cos(this.rotation) * this.stepsize * du * this.extraSpeed;
        }
    }
    if (keys[this.KEY_BACKWARDS]) {
        var deltaX = +Math.sin(this.rotation) * -this.stepsize * du * this.extraSpeed;
        var deltaY = -Math.cos(this.rotation) * -this.stepsize * du * this.extraSpeed;
        if(this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())){
            this.cx += +Math.sin(this.rotation) * -this.stepsize * du * this.extraSpeed;
            this.cy += -Math.cos(this.rotation) * -this.stepsize * du * this.extraSpeed;
        }
    }

};

Tank.prototype.canMove = function (x, y, rad) {
    var wrapCheck = this.checkCollisionWrapping(x, y, rad);
    var canIt = wrapCheck;
    return !canIt;
};

Tank.prototype.checkCollisionWrapping = function (x, y, rad) {
    var sw = g_canvas.width;

    var checkMiddle = this.checkCollisionWrappingVertical(x, y, rad);
    var checkLeft = this.checkCollisionWrappingVertical(x - sw, y, rad);
    var checkRight = this.checkCollisionWrappingVertical(x + sw, y, rad);

    return checkMiddle || checkLeft || checkRight;
};

Tank.prototype.checkCollisionWrappingVertical = function (x, y, rad) {
    var sh = g_canvas.height;
    //if no collision then everything retuns false
    //if one function retuns an entity this will return said entity
    var boxCheckMiddle = spatialManager.checkBoxCollision(
        x, y, this.getRadius() - this.wallPadding
    );
    var tankCheckMiddle = spatialManager.checkTankVTankCollision(
        x, y, this.getRadius()
    );
    var boxCheckTop = spatialManager.checkBoxCollision(
        x, y + sh, this.getRadius() - this.wallPadding
    );
    var tankCheckTop = spatialManager.checkTankVTankCollision(
        x, y + sh, this.getRadius()
    );
    var boxCheckBottom = spatialManager.checkBoxCollision(
        x, y - sh, this.getRadius() - this.wallPadding
    );
    var tankCheckBottom = spatialManager.checkTankVTankCollision(
        x, y - sh, this.getRadius()
    );
    
    return (boxCheckBottom 
           || boxCheckMiddle 
           || boxCheckTop 
           || tankCheckBottom 
           || tankCheckMiddle 
           || tankCheckTop);
};


Tank.prototype.checkPadding = function (x, y, rad, padding) {
    var canIt = spatialManager.checkBoxPadding(
        x, y, this.getRadius(), padding
    );

    return !canIt;
};

Tank.prototype.maybeFireBullet = function () {

    if (this.fireRate >= this.fireSpeed && eatKey(this.KEY_FIRE)) {
        this.fireRate = 0;
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
    if(this.fireRate < this.fireSpeed){
        this.fireRate++;
    }

};

Tank.prototype.getRadius = function () {
    return (this.width / 2) * 0.9;
};

Tank.prototype.takeBulletHit = function () {
    if(this.shield > 0){

    }
    else{
        this.currentHP -= 10;
        if (this.currentHP <= 0) {
            this.lives--;

            entityManager.makeExplosion(
              this.cx, this.cy, 40);

            if (this.lives > 0) {
              this.currentHP = this.fullHP;
              this.respawn()
              this.handleResetPowerup();
            }
            else {
              this._isDeadNow = true;
              gameOver(this.player);
          }
        }
    }

};

Tank.prototype.takeExplosionHit = function () {
    if(this.shield > 0){

    }
    else{
        this.currentHP -= 30;
        if (this.currentHP <= 0) {
            this.lives--;

            entityManager.makeExplosion(
              this.cx, this.cy, 40);

            if (this.lives > 0) {
              this.currentHP = this.fullHP;
              this.handleResetPowerup();
              this.respawn()
            }
            else{
                this._isDeadNow = true;
                gameOver(this.player);
            }
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

    //fireRate bar
    var barHeight = 5;
    var barWidth = this.width;
    util.fillBox(ctx, this.cx - this.width/2, this.cy - (this.height/2) - 20,
        barWidth, barHeight,
        "Grey");
    util.fillBox(ctx, this.cx - this.width/2, this.cy - (this.height/2) - 20,
        barWidth * (this.fireRate/this.fireSpeed), barHeight,
        "Yellow");
    if(this.player === 1){
        for(var i = 0; i < this.lives; i++){
            this.sprite.customDrawWrappedCentredAt(
                ctx, 30 + (i*this.width + 5), 30, this.width/2, this.height/2, 0
                );
        }
    }
    else{
        for(var i = 0; i < this.lives; i++){
            this.sprite.customDrawWrappedCentredAt(
                ctx, g_canvas.width - 30 - (i*this.width - 5), 30, this.width/2, this.height/2, 0
                );
        }
    }
};
