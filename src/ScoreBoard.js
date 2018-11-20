
var winnerSprite;
var loserSprite;

var gameOverScr = {
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

    update : function (du) {
        if(this.cy > g_canvas.height/2) this.cy += this.dropSpeed;
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
      g_sprites.redX.drawCustomImgAt(ctx, loserCx - this.loserSprite.width/2,
                                bothCy - this.loserSprite.height/2,
                                this.loserSprite.width, this.loserSprite.height);

      winnerSprite.drawCentredAt(ctx, winnerCx, bothCy, 0);

      g_sprites.goBack.drawCentredAt(ctx, this.cx, this.cy, 0);
    }

};
