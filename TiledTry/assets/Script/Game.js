const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    //预置资源
    @property(cc.Node)
    node_rockingBar = null;
    @property(cc.Node)
    node_role = null;
    //@property(cc.Node)
    //node_camera = null;

    @property(cc.Node)
    node_map = null;

    //------ 数据 ------

    _gameTime = 0;
    _gameCount = 0;

    onLoad() {
        //cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        //开启碰撞检测
        //cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        //cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    }

    //------------ 响应事件 及 更新函数 ------------

    onClickBtn(event) {
        let btnN = event.target.name;
        console.log("--- Game click ---" + btnN);
        if (btnN == "") {
        }
    }

    updateMyData(dt) {
        if (this.node_rockingBar) {
            //根据摇杆 速度 方向
            let speedDir = this.node_rockingBar.getComponent("NodeRockingBar").getRockingData();

            //移动相机(在角色上)
            this.node_role.x = this.node_role.x + dt * speedDir.x;
            this.node_role.y = this.node_role.y + dt * speedDir.y;
        }
    }

    update(dt) {
        this.updateMyData(dt);

        //刷新游戏时间
        if (this._gameCount >= 1) {
            this._gameCount -= 1;
            --this._gameTime;

            //this.updateMyData(dt);
        }
        this._gameCount += dt;
    }
}