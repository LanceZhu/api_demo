Page({
  data: {
    //页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    info: [],
    text: '',
    info_display: 0,
    //发音人选择，0：普通女生，1：普通男生，3：度逍遥，4：度丫丫
    per: '0',
    //语速 取值0-9 默认5为中语速
    spd: '5',
    //音调 取值0-9 默认5为中音调
    pit: '5',
    //音量 取值0-9 默认5为中音量 
    vol: '5',
    perList: [
      { title: "女声", checked: true, per: '0' },
      { title: "男声", checked: false, per: '1' },
      { title: "度逍遥", checked: false, per: '3' },
      { title: "度丫丫", checked: false, per: '4' },
    ]
  },

  /**
   * 检测多选框变化 用于检测 朗读人参数 per 的修改
   */
  checkboxChange: function(e){
    console.log(e);;
    var values = e.detail.value;
    var items = this.data.perList;
    /**
    console.log('values:');
    console.log(values);
    console.log('items:');
    console.log(items);
     */
    
    for(var i=0; i<items.length; i++){
      items[i].checked = false;
      if(values == items[i].title){
        console.log(values);
        items[i].checked = true;
        console.log(i);
      }
    };

    this.setData({
      perList: items
    });
  },

  per: function(e){
    console.log('tsaert');
    console.log(e.currentTarget.dataset.per);
    this.setData({
      per: e.currentTarget.dataset.per
    });
  },

  spd: function(e){
    console.log(e.detail.value);
    this.setData({
      spd: e.detail.value
    })
  },

  pit: function (e) {
    console.log(e.detail.value);
    this.setData({
      pit: e.detail.value
    })
  },

  /**
   * 下载语音合成函数
   */
  download: function(e){
    var that = this;
    console.log(this.innerAudioContext.src);
    wx.downloadFile({
      url: that.innerAudioContext.src,
      success(res){
        wx.saveFile({
          tempFilePath: res.tempFilePath[0],
          success: wx.showToast({
            title: '保存成功',
          })
        });
        console.log(res.tempFilePath);
      },
      fail(err){
        console.log('err');
        console.log(err);
      }
    })
  },
  
  /**
   * textarea 失去焦点 获得输入内容
   */
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value);
    this.setData({
      text: e.detail.value
    })
  },

  //提交 语音合成
  submit: function(e){
    console.log(this.data.text);
    var that = this;

    console.log(that.data.per);

    that.innerAudioContext = wx.createInnerAudioContext();
    that.innerAudioContext.autoplay = true;
    that.innerAudioContext.loop = false;
    wx.request({
      url: 'http://localhost:3000/speech_baidu/speech',
      data: {
        text: this.data.text,
        spd: this.data.spd,
        pit: this.data.pit,
        vol: this.data.pit,
        per: this.data.per
      },
      method: 'POST',
      success(res) {
        that.setData({
          info_display: 1
        });
        let data = res.data;
        if (data.ret === 0) {
          that.innerAudioContext.src = data.data.path + '?rnd=' + new Date().getTime();
          that.innerAudioContext.onPlay(() => {
            console.log('开始播放啦');
          });
          that.innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
          });
        } else {
          wx.showToast({
            title: data.msg,
          });
        }
      },
      fail(err) {
        console.log('err');
        console.log(err)
      },
      complete: function(){
        that.setData({
          info_display: 1
        });
      }
    });
  },

  /**
  audio_transfer: function(e){
    var that = this;

    that.innerAudioContext = wx.createInnerAudioContext();
    that.innerAudioContext.autoplay = true;
    that.innerAudioContext.loop = false;
    wx.request({
      url: 'http://localhost:3000/speech_baidu/speech',
      data: {
        text: this.data.text,
        spd: '6',
        pit: '3',
        vol: '8',
        per: '0'
      },
      method: 'POST',
      success(res) {
        let data = res.data;
        if (data.ret === 0) {
          that.innerAudioContext.src = data.data.path + '?rnd=' + new Date().getTime();
          that.innerAudioContext.onPlay(() => {
            console.log('开始播放啦');
          });
          that.innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
          });
        } else {
          wx.showToast({
            title: data.msg,
          });
        }
      },
      fail(err) {
        console.log('err');
        console.log(err)
      }
    });    
  },
   */

  /** 
  * 滑动切换tab 
  */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 点击分享
   */
  onShareAppMessage: function (res) {
    return {
      title: 'API Demo'
    }
  },

  onLoad: function (options) {
    let that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  }

})