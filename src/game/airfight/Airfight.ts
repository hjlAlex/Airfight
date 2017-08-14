module game.airfight {
	export class Airfight extends egret.DisplayObjectContainer{
		
		/**飞机位图*/
        private airBmp:egret.Bitmap;
        /**创建子弹的时间间隔*/
        private fireDelay:number;
        /**定时射*/
        private fireTimer:egret.Timer;
        /**飞机生命值*/
        public blood:number = 10;
		//可视为飞机类型名
		public airName:string;
		
		public constructor(airBmp:egret.Bitmap,fireDelay:number,airName:string) {
			super();
			this.airBmp = airBmp;
			this.fireDelay = fireDelay;
			this.fireTimer = new egret.Timer(fireDelay);
			this.airName = airName;
			/**开始侦听加入舞台事件 */
			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
		}

		private onAddToStage(event:egret.Event):void {
			/**移除侦听加入舞台事件 */
			this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
			
			/**添加背景图 */
			this.addChild(this.airBmp);            
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
		}

		/**定时创建(发送)子弹 */
		private createBullet(event:egret.Event):void {
			
		}
	}
}