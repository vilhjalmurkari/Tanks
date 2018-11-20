/*
function GameOverScr(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.setWinner(this.loser);
    // Set normal drawing scale, and warp state off
    //this._scale = 1;
};

GameOverScr.prototype = new Entity();
GameOverScr.prototype.loser;
GameOverScr.prototype.cx = g_canvas.width/2;
GameOverScr.prototype.cy = -g_canvas.height/2;
GameOverScr.prototype.velY = 3;
GameOverScr.prototype.winnerSprite;
GameOverScr.prototype.loserSprite;

GameOverScr.prototype.setWinner = function (loser) {
    if(loser === 2) {
      this.winnerSprite = g_sprites.tank1;
      this.loserSprite = g_sprites.tank2;
    }
    else {
      this.winnerSprite = g_sprites.tank2;
      this.loserSprite = g_sprites.tank1;
    }
}

GameOverScr.prototype.update = function (du) {
    this.cy += this.velY;
    if(this.cy === g_canvas.height/2) this.velY = 0;
}

GameOverScr.prototype.render = function (ctx) {
    var loserCx = this.cx - g_canvas.width/4;
    var winnerCx = this.cx + g_canvas.width/4;
    var bothCy = this.cy + g_canvas.height/4;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(this.cx - g_canvas.width/2, this.cy - g_canvas.height/2,
                  g_canvas.width, g_canvas.height);
    ctx.restore();

    g_sprites.gameOverIMG.drawCentredAt(ctx, this.cx, this.cy - g_canvas.height/4, 0);

    this.loserSprite.drawCentredAt(ctx, loserCx, bothCy, 0);
    g_sprites.redX.drawCustomImgAt(ctx, loserCx - this.loserSprite.width/2,
                              bothCy - this.loserSprite.height/2,
                              this.loserSprite.width, this.loserSprite.height);

    this.winnerSprite.drawCentredAt(ctx, winnerCx, bothCy, 0);

    g_sprites.goBack.drawCentredAt(ctx, this.cx, this.cy, 0);

};
*/


var winnerSprite;
var loserSprite;
var hoverBtn = false;

var gameOverScreen = {
    cx : cx = g_canvas.width/2,
    cy : -g_canvas.height/2,
    dropSpeed : 3,

    setWinner : function(loser) {
      if(loser === 2) {
        winnerSprite = g_sprites.tank1;
        loserSprite = g_sprites.tank2;
      }
      else {
        winnerSprite = g_sprites.tank2;
        loserSprite = g_sprites.tank1;
      }
    },

    reset : function () {
        this.cx = g_canvas.width/2;
        this.cy = -g_canvas.height/2;
    },

    update : function (du) {
        if(this.cy < g_canvas.height/2) this.cy += this.dropSpeed;
    },

    render : function (ctx) {
      var loserCx = this.cx - g_canvas.width/4;
      var winnerCx = this.cx + g_canvas.width/4;
      var bothCy = this.cy + g_canvas.height/4;

      ctx.save();
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.7;
      ctx.fillRect(this.cx - g_canvas.width/2, this.cy - g_canvas.height/2,
                    g_canvas.width, g_canvas.height);
      ctx.restore();

      g_sprites.gameOverIMG.drawCentredAt(ctx, this.cx, this.cy - g_canvas.height/4, 0);

      loserSprite.drawCentredAt(ctx, loserCx, bothCy, 0);
      g_sprites.redX.drawCustomImgAt(ctx, loserCx - loserSprite.width/2,
                                bothCy - loserSprite.height/2,
                                loserSprite.width, loserSprite.height);

      winnerSprite.drawCentredAt(ctx, winnerCx, bothCy, 0);

      gOcheckMouseHover(g_mouseX, g_mouseY, this.cx, this.cy);
      gOcheckMouseClick(g_mouseXClick, g_mouseYClick,this.cx, this.cy);

      if(hoverBtn){
      g_sprites.goBackhover.drawCentredAt(ctx, this.cx, this.cy, 0);
      } else g_sprites.goBack.drawCentredAt(ctx, this.cx, this.cy, 0);


    }


};

function gOcheckMouseClick(x,y, btnX, btnY) {
  var w = g_sprites.goBack.width/2;
  var h = g_sprites.goBack.height/2;

  if(x > btnX - w  && x < btnX + w) {
      if(y > btnY - h  && y < btnY + h) {
          //g_mouseXClick = 0;
          //g_mouseYClick = 0;
          gameOverScreen.reset();
          resetMenu();

          isGameOver = false;

      }
  }
  g_mouseXClick = 0;
  g_mouseYClick = 0;
}

function gOcheckMouseHover(x, y, btnX, btnY) {
  var w = g_sprites.goBack.width/2;
  var h = g_sprites.goBack.height/2;

  if(x > btnX - w  && x < btnX + w) {
      if(y > btnY - h  && y < btnY + h) {
          hoverBtn = true;

      }
  }
}
