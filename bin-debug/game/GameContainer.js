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
    /**
     * 游戏主容器
     */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this) || this;
            /**开始侦听加入舞台事件 */
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        /**初始化*/
        GameContainer.prototype.onAddToStage = function (event) {
            /**移除侦听加入舞台事件 */
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //背景
            this.bg = new game.bg.BgMap(); //创建可滚动的背景
            this.addChild(this.bg);
            //开始按钮
            this.btnStart = game.util.GameUtil.createBitmapByName("btn_start_png");
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2; //居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2; //居中定位
            this.btnStart.touchEnabled = true; //开启触碰
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮开始游戏
            this.addChild(this.btnStart);
        };
        GameContainer.prototype.gameStart = function () {
            /**先移除中间的开始按钮 */
            this.removeChild(this.btnStart);
            this.bg.start();
        };
        return GameContainer;
    }(egret.DisplayObjectContainer));
    game.GameContainer = GameContainer;
    __reflect(GameContainer.prototype, "game.GameContainer");
})(game || (game = {}));
//# sourceMappingURL=GameContainer.js.map