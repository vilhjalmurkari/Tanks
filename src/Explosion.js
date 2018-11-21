// ======
// Explosion
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Explosion(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created 
    this.explodeSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Explosion.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Explosion.prototype.explodeSound = new Audio(
    "../sounds/explosion.wav");
    
// Initial, inheritable, default values
Explosion.prototype.rotation = 0;
Explosion.prototype.cx = 200;
Explosion.prototype.cy = 200;
Explosion.prototype.width = 20;
Explosion.prototype.height = 20;

Explosion.prototype.lifeSpan = 0;

Explosion.prototype.update = function (du) {

    //unregister this entity
    spatialManager.unregister(this);

    //lifespan counter
    this.lifeSpan++;
    if (this.lifeSpan > 81) return entityManager.KILL_ME_NOW;
    
    //
    // Handle explosion radius
    // find all entities in radius when 
    // exploion is biggest
    if(this.lifeSpan === 23){
        var hitEntities = this.findAllHitEntities();
        //make all entities in radius take hit 
        if (hitEntities) {
            for(var i = 0; i < hitEntities.length; i++){
                var canTakeHit = hitEntities[i].takeExplosionHit;
                if (canTakeHit) canTakeHit.call(hitEntities[i]); 
            } 
        }

    }
    
    //reregister
    spatialManager.register(this);
};
//reruns all entities in radius
Entity.prototype.findAllHitEntities = function () {
    var pos = this.getPos();
    return spatialManager.findAllEntitesInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

Explosion.prototype.getRadius = function () {
    return this.radius;
};

Explosion.prototype.getHeight = function () {
    return this.height;
};

Explosion.prototype.getWidth = function () {
    return this.width;
};

Explosion.prototype.render = function (ctx) {
    //gets right sprite from a spritemap of colums and rows
    var spriteWidth = g_sprites.explosion.width / 9;
    var spriteHeight = g_sprites.explosion.height / 9;
    var column = (this.lifeSpan % 9) - 1;
    var row = Math.floor(this.lifeSpan / 9);
    //draw right sprite at right place
    g_sprites.explosion.customDrawWrappedCentredAt(
        ctx, this.cx, this.cy,
        this.width, this.height, this.rotation,
        spriteWidth * column, spriteHeight * row,
        spriteWidth, spriteHeight
    );

};
