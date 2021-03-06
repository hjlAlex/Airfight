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
        var Airfight = (function (_super) {
            __extends(Airfight, _super);
            function Airfight(airBmp, fireDelay, airType) {
                var _this = _super.call(this) || this;
                //生命次数
                _this.lifeTime = 3;
                //生命buff数组
                _this.lifeBuff = [];
                _this.airBmp = airBmp;
                /**添加纹理图 */
                _this.addChild(_this.airBmp);
                _this.fireDelay = fireDelay;
                _this.fireTimer = new egret.Timer(fireDelay);
                _this.airType = airType;
                _this.bloodBar = new game.airfight.BloodBar();
                if (_this.airType == game.airfight.Airfight.TYPE_ME_AIRFIGHT) {
                    _this.bloodBar.x = _this.x + (_this.width - _this.bloodBar.width) / 2;
                    _this.bloodBar.y = _this.y + _this.height - 28;
                    _this.addChild(_this.bloodBar);
                }
                else {
                    _this.bloodBar.x = _this.x + (_this.width - _this.bloodBar.width) / 2;
                    _this.bloodBar.y = _this.y - _this.bloodBar.height + 8;
                    _this.addChild(_this.bloodBar);
                }
                /**开始侦听加入舞台事件 */
                _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
                return _this;
            }
            Airfight.prototype.onAddToStage = function (event) {
                /**移除侦听加入舞台事件 */
                this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
                /**定时发射子弹 */
                this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
            };
            /**定时创建(发送)子弹 */
            Airfight.prototype.createBullet = function (event) {
                /**
                 * 发送子弹,最终实现的效果是从我方飞机喷出子弹,添加到游戏主容器中
                 * 实现方式1:通过自定义dispatchEvent一个事件,在主容器中侦听这个事件,侦听回调创建子弹
                 * 实现方式2:在当前容器(即飞机容器)获取父级容器(即游戏主容器),然后添加创建的子弹
                 * 这里使用方式2
                 */
                var gameContainer = this.parent;
                if (this.airType == game.airfight.Airfight.TYPE_ME_AIRFIGHT) {
                    var bullet_1;
                    for (var i = 0; i < 3; i++) {
                        bullet_1 = game.bullet.Bullet.produce(game.bullet.Bullet.TYPE_ME_BULLET);
                        if (i == 0) {
                            bullet_1.x = this.x;
                            bullet_1.y = this.y + 30;
                        }
                        else if (i == 1) {
                            bullet_1.x = this.x + 65;
                            bullet_1.y = this.y;
                        }
                        else {
                            bullet_1.x = this.x + this.width - 28;
                            bullet_1.y = this.y + 30;
                        }
                        gameContainer.addChild(bullet_1);
                        gameContainer.addBullet(game.bullet.Bullet.TYPE_ME_BULLET, bullet_1);
                    }
                    /**子弹发出音效 */
                    var bulletMusic = RES.getRes("effcet_mybullet_mp3");
                    bulletMusic.play(0, 1);
                }
                else {
                    var bullet_2;
                    bullet_2 = game.bullet.Bullet.produce(game.bullet.Bullet.TYPE_ENEMY_BULLET);
                    bullet_2.x = this.x + 28;
                    bullet_2.y = this.y + 10;
                    gameContainer.addChild(bullet_2);
                    gameContainer.addBullet(game.bullet.Bullet.TYPE_ENEMY_BULLET, bullet_2);
                }
            };
            /**开火*/
            Airfight.prototype.fire = function () {
                this.fireTimer.start();
            };
            /**停火*/
            Airfight.prototype.stopFire = function () {
                this.fireTimer.stop();
            };
            /**Hp减少 */
            Airfight.prototype.delBlood = function (blood) {
                this.blood = this.blood - blood;
                this.bloodBarDel();
            };
            /**生命增加 */
            Airfight.prototype.addBuff = function () {
                this.lifeTime = this.lifeTime + 1;
                if (this.lifeTime > 3) {
                    this.lifeTime = 3;
                    return;
                }
                var buff = game.buff.BuffBlood.produce();
                this.lifeBuff.push(buff);
                var gameContainer = this.parent;
                for (var i = 0; i < this.lifeBuff.length; i++) {
                    var buff_1 = this.lifeBuff[i];
                    buff_1.x = 0;
                    buff_1.y = 580 + i * (15 + buff_1.height);
                    if (!gameContainer.contains(buff_1)) {
                        gameContainer.addChild(buff_1);
                    }
                }
            };
            /**生命减少 */
            Airfight.prototype.delBuff = function () {
                this.lifeTime = this.lifeTime - 1;
                var buff = this.lifeBuff.pop();
                game.buff.BuffBlood.reclaim(buff);
                var gameContainer = this.parent;
                if (gameContainer.contains(buff)) {
                    gameContainer.removeChild(buff);
                }
            };
            Airfight.prototype.resetBlood = function (blood) {
                this.blood = blood;
                this.fullBlood = blood; //该值初始化后不能改变			
                this.bloodBar.reset();
            };
            Airfight.prototype.resetLife = function () {
                var gameContainer = this.parent;
                if (this.lifeBuff.length != 0) {
                    for (var i = 0; i < this.lifeBuff.length; i++) {
                        var buff_2 = this.lifeBuff.pop();
                        if (gameContainer.contains(buff_2)) {
                            gameContainer.removeChild(buff_2);
                            game.buff.BuffBlood.reclaim(buff_2);
                        }
                    }
                }
                this.lifeTime = 3;
                for (var i = 0; i < 3; i++) {
                    var buff_3 = game.buff.BuffBlood.produce();
                    buff_3.y = 580 + i * (15 + buff_3.height);
                    gameContainer.addChild(buff_3);
                    this.lifeBuff.push(buff_3);
                }
            };
            Airfight.prototype.getFullBlood = function () {
                return this.fullBlood;
            };
            /**获取Hp */
            Airfight.prototype.getBlood = function () {
                return this.blood;
            };
            /**获取生命次数 */
            Airfight.prototype.getLife = function () {
                return this.lifeTime;
            };
            Airfight.prototype.bloodBarDel = function () {
                this.bloodBar.bloodMove(this.fullBlood, "del");
            };
            Airfight.prototype.bloodBarAdd = function () {
                this.bloodBar.bloodMove(this.fullBlood, "add");
            };
            /**生产*/
            Airfight.produce = function (airType, fireDelay) {
                var cacheObj;
                var airName;
                if (airType == this.TYPE_ME_AIRFIGHT) {
                    cacheObj = this.cacheMyAir;
                    airName = "my_airfight_png";
                }
                else {
                    cacheObj = this.cacheEnemyAir;
                    airName = "enemy_aifight_png";
                }
                var air;
                if (cacheObj.length > 0) {
                    air = cacheObj.pop();
                }
                else {
                    var myAirBitmap = game.util.GameUtil.createBitmapByName(airName);
                    air = new game.airfight.Airfight(myAirBitmap, fireDelay, airType);
                }
                return air;
            };
            /**回收*/
            Airfight.reclaim = function (airType, air) {
                var cacheObj;
                if (airType == this.TYPE_ME_AIRFIGHT) {
                    cacheObj = this.cacheMyAir;
                }
                else {
                    cacheObj = this.cacheEnemyAir;
                }
                if (cacheObj.indexOf(air) == -1) {
                    cacheObj.push(air);
                }
            };
            Airfight.getAirPoolSize = function (airType) {
                if (airType == this.TYPE_ME_AIRFIGHT) {
                    return this.cacheMyAir.length;
                }
                else {
                    return this.cacheEnemyAir.length;
                }
            };
            return Airfight;
        }(egret.DisplayObjectContainer));
        Airfight.TYPE_ME_AIRFIGHT = 1;
        Airfight.TYPE_ENEMY_AIRFIGHT = 2;
        /**我方飞机对象池 */
        Airfight.cacheMyAir = [];
        /**敌方飞机对象池 */
        Airfight.cacheEnemyAir = [];
        airfight.Airfight = Airfight;
        __reflect(Airfight.prototype, "game.airfight.Airfight");
    })(airfight = game.airfight || (game.airfight = {}));
})(game || (game = {}));
//# sourceMappingURL=Airfight.js.map