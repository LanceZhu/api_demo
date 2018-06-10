Page({
  data: {
    //页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    info: [],
    text: '',
    info_display: 0
  },

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
  
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value);
    this.setData({
      text: e.detail.value
    })
  },

  submit: function(e){
    console.log(this.data.text);
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