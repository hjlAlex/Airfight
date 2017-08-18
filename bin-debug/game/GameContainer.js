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
            /**我的子弹*/
            _this.myBullets = [];
            /**敌人的飞机*/
            _this.enemyAirfights = [];
            /**触发创建敌机的间隔*/
            _this.enemyAirfightsTimer = new egret.Timer(1000);
            /**敌人的子弹*/
            _this.enemyBullets = [];
            /**我的成绩*/
            _this.myScore = 0;
            _this._lastTime = egret.getTimer();
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
            /**添加我方飞机 */
            var myAirBitmap = game.util.GameUtil.createBitmapByName("my_airfight_png");
            this.myAirfight = new game.airfight.Airfight(myAirBitmap, 150, game.airfight.Airfight.TYPE_ME_AIRFIGHT);
            this.myAirfight.x = (this.stageW - this.myAirfight.width) / 2;
            this.myAirfight.y = this.stageH - this.myAirfight.height;
            this.addChild(this.myAirfight);
            /**计分板 */
            this.scorePanel = new game.airfight.ScorePanel();
            //预创建
            this.preCreatedInstance();
        };
        GameContainer.prototype.gameStart = function () {
            if (this.scorePanel.parent == this) {
                this.removeChild(this.scorePanel);
            }
            /**重置计分 */
            this.myScore = 0;
            if (this.contains(this.btnStart)) {
                /**只有首次打开游戏时需要该按钮 */
                this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
                /**先移除中间的开始按钮 */
                this.removeChild(this.btnStart);
            }
            /**背景图开始滚动 */
            this.bg.start();
            /**重置我方飞机生命 */
            this.myAirfight.resetBlood(10);
            /**启动定时发射子弹 */
            this.myAirfight.fire();
            /**定时创建敌方飞机 */
            this.enemyAirfightsTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyAir, this);
            this.enemyAirfightsTimer.start();
            /**移动我方飞机 */
            this.myAirfight.touchEnabled = true;
            this.myAirfight.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startMove, this);
            // this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this); //更新游戏界面
        };
        GameContainer.prototype.startMove = function (e) {
            //计算手指和要拖动的对象的距离
            this.offsetX = e.stageX - this.myAirfight.x;
            this.offsetY = e.stageY - this.myAirfight.y;
            //手指在屏幕上移动，会触发 onMove 方法
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        };
        GameContainer.prototype.touchHandler = function (evt) {
            if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
                // let tx:number = evt.localX;
                // tx = Math.max(0,tx);
                // tx = Math.min(this.stageW-this.myAirfight.width,tx);
                // this.myAirfight.x = tx;
                // var tx2: number = evt.localY;
                // tx2 = Math.max(0,tx2);
                // tx2 = Math.min(this.stageH - this.myAirfight.height,tx2);
                // this.myAirfight.y = tx2;
                //通过计算手指在屏幕上的位置，计算当前对象的坐标，达到跟随手指移动的效果
                this.myAirfight.x = evt.stageX - this.offsetX;
                this.myAirfight.y = evt.stageY - this.offsetY;
            }
        };
        /**游戏画面更新*/
        GameContainer.prototype.gameViewUpdate = function (evt) {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;
            var speedOffset = 60 / fps;
            //我的子弹运动            
            var bullet;
            var myBulletsCount = this.myBullets.length;
            for (var i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                if (bullet.y < (-bullet.height)) {
                    if (this.contains(bullet)) {
                        this.removeChild(bullet);
                        game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ME_BULLET, bullet);
                        this.myBullets.splice(i, 1);
                        i--;
                        myBulletsCount--;
                    }
                }
                bullet.y -= 10 * speedOffset;
            }
            // console.log("我方子弹size:"+this.myBullets.length);
            // console.log("我方子弹对象池size:"+game.bullet.Bullet.getBulletPoolSize(game.bullet.Bullet.TYPE_ME_BULLET));
            //敌方飞机运动
            var enemyAir;
            var enemyAirCount = this.enemyAirfights.length;
            for (var i = 0; i < enemyAirCount; i++) {
                enemyAir = this.enemyAirfights[i];
                if (enemyAir.y > this.stageH) {
                    if (this.contains(enemyAir)) {
                        this.removeChild(enemyAir);
                        game.airfight.Airfight.reclaim(game.airfight.Airfight.TYPE_ENEMY_AIRFIGHT, enemyAir);
                        enemyAir.stopFire();
                        this.enemyAirfights.splice(i, 1);
                        i--;
                        enemyAirCount--;
                    }
                }
                enemyAir.y += 2 * speedOffset;
            }
            //console.log("敌方飞机size:"+this.enemyAirfights.length);
            //console.log("敌方飞机对象池size:"+game.airfight.Airfight.getAirPoolSize(game.airfight.Airfight.TYPE_ENEMY_AIRFIGHT));
            //敌人子弹运动
            var enemyBulletsCount = this.enemyBullets.length;
            var enemyBullet;
            for (var i = 0; i < enemyBulletsCount; i++) {
                enemyBullet = this.enemyBullets[i];
                if (enemyBullet.y > this.stageH) {
                    if (this.contains(enemyBullet)) {
                        this.removeChild(enemyBullet);
                        game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ENEMY_BULLET, enemyBullet);
                        this.enemyBullets.splice(i, 1);
                        i--;
                        enemyBulletsCount--; //数组长度已经改变
                    }
                }
                enemyBullet.y += 8 * speedOffset;
            }
            //console.log("敌方子弹size:"+this.enemyBullets.length);
            //console.log("敌方子弹对象池size:"+game.bullet.Bullet.getBulletPoolSize(game.bullet.Bullet.TYPE_ENEMY_BULLET));
            this.gameHitJudge();
            //console.log("我方血量:"+this.myAirfight.getBlood());
            //console.log("敌方飞机数量:"+this.enemyAirfights.length);
        };
        GameContainer.prototype.addBullet = function (type, bullet) {
            if (type == game.bullet.Bullet.TYPE_ME_BULLET) {
                this.myBullets.push(bullet);
            }
            else {
                this.enemyBullets.push(bullet);
            }
        };
        GameContainer.prototype.createEnemyAir = function () {
            var enemyAir = game.airfight.Airfight.produce(game.airfight.Airfight.TYPE_ENEMY_AIRFIGHT, 500);
            enemyAir.x = Math.random() * (this.stageW - enemyAir.width);
            enemyAir.y = -enemyAir.height - Math.random() * 300;
            enemyAir.resetBlood(10); //敌机生命重置			
            enemyAir.fire();
            this.addChild(enemyAir);
            this.enemyAirfights.push(enemyAir);
        };
        GameContainer.prototype.preCreatedInstance = function () {
            var bulletsPool = [];
            var bullet;
            for (var i = 0; i < 20; i++) {
                bullet = game.bullet.Bullet.produce(game.bullet.Bullet.TYPE_ME_BULLET);
                bulletsPool.push(bullet); //预先生产20颗我方子弹,然后记录下来
            }
            for (var i = 0; i < 20; i++) {
                bullet = bulletsPool.pop();
                game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ME_BULLET, bullet);
            }
            //上面的bulletsPool重新置空了
            for (var i = 0; i < 30; i++) {
                bullet = game.bullet.Bullet.produce(game.bullet.Bullet.TYPE_ENEMY_BULLET);
                bulletsPool.push(bullet); //预先生产30颗敌方子弹,然后记录下来
            }
            for (var i = 0; i < 30; i++) {
                bullet = bulletsPool.pop();
                game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ENEMY_BULLET, bullet);
            }
            var enemyAirPool = [];
            var enemyAir;
            for (var i = 0; i < 10; i++) {
                enemyAir = game.airfight.Airfight.produce(game.airfight.Airfight.TYPE_ENEMY_AIRFIGHT, 500);
                enemyAirPool.push(enemyAir); //预先生产10个敌方飞机,然后记录下来
            }
            for (var i = 0; i < 10; i++) {
                enemyAir = enemyAirPool.pop();
                game.airfight.Airfight.reclaim(game.airfight.Airfight.TYPE_ENEMY_AIRFIGHT, enemyAir);
            }
        };
        /**游戏碰撞检测*/
        GameContainer.prototype.gameHitJudge = function () {
            var bullet;
            var enemyBullet;
            var enemyAir;
            var myBulletsCount = this.myBullets.length;
            var enemyAirCount = this.enemyAirfights.length;
            var enemyBulletsCount = this.enemyBullets.length;
            //将需消失的子弹和飞机记录
            var delBullets = [];
            var delFighters = [];
            //新增两方子弹可以互相消灭
            for (var i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i]; //我方子弹
                for (var j = 0; j < enemyBulletsCount; j++) {
                    enemyBullet = this.enemyBullets[j]; //敌方子弹
                    if (game.util.GameUtil.hitTest(bullet, enemyBullet)) {
                        if (delBullets.indexOf(bullet) == -1) {
                            delBullets.push(bullet);
                        }
                        if (delBullets.indexOf(enemyBullet) == -1) {
                            delBullets.push(enemyBullet);
                        }
                    }
                }
            }
            //我方子弹可以消灭敌机
            for (var i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                for (var j = 0; j < enemyAirCount; j++) {
                    enemyAir = this.enemyAirfights[j];
                    if (game.util.GameUtil.hitTest(bullet, enemyAir)) {
                        enemyAir.delBlood(2); //敌方飞机掉血
                        enemyAir.bloodBarChange(); //血条减少
                        if (delBullets.indexOf(bullet) == -1) {
                            delBullets.push(bullet);
                        }
                        if (enemyAir.getBlood() <= 0 && delFighters.indexOf(enemyAir) == -1) {
                            delFighters.push(enemyAir);
                        }
                    }
                }
            }
            //敌方的子弹可以减我血
            for (var i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (game.util.GameUtil.hitTest(bullet, this.myAirfight)) {
                    this.myAirfight.delBlood(1);
                    if (delBullets.indexOf(bullet) == -1) {
                        delBullets.push(bullet);
                    }
                    //生命血条变化
                    this.myAirfight.bloodBarChange();
                }
            }
            //敌机的撞击可以消灭我
            for (var i = 0; i < enemyAirCount; i++) {
                enemyAir = this.enemyAirfights[i];
                if (game.util.GameUtil.hitTest(this.myAirfight, enemyAir)) {
                    this.myAirfight.delBlood(10); //假设飞机满血情况下都是10
                    enemyAir.delBlood(10); //敌方飞机也掉血死亡
                    if (enemyAir.getBlood() <= 0 && delFighters.indexOf(enemyAir) == -1) {
                        delFighters.push(enemyAir);
                    }
                }
            }
            if (this.myAirfight.getBlood() <= 0) {
                this.gameStop();
            }
            else {
                while (delBullets.length > 0) {
                    bullet = delBullets.pop();
                    //console.log("开始删除子弹..."+bullet.name);
                    if (this.contains(bullet)) {
                        this.removeChild(bullet);
                    }
                    if (bullet.name == "my_bullet_png") {
                        this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
                        game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ME_BULLET, bullet);
                    }
                    else {
                        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
                        game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ENEMY_BULLET, bullet);
                    }
                }
                this.myScore += delFighters.length;
                while (delFighters.length > 0) {
                    enemyAir = delFighters.pop();
                    enemyAir.resetBlood(10);
                    enemyAir.stopFire();
                    //console.log("开始删除敌方飞机...");  
                    if (this.contains(enemyAir)) {
                        this.removeChild(enemyAir);
                    }
                    this.enemyAirfights.splice(this.enemyAirfights.indexOf(enemyAir), 1);
                    game.airfight.Airfight.reclaim(game.airfight.Airfight.TYPE_ENEMY_AIRFIGHT, enemyAir);
                }
            }
        };
        /**游戏结束*/
        GameContainer.prototype.gameStop = function () {
            //this.addChild(this.btnStart);
            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.myAirfight.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startMove, this);
            this.myAirfight.stopFire();
            this.enemyAirfightsTimer.stop();
            //清理子弹            
            var bullet;
            while (this.myBullets.length > 0) {
                bullet = this.myBullets.pop();
                if (this.contains(bullet)) {
                    this.removeChild(bullet);
                    game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ME_BULLET, bullet);
                }
            }
            while (this.enemyBullets.length > 0) {
                bullet = this.enemyBullets.pop();
                if (this.contains(bullet)) {
                    this.removeChild(bullet);
                    game.bullet.Bullet.reclaim(game.bullet.Bullet.TYPE_ENEMY_BULLET, bullet);
                }
            }
            //清理飞机
            var enemyAir;
            while (this.enemyAirfights.length > 0) {
                enemyAir = this.enemyAirfights.pop();
                enemyAir.stopFire();
                if (this.contains(enemyAir)) {
                    this.removeChild(enemyAir);
                }
                game.airfight.Airfight.reclaim(game.airfight.Airfight.TYPE_ENEMY_AIRFIGHT, enemyAir);
            }
            //显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = (this.stageW - this.scorePanel.width) / 2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);
        };
        return GameContainer;
    }(egret.DisplayObjectContainer));
    game.GameContainer = GameContainer;
    __reflect(GameContainer.prototype, "game.GameContainer");
})(game || (game = {}));
//# sourceMappingURL=GameContainer.js.map