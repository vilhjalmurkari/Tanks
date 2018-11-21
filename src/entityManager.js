/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

// What we have
_floor   : [],
_walls   : [],
_tanks   : [],
_enemyTanks : [],
_bullets : [],
_bombs   : [],
_powerUp : [],
_explosions : [],

// "PRIVATE" METHODS

_generateWalls : function(level) {
//go through hardcoded arrays and set its location and size as well
//as life, life is used as the walls id, what type of wall it is
  var brick = level;

  for (var i = 0; i < brick.length; i++) {
    for (var j = 0; j < brick[i].length; j++) {
      if ( brick[i][j] != 0) {
        var wallType = brick[i][j];
        //use 9 to represent random wall
        if(wallType == 9){
            wallType = 1 + Math.floor(Math.random()*4)
            //less likely to be explosive barrel
            if(Math.random()<0.1){
                wallType = 5;
            }
        }
        this.generateWall({
          cx: j*g_brickwall.width + g_brickwall.startX,
          cy: i*g_brickwall.height + g_brickwall.startY,

          width: g_brickwall.width,
          height: g_brickwall.height,

          life: wallType
        });
      }
    }
  }

},

//simple function to lay the floor tiles
_generateFloor : function() {

    var tile = g_floor.tiles;

    for (var i = 0; i < tile.length; i++) {
      for (var j = 0; j < tile[i].length; j++) {

          this.generateFloor({
            cx: j*g_floor.width + g_floor.startX,
            cy: i*g_floor.height + g_floor.startY,

            width: g_floor.width,
            height: g_floor.height,

          });

      }
    }

  },



_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._floor,
                        this._walls,
                        this._tanks,
                        this._enemyTanks,
                        this._bullets,
                        this._explosions,
                        this._bombs,
                        this._powerUp];
},

init: function(level) {
    this._generateWalls(level);
    this._generateFloor();
},
//makes new bullet
fireBullet: function(cx, cy, velX, velY, rotation, bulletType) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation,
        bulletType : bulletType
    }));
},
//makes new bomb
fireBomb: function(cx, cy, velX, velY, rotation) {
    this._bombs.push(new Bomb({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation
    }));
},
//makes an explosion
makeExplosion: function(cx, cy, radius) {
    this._explosions.push(new Explosion({
        cx   : cx,
        cy   : cy,
        width : radius*2,
        height : radius*2,
        radius : radius,
    }));
},
//makes a powerup
makePowerup: function(cx, cy) {
    this._powerUp.push(new Powerup({
        cx   : cx,
        cy   : cy,
    }));
},

//make all kinds of objects

generateWall : function(descr) {
    this._walls.push(new Wall(descr));
},

generateFloor : function(descr) {
    this._floor.push(new Floor(descr));
},

generateTank : function(descr) {
    this._tanks.push(new Tank(descr));
},

generateEnemyTank : function(descr) {
    this._enemyTanks.push(new EnemyTank(descr));
},

killAll : function () {
  for (var c = 0; c < this._categories.length; ++c) {

      var aCategory = this._categories[c];


      for (var i = 0; i < aCategory.length; ++i) {

          aCategory[i].kill();

      }
  }
},
//update all categories
update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }


},
//render all categories
render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks &&
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
