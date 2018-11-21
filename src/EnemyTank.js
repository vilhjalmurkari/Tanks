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
function EnemyTank(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    if(this.randomLoc){
        this.spawn();
    }
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.tank3;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
    this.type = "EnemyTank";
};

EnemyTank.prototype = new Entity();

EnemyTank.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};


// Initial, inheritable, default values
EnemyTank.prototype.rotation = 0;
EnemyTank.prototype.cx = 200;
EnemyTank.prototype.cy = 200;
EnemyTank.prototype.velX = 0;
EnemyTank.prototype.velY = 0;
EnemyTank.prototype.extraSpeed = 0.8;
EnemyTank.prototype.launchVel = 2;
EnemyTank.prototype.numSubSteps = 1;
EnemyTank.prototype.stepsize = 3;
EnemyTank.prototype.width = 25;
EnemyTank.prototype.height = 25;
EnemyTank.prototype.currentHP = 100;
EnemyTank.prototype.fullHP = 100;
EnemyTank.prototype.radius = this.width/2;
EnemyTank.prototype.lives = 3;
EnemyTank.prototype.respawnMinDist = 200;
EnemyTank.prototype.shootingBumper = 0;
EnemyTank.prototype.bombs = 0;
EnemyTank.prototype.shield = 0;
EnemyTank.prototype.shieldLifespan = 10000 / NOMINAL_UPDATE_INTERVAL;
EnemyTank.prototype.wallPadding = 5;
EnemyTank.prototype.fireRate = 0;
EnemyTank.prototype.fireSpeed = 30;
EnemyTank.prototype.orginalFireSpeed = 30;
EnemyTank.prototype.entityAngle = 0;
EnemyTank.prototype.angleCorrection = 0;
EnemyTank.prototype.moveFromWall = 0;
// HACKED-IN AUDIO (no preloading)
/*
EnemyTank.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
*/

EnemyTank.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    //this.warpSound.play();

    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

EnemyTank.prototype.update = function (du) {

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
    this.maybeFireBullet(du);

    var hitPowerup = this.findPowerup();
    if (hitPowerup) {
        this.handlePowerup(hitPowerup);
    }

    spatialManager.register(this);
};


EnemyTank.prototype.handlePowerup = function (hitPowerup) {
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

EnemyTank.prototype.handleBombPowerup = function () {
    this.bombs++;
};

EnemyTank.prototype.handleShieldPowerup = function () {
    this.shield = this.shieldLifespan;
};

EnemyTank.prototype.handleSpeedPowerup = function () {
    if(this.extraSpeed < 1.8){
        this.extraSpeed += 0.1;
    }
};

EnemyTank.prototype.handleReaperPowerup = function () {
    this.currentHP = 100;
};

EnemyTank.prototype.handleFirepowerPowerup = function () {
    if(this.fireSpeed > 14){
        this.fireSpeed = this.fireSpeed - 2
    }
};

EnemyTank.prototype.handleResetPowerup = function () {
    this.extraSpeed = 0.8;
    this.shield = 0;
    this.bombs = 0;
    this.fireSpeed = this.orginalFireSpeed;
};

EnemyTank.prototype.findPowerup = function () {
    var pos = this.getPos();
    return spatialManager.findPowerupInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};


EnemyTank.prototype.computeSubStep = function (du) {

    this.moveTank(du);

    this.wrapPosition();

    if (g_allowMixedActions) {
        this.updateRotation(du);
    }
};

EnemyTank.prototype.moveTank = function (du) {
    var nearestTankDist = this.findNearestTankdist();
    if (!this.angleCorrection && nearestTankDist > 50) {
        var deltaX = +Math.sin(this.rotation) * this.stepsize * du * this.extraSpeed;
        var deltaY = -Math.cos(this.rotation) * this.stepsize * du * this.extraSpeed;

        if(this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())){
            this.cx += +Math.sin(this.rotation) * this.stepsize * du * this.extraSpeed;
            this.cy += -Math.cos(this.rotation) * this.stepsize * du * this.extraSpeed;
        }
        else if(this.moveFromWall > - 10 && this.moveFromWall < 10 && this.moveFromWall !== 0){
            var deltaX = +Math.sin(this.rotation) * -this.stepsize * this.extraSpeed;
            var deltaY = -Math.cos(this.rotation) * -this.stepsize * this.extraSpeed;
            if(this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())){
                this.cx += +Math.sin(this.rotation) * -this.stepsize * this.extraSpeed;
                this.cy += -Math.cos(this.rotation) * -this.stepsize * this.extraSpeed;
            }
        }
    }
};

