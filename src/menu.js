
// This is a class that handles the menu screen in the beginning
// of the game

var g_menuScreenOn = false;
var hover1player = false;
var hover2player = false;
var hoverHTP = false;

var twoPlayers = false;

var menu = {

  firstScreen : function(ctx) {

    var menu = g_sprites.menuScr;
    var button1 = g_sprites.btnPlayer1;
    var button1hover = g_sprites.btnPlayer1hover;
    var button2 = g_sprites.btnPlayer2;
    var button2hover = g_sprites.btnPlayer2hover;
    var buttonHTP = g_sprites.btnHTP;
    var buttonHTPhover = g_sprites.btnHTPhover;

    var btn1Y = 240;
    var btn2Y = 300;
    var btn3Y = 360;

    checkMouseHover(g_mouseX, g_mouseY, btn1Y, btn2Y, btn3Y);
    checkMouseClick(g_mouseXClick, g_mouseYClick, btn1Y, btn2Y, btn3Y);

    menu.drawCustomImgAt(ctx, 0, 0, menu.width, menu.height);

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





}


function checkMouseHover(x, y, btn1Y, btn2Y, btn3Y) {
  var w = g_sprites.btnHTP.width/2;
  var h = g_sprites.btnHTP.height/2;

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

  hover1player = false;
  hover2player = false;
  hoverHTP = false;

}

function checkMouseClick(x,y, btn1Y, btn2Y, btn3Y) {
  var w = g_sprites.btnHTP.width/2;
  var h = g_sprites.btnHTP.height/2;

  if ( g_canvas.width/2 - w < x && x < g_canvas.width/2 + w ) {
    if ( btn1Y < y && y < btn1Y + h*2 ) {
      g_menuScreenOn = true;
    }

    if ( btn2Y < y && y < btn2Y + h*2 ) {
      g_menuScreenOn = true;
      twoPlayers = true;
    }

    if ( btn3Y < y && y < btn3Y + h*2 ) {
      g_menuScreenOn = true;
    }
  }

  g_mouseXClick = 0;
  g_mouseYClick = 0

}
