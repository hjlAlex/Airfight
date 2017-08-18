module game.airfight {
	export class ScorePanel extends egret.Sprite{
        private txt:egret.TextField;
		/**再来一次按钮*/
        private btnRestart:egret.Bitmap;

        public constructor() {
            super();
            let g:egret.Graphics = this.graphics;
            g.beginFill(0x000000,0.8);
            g.drawRect(0,0,500,300);
            g.endFill();
            this.txt = new egret.TextField();
            this.txt.width = 500;
            this.txt.height = 300;
            this.txt.textAlign = "center";
            this.txt.textColor = 0xFFFFFF;
            this.txt.size = 24;
            this.txt.y = 60;
            this.addChild(this.txt);

			this.btnRestart = game.util.GameUtil.createBitmapByName("restart_png");
            this.btnRestart.x = (500 - this.btnRestart.width) / 2;//居中定位
            this.btnRestart.y = 150;
			this.addChild(this.btnRestart);

            this.btnRestart.touchEnabled = true;
			this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.restartGame,this);
        }

		private restartGame():void {
			let gameContainer:game.GameContainer = <game.GameContainer>this.parent;
			gameContainer.gameStart();
		}

        public showScore(value:number):void {
            let msg:string = "您的成绩是:\n\n"+value;
            this.txt.text = msg;
        }
    }
}