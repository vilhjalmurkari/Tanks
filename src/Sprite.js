// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image) {
    this.image = image;

    this.width = image.width;
    this.height = image.height;
    this.scale = 1;
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image, 
                  x, y);
};

Sprite.prototype.drawCustomImgAt = function (ctx, x, y, width, height) {

    ctx.save();
    //ctx.translate(x, y);
    //ctx.rotate(rotation);
    //ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  x, y,
                  width, height);
    
    ctx.restore();

};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  -w/2, -h/2);
    
    ctx.restore();
};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};

Sprite.prototype.customDrawCentredAt = function (ctx, cx, cy, width, height, rotation) {
    
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  -width/2, -height/2,
                  width, height);
    
    ctx.restore();
};

Sprite.prototype.customDrawWrappedCentredAt = function (ctx, cx, cy, width, height, rotation) {
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.customDrawWrappedVerticalCentredAt(ctx, cx, cy, width, height, rotation);
    
    // Left and Right wraps
    this.customDrawWrappedVerticalCentredAt(ctx, cx - sw, cy, width, height, rotation);
    this.customDrawWrappedVerticalCentredAt(ctx, cx + sw, cy, width, height, rotation);
};

Sprite.prototype.customDrawWrappedVerticalCentredAt = function (ctx, cx, cy, width, height, rotation) {
    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.customDrawCentredAt(ctx, cx, cy, width, height, rotation);
    
    // Top and Bottom wraps
    this.customDrawCentredAt(ctx, cx, cy - sh, width, height, rotation);
    this.customDrawCentredAt(ctx, cx, cy + sh, width, height, rotation);
};