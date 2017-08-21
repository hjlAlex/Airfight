module game.bullet {
	export class Bullet {

		public static TYPE_ME_BULLET:number = 1;

		public static TYPE_ENEMY_BULLET:number = 2;

		/**子弹对象池 */
		private static cacheMyBullet:egret.Bitmap[] = [];

		/**敌方子弹对象池 */
		private static cacheEnemyBullet:egret.Bitmap[] = [];
		

		/**生产*/
        public static produce(type:number):egret.Bitmap {
			let cacheObj:egret.Bitmap[];
			let bulletName:string;
            if(type == this.TYPE_ME_BULLET){//生产我方子弹
				cacheObj = this.cacheMyBullet;
				bulletName = "my_bullet_png";
			}else{//生产敌方子弹
				cacheObj = this.cacheEnemyBullet;
				bulletName = "enemy_bullet_png";
			}
            let bullet:egret.Bitmap;
            if(cacheObj.length > 0) {
                bullet = cacheObj.pop();
            } else {
                bullet = game.util.GameUtil.createBitmapByName(bulletName);
				bullet.name = bulletName;				
            }
            return bullet;
        }

		/**回收*/
        public static reclaim(type:number,bullet:egret.Bitmap):void {
            let cacheObj:egret.Bitmap[];			
            if(type == this.TYPE_ME_BULLET){
				cacheObj = this.cacheMyBullet;				
			}else{
				cacheObj = this.cacheEnemyBullet;				
			}
            if(cacheObj.indexOf(bullet) == -1){
				cacheObj.push(bullet);
			}                
        }

		public static getBulletPoolSize(type:number):number{
			if(type == this.TYPE_ME_BULLET){
				return this.cacheMyBullet.length;				
			}else{
				return this.cacheEnemyBullet.length;				
			}
		}
	}
}