/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    return this._nextSpatialID++;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

    var radius = entity.getRadius();


    this._entities[spatialID] = {entity,
                                 posX: pos.posX,
                                 posY: pos.posY,
                                 radius: radius
                               };

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    delete this._entities[spatialID];

},

findEntityInRange: function(posX, posY, radius) {

    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        var xdist = posX - e.posX;
        var ydist = posY - e.posY;

        var distance = Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));

        if (distance < radius + e.radius) {
          return e.entity;
        }
    }

},

checkBoxCollision: function(posX, posY, radius) {
    for (var ID in this._entities) {
        if(this._entities[ID].entity.type == "Wall" && this._entities[ID].entity.life > 1){
             //Closest point on collision box
        var a = {
            x: posX,
            y: posY,
            r: radius
        }
        var b = {
            x: this._entities[ID].posX,
            y: this._entities[ID].posY,
            h: this._entities[ID].entity.height,
            w: this._entities[ID].entity.width
        }

        var cX, cY;

        //Find closest x offset
        if( a.x < b.x )
        {
            cX = b.x;
        }
        else if( a.x > b.x + b.w )
        {
            cX = b.x + b.w;
        }
        else
        {
            cX = a.x;
        }

        //Find closest y offset
        
        if( a.y < b.y )
        {
            cY = b.y;
        }
        else if( a.y > b.y + b.h )
        {
            cY = b.y + b.h;
        }
        else
        {
            cY = a.y;
        }

        //If the closest point is inside the circle
        if( util.distSq( a.x, a.y, cX, cY ) < a.r * a.r )
        {
            //This box and the circle have collided
            return this._entities[ID].entity;
        }
    
        //If the shapes have not collided
        
        }
    }
    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
