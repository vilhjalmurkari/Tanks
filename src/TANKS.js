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

function createInitialTanks(twoPlayer) {
    //alwas generate player 1
    entityManager.generateTank({
        cx : 60,
        cy : 540,
        //arrow keys
        KEY_FORWARD : 38,
        KEY_BACKWARDS  : 40,
        KEY_LEFT   : 37,
        KEY_RIGHT  : 39,
        KEY_FIRE   : ' '.charCodeAt(0),
        sprite : g_sprites.tank1,
        player : 1
    });
    //if 2 player is selected generate another tank and a enemytank
    //at random location
    if(twoPlayer){
        entityManager.generateEnemyTank({
            cx : 270,
            cy : 350,
            sprite : g_sprites.tank3,
            player : 3,
            randomLoc: true,
        });

        entityManager.generateTank({
            cx : 540,
            cy : 60,
            //WDSA keys
            KEY_FORWARD : 'W'.charCodeAt(0),
            KEY_BACKWARDS  : 'S'.charCodeAt(0),
            KEY_LEFT   : 'A'.charCodeAt(0),
            KEY_RIGHT  : 'D'.charCodeAt(0),
            //1 key
            KEY_FIRE   : 49,
            sprite : g_sprites.tank2,
            player : 2
          });
    }
    //one player is selected so we make an enemy at a specific place
    else{
        entityManager.generateEnemyTank({
            cx : 540,
            cy : 60,
            sprite : g_sprites.tank3,
            player : 3,
            randomLoc: false,
        });
    }
}

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

    //if(!isGameOver)
    entityManager.update(du);

    if(isGameOver)
    gameOverScreen.update(du);

    // Prevent perpetual firing!
    eatKey(Tank.prototype.KEY_FIRE);
}

var screen;
var isGameOver = false;

//when you either win or lose
function gameOver (loser) {
    gameOverScreen.setWinner(loser);
    entityManager.killAll();
    isGameOver = true;
    playBurningAudio();
}

function restartMusic () {
  gameMusic.currentTime = 0.0;
  gameMusic.volume = 1.0;
  gameMusic.play();
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {
      if (eatKey(KEY_MIXED))
      g_allowMixedActions = !g_allowMixedActions;

      if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

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

    if (g_menuScreenOn) {
      entityManager.render(ctx);

      if (g_renderSpatialDebug) spatialManager.render(ctx);

    } else {
      menu.screen(ctx);
    }


    if (isGameOver) gameOverScreen.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        tank1   : "../images/Tank1.png",
        tank2  : "../images/Tank2.png",
        tank3  : "../images/Tank3.png",
        box1   : "../images/Box1.png",
        box2   : "../images/Box2.png",
        box3   : "../images/Box3.png",
        box4   : "../images/Box4.png",
        floor   : "../images/floor.jpg",
        bullet   : "../images/bullet.png",
        explosion   : "../images/explosion.png",
        bomb   : "../images/bomb.png",
        shield : "../images/shield.png",
        speed : "../images/speed.png",
        reaper : "../images/reaper.png",
        firepower : "../images/firepower.png",
        barrel   : "../images/Barrel.png",
        turret   : "../images/turret.png",
        gameOverIMG : "../images/gameOver.png",
        redX : "../images/redX.png",
        player1: "../images/button_1player.png",
        player1hover: "../images/button_1playerhover.png",
        player2: "../images/button_2player.png",
        player2hover: "../images/button_2playerhover.png",
        howToPlay: "../images/button_how-to-play.png",
        howToPlayhover: "../images/button_how-to-playhover.png",
        goBack: "../images/button_go-back.png",
        goBackhover: "../images/button_go-backhover.png",
        menuScr: "../images/MenuScreen.png",
        level1: "../images/level1.png",
        level2: "../images/level2.png",
        level3: "../images/level3.png",
        unknown: "../images/unknown.png",
        tankstext: "../images/TANKStext.png",
        fire: "../images/fire.png"


    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    //Gameplay
    g_sprites.tank1  = new Sprite(g_images.tank1);
    g_sprites.tank2 = new Sprite(g_images.tank2);
    g_sprites.tank3 = new Sprite(g_images.tank3);
    g_sprites.box1  = new Sprite(g_images.box1);
    g_sprites.box2  = new Sprite(g_images.box2);
    g_sprites.box3  = new Sprite(g_images.box3);
    g_sprites.box4  = new Sprite(g_images.box4);
    g_sprites.floor  = new Sprite(g_images.floor);
    g_sprites.bullet = new Sprite(g_images.bullet);
    g_sprites.explosion = new Sprite(g_images.explosion);
    g_sprites.barrel = new Sprite(g_images.barrel);
    g_sprites.turret = new Sprite(g_images.turret);
    //Powerups
    g_sprites.bomb = new Sprite(g_images.bomb);
    g_sprites.shield = new Sprite(g_images.shield);
    g_sprites.speed = new Sprite(g_images.speed);
    g_sprites.reaper = new Sprite(g_images.reaper);
    g_sprites.firepower = new Sprite(g_images.firepower);
    //GameOptions
    g_sprites.gameOverIMG = new Sprite(g_images.gameOverIMG);
    g_sprites.redX = new Sprite(g_images.redX);
    g_sprites.btnPlayer1 = new Sprite(g_images.player1);
    g_sprites.btnPlayer1hover = new Sprite(g_images.player1hover);
    g_sprites.btnPlayer2 = new Sprite(g_images.player2);
    g_sprites.btnPlayer2hover = new Sprite(g_images.player2hover);
    g_sprites.btnHTP = new Sprite(g_images.howToPlay);
    g_sprites.btnHTPhover = new Sprite(g_images.howToPlayhover);
    g_sprites.menuScr = new Sprite(g_images.menuScr);
    g_sprites.goBack = new Sprite(g_images.goBack);
    g_sprites.goBackhover = new Sprite(g_images.goBackhover);
    g_sprites.level1 = new Sprite(g_images.level1);
    g_sprites.level2 = new Sprite(g_images.level2);
    g_sprites.level3 = new Sprite(g_images.level3);
    g_sprites.unknown = new Sprite(g_images.unknown);
    g_sprites.tankstext = new Sprite(g_images.tankstext);
    g_sprites.fire = new Sprite(g_images.fire);

    main.init();
}

// Kick it off
requestPreloads();
