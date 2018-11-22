// ====
// Floor
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//object to refer to when laying the tiles, size and such
var g_floor = {

    tileLength: 20,
    tileHeight: 20,

    startX: 0,
    startY: 0,
    height: 30,
    width:  30,

};

// A generic contructor which accepts an arbitrary descriptor object
function Floor(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = this.sprite || g_sprites.floor;

};

Floor.prototype = new Entity();

Floor.prototype.update = function (du) {

};

//simple render function
Floor.prototype.render = function (ctx) {

    this.sprite.drawCustomImgAt(
        ctx, this.cx, this.cy, this.width, this.height
        );

};
