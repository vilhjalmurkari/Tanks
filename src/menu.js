
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
  var button1 = g_sprites.btnPlayer1;
  var button1hover = g_sprites.btnPlayer1hover;
  var button2 = g_sprites.btnPlayer2;
  var button2hover = g_sprites.btnPlayer2hover;
  var buttonHTP = g_sprites.btnHTP;
  var buttonHTPhover = g_sprites.btnHTPhover;

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
  var map = g_sprites.map;

  ctx.font="40px Arial";

  ctx.fillText("Select a map",200,75);


  map.drawCustomImgAt(ctx, 150, 150, map.width, map.height);
  map.drawCustomImgAt(ctx, 350, 150, map.width, map.height);
  map.drawCustomImgAt(ctx, 150, 350, map.width, map.height);
  map.drawCustomImgAt(ctx, 350, 350, map.width, map.height);

  drawGBbutton(ctx, btnGBY);

}

function drawHTPScreen(ctx, btnGBY) {

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

    var imgH = g_sprites.map.height/2;
    var imgW = g_sprites.map.width/2;

    if(200 - imgW < x && x < 200 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
      }
      if(400 - imgH < y && y < 400 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
      }
    }

    if(400 - imgW < x && x < 400 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
      }
      if(400 - imgH < y && y < 400 + imgH) {
        g_menuScreenOn = true;
        createInitialTanks(twoPlayers);
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

    var imgH = g_sprites.map.height/2;
    var imgW = g_sprites.map.width/2;

    if(200 - imgW < x && x < 200 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        //console.log(23)
        return;
      }
      if(400 - imgH < y && y < 400 + imgH) {
        //console.log(23);
        return;
      }
    }

    if(400 - imgW < x && x < 400 + imgW) {

      if(200 - imgH < y && y < 200 + imgH) {
        //console.log(23);
        return;
      }
      if(400 - imgH < y && y < 400 + imgH) {
        //console.log(23);
        return;
      }
    }

    g_sprites.map.height = 100;
    g_sprites.map.width = 100;
  }

  hover1player = false;
  hover2player = false;
  hoverHTP = false;
  hoverGoBack = false;
}
