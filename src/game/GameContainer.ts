module game {
	/**
	 * 游戏主容器
	 */
	export class GameContainer extends egret.DisplayObjectContainer{

		/** 容器舞台宽度*/
		private stageW:number;

		/** 游戏舞台高度*/
		private stageH:number;

		/**可滚动背景*/
        private bg:game.bg.BgMap;

		/**开始按钮*/
        private btnStart:egret.Bitmap;

		public constructor() {
			super();
			/**开始侦听加入舞台事件 */
			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
		}

		/**初始化*/
		private onAddToStage(event:egret.Event):void {
			/**移除侦听加入舞台事件 */
			this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);

			this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;            

			//背景
            this.bg = new game.bg.BgMap();//创建可滚动的背景
            this.addChild(this.bg);

			//开始按钮
            this.btnStart = game.util.GameUtil.createBitmapByName("btn_start_png");
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2;//居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2;//居中定位
            this.btnStart.touchEnabled = true;//开启触碰
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameStart,this);//点击按钮开始游戏
            this.addChild(this.btnStart);
			
			

			
		} 

		private gameStart():void {
			/**先移除中间的开始按钮 */
			this.removeChild(this.btnStart);
			this.bg.start();
		}

	}
}