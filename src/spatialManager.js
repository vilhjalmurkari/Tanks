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

//returns only nearest tank, used by AI in enemytank
//to adjust its angle, it also retuns the distance to
//said tank
findNearestTank: function(posX, posY) {
    //if there is no nearest tank
    var nearestTank = false;
    var nearestTankDist = Infinity;

    //find nearest tank and return it as well as distance
    for (var ID in this._entities) {
        if(this._entities[ID].entity.type == "Tank"){
            var e = this._entities[ID];
            var xdist = posX - e.posX;
            var ydist = posY - e.posY;

            var distance = Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));

            if (distance < nearestTankDist) {
            nearestTank = e.entity;
            nearestTankDist = distance
            }

        }
    }
    return {tank: nearestTank, dist: nearestTankDist};

},

//same as for findNearestTank but for powerup
findNearestPowerup: function(posX, posY) {

    var nearestPowerup = false;
    var nearestPowerupDist = Infinity;
    for (var ID in this._entities) {
        if(this._entities[ID].entity.type == "Powerup"){
            var e = this._entities[ID];
            var xdist = posX - e.posX;
            var ydist = posY - e.posY;

            var distance = Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));

            if (distance < nearestPowerupDist) {
            nearestPowerup = e.entity;
            nearestPowerupDist = distance
            }

        }
    }
    return {powerup: nearestPowerup, dist: nearestPowerupDist};

},

//return entity in radius range
findEntityInRange: function(posX, posY, radius) {


    for (var ID in this._entities) {
        var e = this._entities[ID];
        if(e.radius){
            var xdist = posX - e.posX;
            var ydist = posY - e.posY;

            var distance = Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));

            if (distance < radius + e.radius) {
              return e.entity;
            }
        }

    }

},
//returns a list of all entitys in radius range
//used by explosions to make every entity in range 
//take damage
findAllEntitesInRange: function(posX, posY, radius) {

    var entities = [];
    for (var ID in this._entities) {
        var e = this._entities[ID];
        //if entity has radius, i.e. hitbox is a circle 
        //most entities
        if(e.radius){
            var xdist = posX - e.posX;
            var ydist = posY - e.posY;

            var distance = Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));

            //if inside radius push to array
            if (distance < radius + e.radius) {
              entities.push( e.entity);
            }
        }
        //if entity hitbox is a rectangle, i.e. walls
        else{
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
                //This box and the radius have collided push to array
                entities.push(this._entities[ID].entity);
            }
        }
    }
    return entities;
},


findPowerupInRange: function(posX, posY, radius) {


    for (var ID in this._entities) {
        if(this._entities[ID].entity.type == "Powerup"){
            var e = this._entities[ID];
            if(e.radius){
                var xdist = posX - e.posX;
                var ydist = posY - e.posY;

                var distance = Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));

                if (distance < radius + e.radius) {
                return e.entity;
                }
            }

        }
    }
},

//tanks cant overlap, check only for tank collition 
//standard circle v circle collition
checkTankVTankCollision: function(posX, posY, radius) {

    for (var ID in this._entities) {
        if(this._entities[ID].entity.type == "EnemyTank" 
        || this._entities[ID].entity.type == "Tank"){
            var e = this._entities[ID];
            if(e.radius){
                var xdist = posX - e.posX;
                var ydist = posY - e.posY;

                var distance = Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));

                if (distance < radius + e.radius) {
                return e.entity;
                }
            }

        }
    }
    return false;
},

//checking wall v tank i.e. rectangle v circle collition
//basically: find nearest point on box to the circle and 
//check if it overlaps with circle radius
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

            return this._entities[ID].entity;
        }

        //If the shapes have not collided

        }
    }
    return false;
},

//used to slide along the walls, find what axis 
//tank v wall collition is on (not used)
checkWhereOnBox: function(x, y, r, entity) {

      var b = {
          x: entity.cx,
          y: entity.cy,
          h: entity.height,
          w: entity.width
      }

      var cX, cY;

      //Find closest x offset
      if( x < b.x )
      {
          cX = b.x;
      }
      else if( x > b.x + b.w )
      {
          cX = b.x + b.w;
      }
      else
      {
          cX = x;
      }

      //Find closest y offset

      if( y < b.y )
      {
          cY = b.y;
      }
      else if( y > b.y + b.h )
      {
          cY = b.y + b.h;
      }
      else
      {
          cY = y;
      }

      //This box and the circle have collided
      var whereOnBox = 0;
      if (( x < cX || x  > cX) && ( y < cY || y > cY)) {
        whereOnBox = 2;
      }

      else if ( x < cX || x  > cX) {
        console.log("left/right collision");
        whereOnBox = -1;
      }

      else if ( y < cY || y > cY) {
        console.log("top/bottom collision");
        whereOnBox = 1;
      }

  return whereOnBox;

},

//red outline if x is pressed
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
