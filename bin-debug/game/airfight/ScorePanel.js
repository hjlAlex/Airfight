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
        var ScorePanel = (function (_super) {
            __extends(ScorePanel, _super);
            function ScorePanel() {
                var _this = _super.call(this) || this;
                var g = _this.graphics;
                g.beginFill(0x000000, 0.8);
                g.drawRect(0, 0, 500, 300);
                g.endFill();
                _this.txt = new egret.TextField();
                _this.txt.width = 500;
                _this.txt.height = 300;
                _this.txt.textAlign = "center";
                _this.txt.textColor = 0xFFFFFF;
                _this.txt.size = 24;
                _this.txt.y = 60;
                _this.addChild(_this.txt);
                _this.btnRestart = game.util.GameUtil.createBitmapByName("restart_png");
                _this.btnRestart.x = (500 - _this.btnRestart.width) / 2; //居中定位
                _this.btnRestart.y = 150;
                _this.addChild(_this.btnRestart);
                _this.btnRestart.touchEnabled = true;
                _this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.restartGame, _this);
                return _this;
            }
            ScorePanel.prototype.restartGame = function () {
                var gameContainer = this.parent;
                gameContainer.gameStart();
            };
            ScorePanel.prototype.showScore = function (value) {
                var msg = "您的成绩是:\n\n" + value;
                this.txt.text = msg;
            };
            return ScorePanel;
        }(egret.Sprite));
        airfight.ScorePanel = ScorePanel;
        __reflect(ScorePanel.prototype, "game.airfight.ScorePanel");
    })(airfight = game.airfight || (game.airfight = {}));
})(game || (game = {}));
//# sourceMappingURL=ScorePanel.js.map