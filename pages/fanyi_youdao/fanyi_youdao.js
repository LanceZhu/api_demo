Page({
  data: {
    //页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    image_path: '',
    info: {},
    info_display: 0,
    text: ''
  },

  longPress: function (e) {
    console.log(e);
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: wx.showToast({
        title: '复制到剪切板',
      }),
    })
  },

  bindTextAreaBlur: function (e) {
    console.log(e.detail.value);
    this.setData({
      text: e.detail.value
    })
  },

  submit: function (e) {
    console.log(this.data.text);
    var that = this;

    wx.request({
      url: 'http://localhost:3000/text_youdao/text_youdao',
      data: {
        text: this.data.text
      },
      method: 'POST',
      success(res) {
        let data = res.data;
        that.setData({
          info: JSON.parse(res.data),
          info_display: 1
        });
        console.log(that.data.info.translation);
        console.log(data);
      },
      fail(err) {
        console.log('err');
        console.log(err)
      }
    });
  },

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