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

    if (isNaN(radius) || radius == 0) {
      var height = entity.getHeight();
      var width = entity.getWidth();

      this._entities[spatialID] = {entity,
                                   posX: pos.posX,
                                   posY: pos.posY,
                                   height: height,
                                   width: width
                                 };
      return;
    }

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

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
      var e = this._entities[ID];

      if (isNaN(e.radius)) {
        util.box(ctx, e.posX, e.posY, e.width, e.height);

      } else {
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
      }
    }
    ctx.strokeStyle = oldStyle;
}

}
