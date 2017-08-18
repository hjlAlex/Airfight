module game.airfight {
	export class Airfight extends egret.DisplayObjectContainer{
		
		public static TYPE_ME_AIRFIGHT:number = 1;

		public static TYPE_ENEMY_AIRFIGHT:number = 2;

		/**我方飞机对象池 */
		private static cacheMyAir:game.airfight.Airfight[] = [];

		/**敌方飞机对象池 */
		private static cacheEnemyAir:game.airfight.Airfight[] = [];

		/**飞机位图*/
        private airBmp:egret.Bitmap;
        /**创建子弹的时间间隔*/
        private fireDelay:number;
        /**定时射*/
        private fireTimer:egret.Timer;
        /**飞机默认生命值*/
        private blood:number = 10;
		/**飞机满血状态时生命值 */
		private fullBlood:number;
		/**飞机的血条 */
		private bloodBar:game.airfight.BloodBar;
		//可视为飞机类型
		private airType:number;	

		
		public constructor(airBmp:egret.Bitmap,fireDelay:number,airType:number) {
			super();
			this.airBmp = airBmp;
			/**添加纹理图 */
			this.addChild(this.airBmp);
			this.fireDelay = fireDelay;
			this.fireTimer = new egret.Timer(fireDelay);
			this.airType = airType;
			this.bloodBar = new game.airfight.BloodBar();  
			if(this.airType == game.airfight.Airfight.TYPE_ME_AIRFIGHT){
				this.bloodBar.x = this.x+(this.width - this.bloodBar.width)/2;
				this.bloodBar.y = this.y+this.height-28;
				this.addChild(this.bloodBar);
			}else{
				this.bloodBar.x = this.x+(this.width - this.bloodBar.width)/2;
				this.bloodBar.y = this.y-this.bloodBar.height+8;
				this.addChild(this.bloodBar);
			}
			/**开始侦听加入舞台事件 */
			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
		}		

		
		private onAddToStage(event:egret.Event):void {
			/**移除侦听加入舞台事件 */
			this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);			
			/**定时发射子弹 */         
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);		
		
		}	

		/**定时创建(发送)子弹 */
		private createBullet(event:egret.Event):void {
			
			/**
			 * 发送子弹,最终实现的效果是从我方飞机喷出子弹,添加到游戏主容器中
			 * 实现方式1:通过自定义dispatchEvent一个事件,在主容器中侦听这个事件,侦听回调创建子弹
			 * 实现方式2:在当前容器(即飞机容器)获取父级容器(即游戏主容器),然后添加创建的子弹
			 * 这里使用方式2
			 */
			let gameContainer:game.GameContainer = <game.GameContainer>this.parent;
			
			if(this.airType == game.airfight.Airfight.TYPE_ME_AIRFIGHT){
				let bullet:egret.Bitmap;
				for(let i:number=0;i<2;i++) {
                    bullet = game.bullet.Bullet.produce(game.bullet.Bullet.TYPE_ME_BULLET);
                    bullet.x = i==0?(this.x):(this.x+this.width-28);
                    bullet.y = this.y+30;                    
                    gameContainer.addChild(bullet);					
                    gameContainer.addBullet(game.bullet.Bullet.TYPE_ME_BULLET,bullet);
                }
			}else{
				let bullet:egret.Bitmap;
				bullet = game.bullet.Bullet.produce(game.bullet.Bullet.TYPE_ENEMY_BULLET);
                bullet.x = this.x+28;
                bullet.y = this.y+10;               
                gameContainer.addChild(bullet);
                gameContainer.addBullet(game.bullet.Bullet.TYPE_ENEMY_BULLET,bullet);				
			}			
		}

		/**开火*/
        public fire():void {
            this.fireTimer.start();
        }
        /**停火*/
        public stopFire():void {			
            this.fireTimer.stop();
        }
		/**Hp减少 */
		public delBlood(blood:number):void {
			this.blood = this.blood - blood;
		}

		public resetBlood(blood:number){
			this.blood = blood;
			this.fullBlood = blood;//该值初始化后不能改变
					
		}

		public getFullBlood():number {
			return this.fullBlood;
		}

		/**获取Hp */
		public getBlood():number {
			return this.blood;
		}

		public bloodBarChange():void{
			this.bloodBar.bloodMove(this.fullBlood);
		}
		/**生产*/
        public static produce(airType:number,fireDelay:number):game.airfight.Airfight {	
            let cacheObj:game.airfight.Airfight[];
			let airName:string;
            if(airType == this.TYPE_ME_AIRFIGHT){//生产我方飞机
				cacheObj = this.cacheMyAir;
				airName = "my_airfight_png";
			}else{//生产敌方飞机
				cacheObj = this.cacheEnemyAir;
				airName = "enemy_aifight_png";
			}
            let air:game.airfight.Airfight;
            if(cacheObj.length > 0) {
                air = cacheObj.pop();
            } else {
				let myAirBitmap:egret.Bitmap = game.util.GameUtil.createBitmapByName(airName);
                air = new game.airfight.Airfight(myAirBitmap,fireDelay,airType);
            }
            return air;
        } 

		/**回收*/
        public static reclaim(airType:number,air:game.airfight.Airfight):void {
            let cacheObj:game.airfight.Airfight[];			
            if(airType == this.TYPE_ME_AIRFIGHT){
				cacheObj = this.cacheMyAir;				
			}else{
				cacheObj = this.cacheEnemyAir;				
			}
            if(cacheObj.indexOf(air) == -1){
				cacheObj.push(air);
			}                
        }

		public static getAirPoolSize(airType:number):number{
			if(airType == this.TYPE_ME_AIRFIGHT){
				return this.cacheMyAir.length;				
			}else{
				return this.cacheEnemyAir.length;				
			}
		}
	}
}