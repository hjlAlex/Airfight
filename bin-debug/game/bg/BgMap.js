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
    var bg;
    (function (bg) {
        /**
         * 可滚动背景
         */
        var BgMap = (function (_super) {
            __extends(BgMap, _super);
            function BgMap() {
                var _this = _super.call(this) || this;
                /**控制滚动速度*/
                _this.speed = 2;
                /**开始侦听加入舞台事件 */
                _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
                return _this;
            }
            /**初始化*/
            BgMap.prototype.onAddToStage = function (event) {
                /**移除侦听加入舞台事件 */
                this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
                /**初始化舞台宽高 */
                this.stageW = this.stage.stageWidth;
                this.stageH = this.stage.stageHeight;
                /**实例化数组 */
                this.bgArry = [];
                var temp = RES.getRes("bg_jpg"); //背景纹理类
                this.textureHeight = temp.textureHeight; //该纹理类的纹理高度
                /**计算当前需要多少张背景的纹理类,以实现后面的循环滚动*/
                this.rowCount = Math.ceil(this.stageH / this.textureHeight) + 1;
                for (var i = 0; i < this.rowCount; i++) {
                    var bgBmp = game.util.GameUtil.createBitmapByName("bg_jpg");
                    bgBmp.y = -1 * (this.textureHeight * (this.rowCount - i) - this.stageH);
                    this.addChild(bgBmp);
                    this.bgArry.push(bgBmp);
                }
            };
            BgMap.prototype.enterFrameHandler = function (e) {
                for (var i = 0; i < this.rowCount; i++) {
                    var bgBmp = this.bgArry[i];
                    bgBmp.y += this.speed;
                    if (bgBmp.y > this.stageH) {
                        bgBmp.y = this.bgArry[0].y - this.textureHeight;
                        this.bgArry.pop();
                        this.bgArry.unshift(bgBmp);
                    }
                }
            };
            /**开始滚动*/
            BgMap.prototype.start = function () {
                if (null != this.deathBg && this.contains(this.deathBg)) {
                    for (var i = 0; i < this.bgArry.length; i++) {
                        this.bgArry[i].visible = true;
                    }
                    this.removeChild(this.deathBg);
                }
                this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            };
            /**暂停滚动*/
            BgMap.prototype.pause = function () {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            };
            BgMap.prototype.gameOver = function () {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
                if (null == this.deathBg) {
                    //游戏结束时的背景
                    this.deathBg = new egret.Bitmap(RES.getRes("bgGrey_png"));
                }
                if (!this.contains(this.deathBg)) {
                    this.addChildAt(this.deathBg, this.numChildren - 1);
                    for (var i = 0; i < this.bgArry.length; i++) {
                        this.bgArry[i].visible = false;
                    }
                }
            };
            return BgMap;
        }(egret.DisplayObjectContainer));
        bg.BgMap = BgMap;
        __reflect(BgMap.prototype, "game.bg.BgMap");
    })(bg = game.bg || (game.bg = {}));
})(game || (game = {}));
//# sourceMappingURL=BgMap.js.map