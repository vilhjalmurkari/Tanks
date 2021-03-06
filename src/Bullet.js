// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "../sounds/bulletCannon.wav");
Bullet.prototype.zappedSound = new Audio(
    "../sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;



// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Bullet.prototype.update = function (du) {

    //unregister this entity
    spatialManager.unregister(this);

    //check if it is dead, then return KILL_ME_NOW
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du*2;
    this.cy += this.velY * du*2;

    this.rotation += 0.5 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    this.wrapPosition();
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity); 
        return entityManager.KILL_ME_NOW;
    }

    //check if bullet hits wall
    var hitBox = this.boxCollition();
    if (hitBox) {
        //if bullet from turret shoots another turret nothing happens to turret
        //for turrets friendly fire is off
        if(this.bulletType == "turretBullet" && hitBox.wallType == "turret"){
            return entityManager.KILL_ME_NOW;
        }
        else{
            //turret not shooting turret
            var canTakeHit = hitBox.takeBulletHit;
            if (canTakeHit) canTakeHit.call(hitBox); 
            return entityManager.KILL_ME_NOW;
        }
    }
    
    //reregister
    spatialManager.register(this);
};
//function to check for bullet collition with wall
Entity.prototype.boxCollition = function () {
    var pos = this.getPos();
    return spatialManager.checkBoxCollision(
        pos.posX, pos.posY, this.getRadius()
    );
};

Bullet.prototype.getRadius = function () {
    return 6;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

//bullet survives explosion
Bullet.prototype.takeExplosionHit = function () {

};

//standard bullet render function
Bullet.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.bullet.customDrawWrappedCentredAt(
        ctx, this.cx, this.cy, 2*this.getRadius(), 2*this.getRadius(), this.rotation
    );

    ctx.globalAlpha = 1;
};
