// =========
// TANKS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Walls.js
Bullet.js
Tanks.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialTanks() {

    entityManager.generateTank({
        cx : 270,
        cy : 255,
        KEY_FORWARD : 'W'.charCodeAt(0),
        KEY_BACKWARDS  : 'S'.charCodeAt(0),
        KEY_LEFT   : 'A'.charCodeAt(0),
        KEY_RIGHT  : 'D'.charCodeAt(0),
        KEY_FIRE   : ' '.charCodeAt(0),
        sprite : g_sprites.tank1

    });

    entityManager.generateTank({
        cx : 270,
        cy : 100,
        KEY_FORWARD : 38,
        KEY_BACKWARDS  : 40,
        KEY_LEFT   : 37,
        KEY_RIGHT  : 39,
        KEY_FIRE   : 13,
        sprite : g_sprites.tank2

    });

}
Tank.prototype.KEY_FORWARD = 'W'.charCodeAt(0);
Tank.prototype.KEY_BACKWARDS  = 'S'.charCodeAt(0);
Tank.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Tank.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Tank.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Tank.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,

        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,

        sprite : g_sprites.ship2
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        tank1   : "../images/Tank1.png",
        tank2  : "../images/Tank2.png",
        box1   : "../images/Box1.png",
        box2   : "../images/Box2.png",
        box3   : "../images/Box3.png",
        box4   : "../images/Box4.png",
        floor   : "../images/floor.jpg",
        bullet   : "../images/bullet.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.tank1  = new Sprite(g_images.tank1);
    g_sprites.tank2 = new Sprite(g_images.tank2);
    g_sprites.box1  = new Sprite(g_images.box1);
    g_sprites.box2  = new Sprite(g_images.box2);
    g_sprites.box3  = new Sprite(g_images.box3);
    g_sprites.box4  = new Sprite(g_images.box4);
    g_sprites.floor  = new Sprite(g_images.floor);

    g_sprites.bullet = new Sprite(g_images.bullet);

    entityManager.init();
    createInitialTanks();

    main.init();
}

// Kick it off
requestPreloads();
