const { ccclass, property } = cc._decorator;

@ccclass
export default class NodeRockingBar extends cc.Component {
    @property(cc.Node)
    spr_rockingBg = null;
    @property(cc.Node)
    spr_bar = null;

    //参数
    _radious = null;

    //是否点中 spr_bar
    _onCheckedBar = false;

    onLoad() {
        this._radious = this.spr_rockingBg.width / 2;
        //对摇杆进行处理
        let self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                let touchPos = touch.getLocation();
                if (touchPos.x >= self.spr_bar.x - self.spr_bar.width / 2 && touchPos.x <= self.spr_bar.x + self.spr_bar.width / 2) {
                    if (touchPos.y >= self.spr_bar.y - self.spr_bar.height / 2 && touchPos.y <= self.spr_bar.y + self.spr_bar.height / 2) {
                        self._onCheckedBar = true;
                        self.spr_bar.setPosition(touchPos.x, touchPos.y);
                    }
                }
                return true;
            },
            onTouchMoved: function (touch, event) {
                let touchPos = touch.getLocation();
                if (self._onCheckedBar) {
                    self.spr_bar.setPosition(self.getBarPosition(touchPos));
                }
            },
            onTouchEnded: function (touch, event) {
                let touchPos = touch.getLocation();
                self.spr_bar.setPosition(self.spr_rockingBg.x, self.spr_rockingBg.y);
                self._onCheckedBar = false;
            }
        }, self.node);
    }

    getBarPosition(pos) {
        //相似三角型
        let length = cc.pDistance(pos, this.spr_rockingBg.getPosition());
        console.log(length);
        if (length >= this._radious) {
            
            pos.x = (pos.x - this.spr_rockingBg.x) * this._radious / length + this.spr_rockingBg.x;
            pos.y = (pos.y - this.spr_rockingBg.y) * this._radious / length + this.spr_rockingBg.y;
            console.log(pos);
        }
        
        return pos;
    }

    //返回的是一个方向
    getRockingData() {
        let posX = this.spr_bar.x - this.spr_rockingBg.x;
        let posY = this.spr_bar.y - this.spr_rockingBg.y;
        if (posX < -5 || posX > 5 || posY < -5 || posX > 5) {
            return cc.p(posX * 4, posY * 4);
        }
        return cc.p(0, 0);
    }
}