EnemyTank.prototype.canMove = function (x, y, rad) {
    var wrapCheck = this.checkCollisionWrapping(x, y, rad);
    var canIt = wrapCheck;
    return !canIt;
};

EnemyTank.prototype.checkCollisionWrapping = function (x, y, rad) {
    var sw = g_canvas.width;

    var checkMiddle = this.checkCollisionWrappingVertical(x, y, rad);
    var checkLeft = this.checkCollisionWrappingVertical(x - sw, y, rad);
    var checkRight = this.checkCollisionWrappingVertical(x + sw, y, rad);

    return checkMiddle || checkLeft || checkRight;
};

EnemyTank.prototype.checkCollisionWrappingVertical = function (x, y, rad) {
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

EnemyTank.prototype.checkPadding = function (x, y, rad, padding) {
    var canIt = spatialManager.checkBoxPadding(
        x, y, this.getRadius(), padding
    );

    return !canIt;
};

EnemyTank.prototype.maybeFireBullet = function (du) {


    var fireAngleCalc = Math.abs(this.rotation-this.entityAngle);
    var deltaX = +Math.sin(this.rotation) * this.stepsize * du;
    var deltaY = -Math.cos(this.rotation) * this.stepsize * du;
    var isStuck = this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())

    if ((this.fireRate >= this.fireSpeed && fireAngleCalc < 1) || (!isStuck && this.fireRate >= this.fireSpeed)) {
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
    if (this.fireRate >= this.fireSpeed) {
        this.fireRate = 0;
    }
    this.fireRate++;

};

EnemyTank.prototype.getRadius = function () {
    return (this.width / 2) * 0.9;
};

EnemyTank.prototype.takeBulletHit = function () {
    if(this.shield > 0){
    }
    else{
        this.currentHP -= 10;
        if (this.currentHP <= 0) {
            if(twoPlayers){
                this.respawn();
                this.currentHP = this.fullHP;
            }
            else{
                if(numEnemies > 0){
                    numEnemies--;
                }
                if(numEnemies === 0 && enemylives > 0){
                    enemylives--;
                    for(var i = 0; i < 4 - enemylives; i++) {
                        entityManager.generateEnemyTank({
                            cx : 270,
                            cy : 350,
                            sprite : g_sprites.tank3,
                            player : 3,
                            randomLoc: true,
                        });
                    }
                    numEnemies = 4 - enemylives;
                }
                entityManager.makeExplosion(
                  this.cx, this.cy, 40);

                if (enemylives > 0) {
                    this._isDeadNow = true;
                }
                else {
                  this._isDeadNow = true;
                  gameOver(this.player);
              }
            }
        }
    }

};

EnemyTank.prototype.takeExplosionHit = function () {
    if(this.shield > 0){

    }
    else{
        this.currentHP -= 30;
        if (this.currentHP <= 0) {
            if(twoPlayers){
                this.respawn();
                this.currentHP = this.fullHP;
            }
            else{
                if(numEnemies > 0){
                    numEnemies--;
                }
                if(numEnemies === 0 && enemylives > 0){
                    enemylives--;
                    for(var i = 0; i < 4 - enemylives; i++) {
                        entityManager.generateEnemyTank({
                            cx : 270,
                            cy : 350,
                            sprite : g_sprites.tank3,
                            player : 3,
                            randomLoc: true,
                        });
                    }
                    numEnemies = 4 - enemylives;
                }
                entityManager.makeExplosion(
                  this.cx, this.cy, 40);

                if (enemylives > 0) {
                    this._isDeadNow = true;
                }
                else {
                  this._isDeadNow = true;
                  gameOver(this.player);
              }
            }
        }
    }
};

/* EnemyTank respawns at a mostly random location. Distance between old and new
location must be at least respawnMinDist on both the x- and the y-axis.*/
EnemyTank.prototype.respawn = function () {
    //Available space on the x-axis
    var availableX = g_canvas.width - this.respawnMinDist*2;
    //Available space on the y-axis
    var availableY = g_canvas.height - this.respawnMinDist*2;
    var distCX = this.cx + this.respawnMinDist;
    var distCY = this.cy + this.respawnMinDist;

    this.cx = util.randRange(distCX, distCX + availableX);
    this.cy = util.randRange(distCY, distCY + availableY);
    this.wrapPosition();

    //Adjust new position if the EnemyTank lands on a box
    while (!this.canMove(this.cx, this.cy, this.radius)) {
      this.cx += 30;
      this.cy +=30;
      this.wrapPosition();
    }

}

EnemyTank.prototype.spawn = function () {
    //Available space on the x-axis
    var availableX = g_canvas.width - this.respawnMinDist*2;
    //Available space on the y-axis
    var availableY = g_canvas.height - this.respawnMinDist*2;
    var xRand = 100 + Math.floor(Math.random() * (g_canvas.width - 100));
    var yRand = 100 + Math.floor(Math.random() * (g_canvas.height - 100));
    var distCX = xRand + this.respawnMinDist;
    var distCY = yRand + this.respawnMinDist;

    this.cx = util.randRange(distCX, distCX + availableX);
    this.cy = util.randRange(distCY, distCY + availableY);
    this.wrapPosition();

    //Adjust new position if the EnemyTank lands on a box
    while (!this.canMove(this.cx, this.cy, this.radius)) {
      this.cx += 30;
      this.cy +=30;
      this.wrapPosition();
    }

}

EnemyTank.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

EnemyTank.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.08;

EnemyTank.prototype.findNearestTankdist = function () {
    var nearestTank = spatialManager.findNearestTank(this.cx, this.cy);
    var nearestPowerup = spatialManager.findNearestPowerup(this.cx, this.cy);
    var targetEntity = nearestTank.tank;
    if(nearestPowerup.dist > nearestTank.dist/2){
        return nearestTank.dist;
    }
    return Infinity;
}

EnemyTank.prototype.findRotationToTargetEntity = function () {
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

EnemyTank.prototype.calculateRotation = function (nearestTank) {
    var delta_x = nearestTank.cx - this.cx;
    var delta_y = this.cy - nearestTank.cy;
    var theta_radians = Math.PI/2 - Math.atan2(delta_y, delta_x);
    if(theta_radians < 0){
        theta_radians = Math.PI*2 + theta_radians;
    }
    return theta_radians;

}
EnemyTank.prototype.updateRotation = function (du) {
    var deltaX = +Math.sin(this.rotation) * this.stepsize * du;
    var deltaY = -Math.cos(this.rotation) * this.stepsize * du;

    if(!this.canMove(this.cx + deltaX, this.cy + deltaY, this.getRadius())){
        if(this.moveFromWall === 0){
            var rand = Math.random();
            if(rand < 0.5){
                this.moveFromWall = 90;
            }
            else{
                this.moveFromWall = -90;
            }
        }
        if(this.moveFromWall > 0){
            this.rotation += NOMINAL_ROTATE_RATE * du;
        }
        else if(this.moveFromWall < 0){
            this.rotation -= NOMINAL_ROTATE_RATE * du;
        }

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
    if(this.moveFromWall > 0){
        this.moveFromWall--;
    }
    else if(this.moveFromWall < 0){
        this.moveFromWall++;
    }

};

EnemyTank.prototype.render = function (ctx) {

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
    if(!twoPlayers){
        for(var i = 0; i < enemylives; i++){
            this.sprite.customDrawWrappedCentredAt(
                ctx, g_canvas.width - 30 - (i*this.width - 5), 30, this.width/2, this.height/2, 0
                );
        }
    }
};
