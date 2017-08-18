module game.airfight {
	export class BloodBar extends egret.DisplayObjectContainer{
        
        private bloodBg:egret.Bitmap;
        private bloodFg:egret.Bitmap;

        private w:number;
        private h:number;

        private bloodMask:egret.Shape;

        private delBlood:number = 0;
        public constructor() {
            super();
            this.bloodFg = game.util.GameUtil.createBitmapByName("bloodBar_png");			
			this.addChild(this.bloodFg);
			this.bloodBg = game.util.GameUtil.createBitmapByName("bloodBarBg_png");			
			this.addChild(this.bloodBg);
			this.w = this.bloodBg.texture.textureWidth;
			this.h = this.bloodBg.texture.textureHeight;
			this.bloodMask = new egret.Shape();//实现生命条动态减少的遮罩层
			this.bloodMask.graphics.beginFill(0xff0000);
			this.bloodMask.graphics.drawRect(this.bloodBg.x+this.w,this.bloodBg.y,0,this.h);
			this.bloodMask.graphics.endFill();   
			this.addChild(this.bloodMask); 
            this.bloodBg.mask = this.bloodMask;
        }

		
        public bloodMove(fullBlood:number):void {  
            this.delBlood += this.w/fullBlood; 
            this.bloodMask = <egret.Shape>this.bloodBg.mask;
            this.bloodMask.graphics.beginFill(0xff0000);
            this.bloodMask.graphics.drawRect(this.bloodBg.x+(this.w-this.delBlood),this.bloodBg.y,this.delBlood,this.h);
            this.bloodMask.graphics.endFill();        
            this.bloodBg.mask = this.bloodMask;
        }
    }
}