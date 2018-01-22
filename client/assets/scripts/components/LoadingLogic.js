cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel:cc.Label, //登陆显示节点
        _stateStr:'',    //节点文字
        _progress:0.0,   //进度条显示数据
        _splash:null,
        _isLoading:false   //登陆状态
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.tipLabel.string = this._stateStr;
        this.startPreloading();
    },
    
    startPreloading:function(){
        this._stateStr = "正在加载资源，请稍候"
        this._isLoading = true;
        var self = this;
        //cc.loader.onProgress 进度条
        cc.loader.onProgress = function ( completedCount, totalCount,  item ){
            //console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if(self._isLoading){
                self._progress = completedCount/totalCount;
            }
        };
        //cc.loader.loadResAll("textures",function(err,assets){  //1.3版本之后移除了cc.loader.loadResAll（）的API使用会出问题 
            self.onLoadComplete();
        //})
    },
    
    onLoadComplete:function(){
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.director.loadScene("login");
        cc.loader.onComplete = null;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._stateStr.length == 0){
            return;
        }
        this.tipLabel.string = this._stateStr + ' ';
        if(this._isLoading){
            this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
        }
        else{
            var t = Math.floor(Date.now() / 1000) % 4;
            for(var i = 0; i < t; ++ i){
                this.tipLabel.string += '.';
            }            
        }
    }
});