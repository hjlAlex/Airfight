module game.bg {	
	/**
	 * 可滚动背景
	 */
	export class BgMap extends egret.DisplayObjectContainer{		
		
        /**stage宽*/
        private stageW:number;
        /**stage高*/
        private stageH:number;

		/**填充背景需要的纹理图片*/
		private bgArry:egret.Bitmap[];
        /**填充背景需要的纹理图片数量*/
        private rowCount:number;

        /**纹理本身的高度*/
        private textureHeight:number;
        /**控制滚动速度*/
        private speed:number = 2;

		public constructor() {
			super();
			/**开始侦听加入舞台事件 */
			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
		}

		/**初始化*/
        private onAddToStage(event:egret.Event):void{
			/**移除侦听加入舞台事件 */
			this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);

			/**初始化舞台宽高 */
			this.stageW = this.stage.stageWidth;
			this.stageH = this.stage.stageHeight;

			/**实例化数组 */
			this.bgArry = [];

			let temp: egret.Texture = RES.getRes("bg_jpg");//背景纹理类
			this.textureHeight = temp.textureHeight;//该纹理类的纹理高度

			/**计算当前需要多少张背景的纹理类,以实现后面的循环滚动*/
			this.rowCount = Math.ceil( this.stageH / this.textureHeight) + 1;

			for(let i: number = 0;i < this.rowCount;i++) {
				let bgBmp: egret.Bitmap = game.util.GameUtil.createBitmapByName("bg_jpg");
				bgBmp.y = -1 * (this.textureHeight * (this.rowCount-i) - this.stageH);				
				this.addChild(bgBmp);				
				this.bgArry.push(bgBmp);            
			}
		}

		private enterFrameHandler(e: egret.Event):void { 			
			for(var i: number = 0;i < this.rowCount;i++) {
				let bgBmp:egret.Bitmap = this.bgArry[i];
				bgBmp.y += this.speed;
				if(bgBmp.y > this.stageH) {                
					bgBmp.y = this.bgArry[0].y - this.textureHeight;                
					this.bgArry.pop();
					this.bgArry.unshift(bgBmp);                
				}
			}                
		}

		/**开始滚动*/
        public start():void {
            this.removeEventListener(egret.Event.ENTER_FRAME,this.enterFrameHandler,this);
            this.addEventListener(egret.Event.ENTER_FRAME,this.enterFrameHandler,this);
        } 

		/**暂停滚动*/
        public pause():void {
            this.removeEventListener(egret.Event.ENTER_FRAME,this.enterFrameHandler,this);
        }
	}
}