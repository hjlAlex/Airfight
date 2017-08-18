var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var bullet;
    (function (bullet_1) {
        var Bullet = (function () {
            function Bullet() {
            }
            /**生产*/
            Bullet.produce = function (type) {
                var cacheObj;
                var bulletName;
                if (type == this.TYPE_ME_BULLET) {
                    cacheObj = this.cacheMyBullet;
                    bulletName = "my_bullet_png";
                }
                else {
                    cacheObj = this.cacheEnemyBullet;
                    bulletName = "enemy_bullet_png";
                }
                var bullet;
                if (cacheObj.length > 0) {
                    bullet = cacheObj.pop();
                }
                else {
                    bullet = game.util.GameUtil.createBitmapByName(bulletName);
                    bullet.name = bulletName;
                }
                return bullet;
            };
            /**回收*/
            Bullet.reclaim = function (type, bullet) {
                var cacheObj;
                if (type == this.TYPE_ME_BULLET) {
                    cacheObj = this.cacheMyBullet;
                }
                else {
                    cacheObj = this.cacheEnemyBullet;
                }
                if (cacheObj.indexOf(bullet) == -1) {
                    cacheObj.push(bullet);
                }
            };
            Bullet.getBulletPoolSize = function (type) {
                if (type == this.TYPE_ME_BULLET) {
                    return this.cacheMyBullet.length;
                }
                else {
                    return this.cacheEnemyBullet.length;
                }
            };
            return Bullet;
        }());
        Bullet.TYPE_ME_BULLET = 1;
        Bullet.TYPE_ENEMY_BULLET = 2;
        /**子弹对象池 */
        Bullet.cacheMyBullet = [];
        /**敌方子弹对象池 */
        Bullet.cacheEnemyBullet = [];
        bullet_1.Bullet = Bullet;
        __reflect(Bullet.prototype, "game.bullet.Bullet");
    })(bullet = game.bullet || (game.bullet = {}));
})(game || (game = {}));
//# sourceMappingURL=Bullet.js.map