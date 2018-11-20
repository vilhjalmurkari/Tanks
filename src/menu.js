
// This is a class that handles the menu screen in the beginning
// of the game

var g_menuScreenOn = false;
var hover1player = false;
var hover2player = false;
var hoverHTP = false;
var hoverGoBack = false;

var twoPlayers = false;

var mainScreen = true;
var mapScreen = false;
var htpScreen = false;

var twoPlayers;
var numEnemies = 1;
var enemylives = 3;
var gameMusic = new Audio(
  "../sounds/gameMusic.mp3");

var menu = {

  screen : function(ctx) {

    var menu = g_sprites.menuScr;


    var btn1Y = 240;
    var btn2Y = 300;
    var btn3Y = 360;
    var btnGBY = 500;

    menu.drawCustomImgAt(ctx, 0, 0, menu.width, menu.height);

    if (mainScreen) drawMainScreen(ctx, btn1Y, btn2Y, btn3Y);
    if (mapScreen) drawMapScreen(ctx,btnGBY);
    if (htpScreen) drawHTPScreen(ctx,btnGBY);



    checkMouseHover(g_mouseX, g_mouseY, btn1Y, btn2Y, btn3Y, btnGBY);
    checkMouseClick(g_mouseXClick, g_mouseYClick, btn1Y, btn2Y, btn3Y, btnGBY);
  }

}

function drawMainScreen(ctx, btn1Y, btn2Y, btn3Y) {
  var tankstext = g_sprites.tankstext;

  var button1 = g_sprites.btnPlayer1;
  var button1hover = g_sprites.btnPlayer1hover;
  var button2 = g_sprites.btnPlayer2;
  var button2hover = g_sprites.btnPlayer2hover;
  var buttonHTP = g_sprites.btnHTP;
  var buttonHTPhover = g_sprites.btnHTPhover;

  tankstext.drawCustomImgAt(ctx, g_canvas.width/2 - (tankstext.width*0.9)/2, 50, tankstext.width*0.9, tankstext.height*0.9);

  if (hover1player)
    button1hover.drawCustomImgAt(ctx, 220, btn1Y, button1hover.width, button1hover.height);
  else
    button1.drawCustomImgAt(ctx, 220, btn1Y, button1.width, button1.height);

  if (hover2player)
    button2hover.drawCustomImgAt(ctx, 220, btn2Y, button2hover.width, button2hover.height);
  else
    button2.drawCustomImgAt(ctx, 220, btn2Y, button2.width, button2.height);

  if (hoverHTP)
    buttonHTPhover.drawCustomImgAt(ctx, 220, btn3Y, buttonHTP.width, buttonHTP.height);
  else
    buttonHTP.drawCustomImgAt(ctx, 220, btn3Y, buttonHTP.width, buttonHTP.height);

}

function drawMapScreen(ctx, btnGBY) {
  var level1 = g_sprites.level1;
  var level2 = g_sprites.level2;
  var level3 = g_sprites.level3;
  var unknown = g_sprites.unknown;

  var levels = [{level: g_sprites.level1, x: 150, y: 150},
                {level: g_sprites.level2, x: 350, y: 150},
                {level: g_sprites.level3, x: 150, y: 350},
                {level: g_sprites.unknown, x: 350, y: 350}];

  ctx.font="40px Arial";

  ctx.fillText("Select a map",200,75);

  for (var i = 0; i < levels.length; i++) {

    if (levels[i].level.width == 115) {
      drawLevelImage(ctx, levels[i].level, levels[i].x-7.5, levels[i].y-7.5);
    } else {
      drawLevelImage(ctx, levels[i].level, levels[i].x, levels[i].y);
    }

  }

  drawGBbutton(ctx, btnGBY);

}

function drawLevelImage(ctx, level, x, y) {
  level.drawCustomImgAt(ctx, x, y, level.width, level.height);
}

function drawHTPScreen(ctx, btnGBY) {

  ctx.font="20px Arial";

  ctx.fillText("The objective of the game is to kill the opponent",100,100);

  drawGBbutton(ctx, btnGBY);
}

