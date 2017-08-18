var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var game;
(function (game) {
    var airfight;
    (function (airfight) {
        var BloodBar = (function (_super) {
            __extends(BloodBar, _super);
            function BloodBar() {
                var _this = _super.call(this) || this;
                _this.delBlood = 0;
                _this.bloodFg = game.util.GameUtil.createBitmapByName("bloodBar_png");
                _this.addChild(_this.bloodFg);
                _this.bloodBg = game.util.GameUtil.createBitmapByName("bloodBarBg_png");
                _this.addChild(_this.bloodBg);
                _this.w = _this.bloodBg.texture.textureWidth;
                _this.h = _this.bloodBg.texture.textureHeight;
                _this.bloodMask = new egret.Shape(); //实现生命条动态减少的遮罩层
                _this.bloodMask.graphics.beginFill(0xff0000);
                _this.bloodMask.graphics.drawRect(_this.bloodBg.x + _this.w, _this.bloodBg.y, 0, _this.h);
                _this.bloodMask.graphics.endFill();
                _this.addChild(_this.bloodMask);
                _this.bloodBg.mask = _this.bloodMask;
                return _this;
            }
            BloodBar.prototype.bloodMove = function (fullBlood) {
                this.delBlood += this.w / fullBlood;
                this.bloodMask = this.bloodBg.mask;
                this.bloodMask.graphics.beginFill(0xff0000);
                this.bloodMask.graphics.drawRect(this.bloodBg.x + (this.w - this.delBlood), this.bloodBg.y, this.delBlood, this.h);
                this.bloodMask.graphics.endFill();
                this.bloodBg.mask = this.bloodMask;
            };
            return BloodBar;
        }(egret.DisplayObjectContainer));
        airfight.BloodBar = BloodBar;
        __reflect(BloodBar.prototype, "game.airfight.BloodBar");
    })(airfight = game.airfight || (game.airfight = {}));
})(game || (game = {}));
//# sourceMappingURL=BloodBar.js.map