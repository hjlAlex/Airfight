class LoadingProgress extends egret.DisplayObjectContainer{
	private _bottom:egret.Shape;
	private _progressbar:egret.Shape;
	private _width:number;

	public constructor(width:number) {
		super();
		this._width = width;
		this._bottom = new egret.Shape();		
		this._bottom.graphics.beginFill(0xf38f18);
		this._bottom.graphics.drawRoundRect(0,0,width,32,32,32);
		this._bottom.graphics.endFill();

		this._progressbar = new egret.Shape();
		this._progressbar.graphics.beginFill(0xff0000);
		this._progressbar.graphics.drawRoundRect(0,0,width-2,30,32,32);
		this._progressbar.graphics.endFill();

		this.addChild(this._bottom);
		this.addChild(this._progressbar);
	}

	public setProgress(current:number,total:number):void{
		let w = this.width * current / total;
		this._progressbar.mask = new egret.Rectangle(0,0,w,30);
	}
}