function drawGBbutton(ctx, btnGBY) {
  var goBack =  g_sprites.goBack;
  var goBackhover = g_sprites.goBackhover;

  if (hoverGoBack)
    goBackhover.drawCustomImgAt(ctx, 50, btnGBY, goBackhover.width, goBackhover.height);
  else
    goBack.drawCustomImgAt(ctx, 50, btnGBY, goBack.width, goBack.height);
}

function checkMouseClick(x,y, btn1Y, btn2Y, btn3Y, btnGBY) {
  var w = g_sprites.btnHTP.width/2;
  var h = g_sprites.btnHTP.height/2;

  if (mainScreen) {
    if ( g_canvas.width/2 - w < x && x < g_canvas.width/2 + w ) {
      if ( (btn1Y < y && y < btn1Y + h*2) || (btn2Y < y && y < btn2Y + h*2) ) {
        mapScreen = true;
        mainScreen = false;
        htpScreen = false;
        twoPlayers = false;

        if (btn2Y < y && y < btn2Y + h*2) twoPlayers = true;
      }

      if ( btn3Y < y && y < btn3Y + h*2 ) {
        mapScreen = false;
        mainScreen = false;
        htpScreen = true;
      }
    }
  }

  // checks on the go back button
  if ( (mapScreen || htpScreen) && (btnGBY < y && y < btnGBY + h*2)) {
    if ( 130 - w < x && x < 130 + w) {
      mapScreen = false;
      mainScreen = true;
      htpScreen = false;
    }
  }

  if (mapScreen) {

    var imgH = g_sprites.level1.height/2;
    var imgW = g_sprites.level1.width/2;

    if(200 - imgW < x && x < 200 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
        entityManager.init(g_brickwall.level1);
      }
      if(400 - imgH < y && y < 400 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
        entityManager.init(g_brickwall.level3);
      }
    }

    if(400 - imgW < x && x < 400 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
        entityManager.init(g_brickwall.level2);
      }
      if(400 - imgH < y && y < 400 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
        entityManager.init(g_brickwall.levelRandom);
      }
    }
  }

  g_mouseXClick = 0;
  g_mouseYClick = 0;
}

function checkMouseHover(x, y, btn1Y, btn2Y, btn3Y, btnGBY) {
  var w = g_sprites.btnHTP.width/2;
  var h = g_sprites.btnHTP.height/2;

  // check if you are inside one of the three button on front page
  if (mainScreen) {
    if ( g_canvas.width/2 - w < x && x < g_canvas.width/2 + w ) {
      if ( btn1Y < y && y < btn1Y + h*2 ) {
        hover1player = true;
        return;
      }

      if ( btn2Y < y && y < btn2Y + h*2 ) {
        hover2player = true;
        return;
      }

      if ( btn3Y < y && y < btn3Y + h*2 ) {
        hoverHTP = true;
        return;
      }
    }
  }

  // checks if we hover over go back button
  if ((mapScreen || htpScreen) && (btnGBY < y && y < btnGBY + h*2)) {
    if ( 130 - w < x && x < 130 + w) {
      hoverGoBack = true;
      return;
    }
  }

  if (mapScreen) {

    var imgH = g_sprites.level1.height/2;
    var imgW = g_sprites.level1.width/2;

    if(200 - imgW < x && x < 200 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        changeImgSize(g_sprites.level1, 115, 115);
        return;
      }
      if(400 - imgH < y && y < 400 + imgH) {
        changeImgSize(g_sprites.level3, 115, 115);
        return;
      }
    }

    if(400 - imgW < x && x < 400 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        changeImgSize(g_sprites.level2, 115, 115);
        return;
      }
      if(400 - imgH < y && y < 400 + imgH) {
        changeImgSize(g_sprites.unknown, 115, 115);
        return;
      }
    }

    resetMapImage();


  }

  hover1player = false;
  hover2player = false;
  hoverHTP = false;
  hoverGoBack = false;
}

function changeImgSize(img, w, h) {
  img.height = h;
  img.width = w;
}

function resetMapImage() {
  g_sprites.level1.height = 100;
  g_sprites.level1.width = 100;

  g_sprites.level2.height = 100;
  g_sprites.level2.width = 100;

  g_sprites.level3.height = 100;
  g_sprites.level3.width = 100;

  g_sprites.unknown.height = 100;
  g_sprites.unknown.width = 100;

}
