module game.buff {
	export class BuffBlood {
		/**buff对象池 */
		private static cacheBuffBlood:egret.Bitmap[] = [];

		/**生产buff */
		public static produce():egret.Bitmap {			
            let buff:egret.Bitmap;
            if(this.cacheBuffBlood.length > 0) {
                buff = this.cacheBuffBlood.pop();
            } else {
                buff = game.util.GameUtil.createBitmapByName("buff_blood_png");						
            }
            return buff;
        }

		/**回收buff*/
        public static reclaim(buff:egret.Bitmap):void {            
            if(this.cacheBuffBlood.indexOf(buff) == -1){
				this.cacheBuffBlood.push(buff);
			}                
        }
	}
}