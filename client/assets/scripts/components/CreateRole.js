cc.Class({
    extends: cc.Component,

    properties: {
        inputName:cc.EditBox, //创建一个输入框实例
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    
    onRandomBtnClicked:function(){  //随机生成名称按钮方法
        var names = [
            "上官",
            "欧阳",
            "东方",
            "端木",
            "独孤",
            "司马",
            "南宫",
            "夏侯",
            "诸葛",
            "皇甫",
            "长孙",
            "宇文",
            "轩辕",
            "东郭",
            "子车",
            "东阳",
            "子言",
        ];
        
        var names2 = [
            "雀圣",
            "赌侠",
            "赌圣",
            "稳赢",
            "不输",
            "好运",
            "自摸",
            "有钱",
            "土豪",
        ];
        var idx = Math.floor(Math.random() * (names.length - 1)); //从姓中随机选取一个姓
        var idx2 = Math.floor(Math.random() * (names2.length - 1));  //从名中随机选取一个名
        this.inputName.string = names[idx] + names2[idx2];  //修改输入框实例的文本
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){  //屏幕适配
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.onRandomBtnClicked(); //调用名称生成方法
    },

    onBtnConfirmClicked:function(){  //确定生成用户
        var name = this.inputName.string;  //获取输入框文本
        if(name == ""){ //对用户输入进行判断，如果用户没有进行输入为空，则调用以下处理方法
            console.log("invalid name.");
            return;
        }
        console.log(name);
        cc.vv.userMgr.create(name);  //调用userMgr脚本中的create方法,create方法发送信息给服务端。服务端反馈消息给Create->Login进入大厅
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
