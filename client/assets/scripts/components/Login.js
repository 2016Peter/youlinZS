String.prototype.format = function(args) { //接收服务器发回的参数，并对参数进行处理
    if (arguments.length>0) { 
        var result = this; 
        if (arguments.length == 1 && typeof (args) == "object") { 
            for (var key in args) { 
                var reg=new RegExp ("({"+key+"})","g"); 
                result = result.replace(reg, args[key]); 
            } 
        } 
        else { 
            for (var i = 0; i < arguments.length; i++) { 
                if(arguments[i]==undefined) { 
                    return ""; 
                } 
                else { 
                    var reg=new RegExp ("({["+i+"]})","g"); 
                    result = result.replace(reg, arguments[i]); 
                } 
            } 
        } 
        return result; 
    } 
    else { 
        return this; 
    } 
};
 
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
        _mima:null,
        _mimaIndex:0,
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){  //屏幕适配
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        
        if(!cc.vv){
            cc.director.loadScene("loading");  //如果cc.vv不存在的话，跳转到loading场景，进行重新登陆
            return;
        }
        cc.vv.http.url = cc.vv.http.master_url; //??????
        cc.vv.net.addHandler('push_need_create_role',function(){  //添加一个用户角色
            console.log("onLoad:push_need_create_role");
            cc.director.loadScene("createrole");   //跳转到创建用户角色界面
        });
        
        cc.vv.audioMgr.playBGM("bgMain.mp3");  //播放主背景音乐
        
        this._mima = ["A","A","B","B","A","B","A","B","A","A","A","B","B","B"];
        
        if(!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS){  //根据判断登陆的设备决定登陆的方式
            cc.find("Canvas/btn_yk").active = true;   //如果使用window或OS登陆，则调用游客登陆模式
            cc.find("Canvas/btn_weixin").active = false;
        }
        else{
            cc.find("Canvas/btn_yk").active = false;
            cc.find("Canvas/btn_weixin").active = true;  //如果不是使用window或OS登陆，则使用微信登陆
        }
    },
    
    start:function(){
        var account =  cc.sys.localStorage.getItem("wx_account"); //获取本地之前缓存的数据
        var sign = cc.sys.localStorage.getItem("wx_sign");   //获取本地微信登陆的用户标识
        if(account != null && sign != null && account != '' && sign != ''){ //判断本地是否有之前的用户登陆信息，如果有，默认为信息用户
            var ret = {
                errcode:0,
                account:account,
                sign:sign
            }
            cc.vv.userMgr.onAuth(ret);
        }   
    },
    
    onBtnQuickStartClicked:function(){ //挂载到canvas场景上的脚本，添加到相应的节点控件事件位置进行监听
        cc.vv.userMgr.guestAuth();   //调用userMgr脚本中的guestAuthor()方法
    },
    
    onBtnWeichatClicked:function(){  //挂载到canvas场景上的脚本，添加到相应的节点控件事件位置进行监听
        var self = this;
        cc.vv.anysdkMgr.login();  //调用anysdkMgr脚本的login()放法
    },
    
    onBtnMIMAClicked:function(event){  //挂载到canvas场景上的脚本，添加到相应的节点控件事件位置进行监听
        if(this._mima[this._mimaIndex] == event.target.name){
            this._mimaIndex++;
            if(this._mimaIndex == this._mima.length){
                cc.find("Canvas/btn_yk").active = true;
            }
        }
        else{
            console.log("oh ho~~~");
            this._mimaIndex = 0;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
