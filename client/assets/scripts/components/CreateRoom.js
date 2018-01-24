cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _leixingxuanze: null, //类型选择
        _gamelist: null,    //游戏目录
        _currentGame: null,   //目前游戏
    },

    // use this for initialization
    onLoad: function () {

        this._gamelist = this.node.getChildByName('game_list');//将房间规则和游戏类型选择组件赋值给_gamelist

        this._leixingxuanze = [];//新建一个类型选择数组，用来存储选定的游戏类型，类型有两种"血战到底"和"血流成河"
        var t = this.node.getChildByName("leixingxuanze");// 获取类型选择组件
        for (var i = 0; i < t.childrenCount; ++i) { //node.childrenCount   该节点下子节点的数目
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) { //如果用户对游戏类型进行选择的话，则向_leixingxuanze数组中添加该选择模式的RadioButton节点
                this._leixingxuanze.push(n);
            }
        }
    },

    onBtnBack: function () {
        this.node.active = false;  //取消按钮被点击时，关闭创建房间界面
    },

    onBtnOK: function () {
        var usedTypes = ['xzdd', 'xlch'];  //定义数组，存储两种类型玩法  血战到底 血流成河
        var type = this.getType();  //定义类型变量，用于返回值的接收
        if (usedTypes.indexOf(type) == -1) {  //如果在usedTypes的数组中没有出现type返回的类型等于-1，直接返回；
            return;
        }

        this.node.active = false; //如果房间类型没被选定，则不执行这一步,反之执行
        this.createRoom(); //如果房间类型没被选定，则不执行这一步,反之执行，调用创房指令
    },

    getType: function () { //获取房间类型
        var type = 0;  //设置房间玩法的默认选项为血战到底玩法
        for (var i = 0; i < this._leixingxuanze.length; ++i) {
            if (this._leixingxuanze[i].checked) {  //this.node.checked  当节点被选中时，设置type为选中的参数
                type = i;
                break;
            }
        }
        if (type == 0) { //根据type值返回相关玩法类型
            return 'xzdd';
        }
        else if (type == 1) {
            return 'xlch';
        }
        return 'xzdd';  //默认选项
    },

    getSelectedOfRadioGroup(groupRoot) { //与选房类似操作，对选择进行判断
        console.log(groupRoot);
        var t = this._currentGame.getChildByName(groupRoot);

        var arr = [];
        for (var i = 0; i < t.children.length; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                arr.push(n);
            }
        }
        var selected = 0;
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i].checked) {
                selected = i;
                break;
            }
        }
        return selected;
    },

    createRoom: function () {
        var self = this;
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if (ret.errcode == 2222) {
                    cc.vv.alert.show("提示", "钻石不足，创建房间失败!");
                }
                else {
                    cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
                }
            }
            else {
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var type = this.getType();
        var conf = null;
        if (type == 'xzdd') {
            conf = this.constructSCMJConf();
        }
        else if (type == 'xlch') {
            conf = this.constructSCMJConf();
        }
        conf.type = type;

        var data = {
            account: cc.args["uid"],
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        console.log(data);
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    },

    constructSCMJConf: function () {   //自定义规则选择

        var wanfaxuanze = this._currentGame.getChildByName('wanfaxuanze');
        var huansanzhang = wanfaxuanze.children[0].getComponent('CheckBox').checked;
        var jiangdui = wanfaxuanze.children[1].getComponent('CheckBox').checked;
        var menqing = wanfaxuanze.children[2].getComponent('CheckBox').checked;
        var tiandihu = wanfaxuanze.children[3].getComponent('CheckBox').checked;

        var difen = this.getSelectedOfRadioGroup('difenxuanze');
        var zimo = this.getSelectedOfRadioGroup('zimojiacheng');
        var zuidafanshu = this.getSelectedOfRadioGroup('zuidafanshu');
        var jushuxuanze = this.getSelectedOfRadioGroup('xuanzejushu');
        var dianganghua = this.getSelectedOfRadioGroup('dianganghua');
        
        var conf = {
            difen:difen,
            zimo:zimo,
            jiangdui:jiangdui,
            huansanzhang:huansanzhang,
            zuidafanshu:zuidafanshu,
            jushuxuanze:jushuxuanze,
            dianganghua:dianganghua,
            menqing:menqing,
            tiandihu:tiandihu,   
        };
        return conf;
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        var type = this.getType();
        if (this.lastType != type) {
            this.lastType = type;
            for (var i = 0; i < this._gamelist.childrenCount; ++i) {
                this._gamelist.children[i].active = false;
            }

            var game = this._gamelist.getChildByName(type);
            if (game) {
                game.active = true;
            }
            this._currentGame = game;
        }
    },
});