
var winnerSprite;
var loserSprite;
var hoverBtn = false;
var burningAudio = new Audio("../sounds/fire6.mp3");

var gameOverScreen = {
    cx : cx = g_canvas.width/2,
    cy : -g_canvas.height/2,
    dropSpeed : 3,
    lifeCntr  : 0,

    //Pairs winner and loser with the appropriate tank sprite
    setWinner : function(loser) {
      if(loser === 3) {
          winnerSprite = g_sprites.tank1;
          loserSprite = g_sprites.tank3;
        }
      else if(loser === 2) {
        winnerSprite = g_sprites.tank1;
        loserSprite = g_sprites.tank2;
      }
      else {
          if(twoPlayers){
              winnerSprite = g_sprites.tank2;
          }
          else{
              winnerSprite = g_sprites.tank3;
          }
        loserSprite = g_sprites.tank1;
      }
    },

    //Puts the screen in starting position
    reset : function () {
        this.cx = g_canvas.width/2;
        this.cy = -g_canvas.height/2;
        this.lifeCntr = 0;
    },

    update : function (du) {
        //Fade out the music
        if(gameMusic.volume < 0.01){
          gameMusic.pause();
        }
        else{
          gameMusic.volume -= 0.001;
        }

        this.lifeCntr += 0.1;

        if(this.cy < g_canvas.height/2) this.cy += this.dropSpeed;

        gOcheckMouseHover(g_mouseX, g_mouseY, this.cx, this.cy);
        gOcheckMouseClick(g_mouseXClick, g_mouseYClick,this.cx, this.cy);
    },

    render : function (ctx) {
      var loserCx = this.cx - g_canvas.width/4;
      var winnerCx = this.cx + g_canvas.width/4;
      var bothCy = this.cy + g_canvas.height/4;

      this.drawShading(ctx); //Draw background "shade"

      g_sprites.gameOverIMG.drawCentredAt(ctx, this.cx, this.cy - g_canvas.height/4, 0);

      this.drawLoser(ctx, loserCx, bothCy)

      //Draw winner's tank
      winnerSprite.drawCentredAt(ctx, winnerCx, bothCy, 0);

      if(hoverBtn){
      g_sprites.goBackhover.drawCentredAt(ctx, this.cx, this.cy, 0);
      } else g_sprites.goBack.drawCentredAt(ctx, this.cx, this.cy, 0);


    },

    drawShading : function (ctx) {
      ctx.save();
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.7;
      ctx.fillRect(this.cx - g_canvas.width/2, this.cy - g_canvas.height/2,
                    g_canvas.width, g_canvas.height);
      ctx.restore();
    },

    //Draws loser's tank in flames
    drawLoser : function (ctx, loserCx, bothCy) {
      //Draw Loser's Tank
      loserSprite.drawCentredAt(ctx, loserCx, bothCy, 0);

      //Flame animation
      var spriteWidth = g_sprites.fire.width /10;
      var spriteHeight = g_sprites.fire.height /6;
      var column = Math.floor(this.lifeCntr %10);
      var row = Math.floor(this.lifeCntr %6);
      g_sprites.fire.customDrawCentredAt(
        ctx, loserCx, bothCy,
        loserSprite.width*2, loserSprite.height, 0,
        spriteWidth * column, spriteHeight * row,
        spriteWidth, spriteHeight
      );

    }


};

function gOcheckMouseClick(x,y, btnX, btnY) {
  var w = g_sprites.goBack.width/2;
  var h = g_sprites.goBack.height/2;

  if(x > btnX - w  && x < btnX + w) {
      if(y > btnY - h  && y < btnY + h) {
          gameOverScreen.reset();
          resetMenu();
          restartMusic();
          burningAudio.pause();

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
          return;
      }
  }
  hoverBtn = false;
}

function playBurningAudio () {
    burningAudio.loop = true;
    burningAudio.play();
}
