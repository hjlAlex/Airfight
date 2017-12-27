var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var buff;
    (function (buff_1) {
        var BuffBlood = (function () {
            function BuffBlood() {
            }
            /**生产buff */
            BuffBlood.produce = function () {
                var buff;
                if (this.cacheBuffBlood.length > 0) {
                    buff = this.cacheBuffBlood.pop();
                }
                else {
                    buff = game.util.GameUtil.createBitmapByName("buff_blood_png");
                }
                return buff;
            };
            /**回收buff*/
            BuffBlood.reclaim = function (buff) {
                if (this.cacheBuffBlood.indexOf(buff) == -1) {
                    this.cacheBuffBlood.push(buff);
                }
            };
            return BuffBlood;
        }());
        /**buff对象池 */
        BuffBlood.cacheBuffBlood = [];
        buff_1.BuffBlood = BuffBlood;
        __reflect(BuffBlood.prototype, "game.buff.BuffBlood");
    })(buff = game.buff || (game.buff = {}));
})(game || (game = {}));
//# sourceMappingURL=BuffBlood.js.map