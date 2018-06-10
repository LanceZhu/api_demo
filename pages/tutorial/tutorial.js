var app = getApp()
Page({
  data: {
    //页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    info: [],
    city:'',
    wendu:''
  },

  submit: function (e) {
    var that = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city=北京',
      method: 'GET',
      success: function (res) {
        console.log(res.data.data.yesterday);
        that.setData({
          info: JSON.stringify(res.data.data.yesterday, null, '    '),
          city: res.data.data.city,
          wendu: res.data.data.wendu
        });
        console.log(JSON.stringify(res, null, '    '));
      },
      fail: {

      },
      complete: {

      }
    })
  },

  /**
   * 选择上传图片
   */
  image_upload: function(res){
    wx.chooseImage({
      success: function(res){
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.uploadFile({
          url: 'https://service.image.myqcloud.com/v1/detection/imagetag_detect',
          header: {
            'host': 'service.image.myqcloud.com',
            'content-type': 'multipart/form-data'
          },
          success: function(res){
            console.log(JSON.stringify(res, null, '    '));
          }
        })
        /**
        wx.previewImage({
          //current: tempFilePaths[0], // 当前显示图片的http链接
          urls: tempFilePaths // 需要预览的图片http链接列表
        });
         */
      }
    })
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

  onLoad: function () {
    var that = this;

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
