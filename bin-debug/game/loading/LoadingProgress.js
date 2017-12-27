var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LoadingProgress = (function (_super) {
    __extends(LoadingProgress, _super);
    function LoadingProgress(width) {
        var _this = _super.call(this) || this;
        _this._width = width;
        _this._bottom = new egret.Shape();
        _this._bottom.graphics.beginFill(0xf38f18);
        _this._bottom.graphics.drawRoundRect(0, 0, width, 32, 32, 32);
        _this._bottom.graphics.endFill();
        _this._progressbar = new egret.Shape();
        _this._progressbar.graphics.beginFill(0xff0000);
        _this._progressbar.graphics.drawRoundRect(0, 0, width - 2, 30, 32, 32);
        _this._progressbar.graphics.endFill();
        _this.addChild(_this._bottom);
        _this.addChild(_this._progressbar);
        return _this;
    }
    LoadingProgress.prototype.setProgress = function (current, total) {
        var w = this.width * current / total;
        this._progressbar.mask = new egret.Rectangle(0, 0, w, 30);
    };
    return LoadingProgress;
}(egret.DisplayObjectContainer));
__reflect(LoadingProgress.prototype, "LoadingProgress");
//# sourceMappingURL=LoadingProgress.js.map