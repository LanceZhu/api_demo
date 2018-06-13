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
    plus_display: 1,
    text: ''
  },

  /**
   * 长按复制到剪切版
   */
  longPress: function(e){
    console.log(e);
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: wx.showToast({
        title: '复制到剪切板',
      }),
    })
  },

  /**
   * 从相册选取图片
   */
  chooseImageFromAlbum: function(){
    var that = this;

    that.setData({
      plus_display: 0
    });

    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          image_path: tempFilePaths[0]
        });
        //console.log(that.data.image_path);
        
        wx.uploadFile({
          url: 'http://localhost:3000/ocr_baidu/upload',
          filePath: tempFilePaths[0],
          name: 'image',
          success: function (res) {
            console.log(res);
            that.setData({
              info: JSON.parse(res.data),
              info_display: 1
            }),
            console.log(that.data.info.words_result);
          },
        });

        /**
        wx.previewImage({
          urls: [tempFilePaths[0]]
        })
         */
      },
      fail: function () {
        console.log('没有选择图片')
        that.setData({
          plus_display: 1,
          info_display: 0
        });
      },
    });
  },

  /**
   * 从相机选取图片
   */
  chooseImageFromCamera: function () {
    var that = this;

    that.setData({
      plus_display: 0
    });

    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          image_path: tempFilePaths[0]
        });
        //console.log(that.data.image_path);

        wx.uploadFile({
          url: 'http://localhost:3000/ocr_baidu/upload',
          filePath: tempFilePaths[0],
          name: 'image',
          success: function (res) {
            console.log(res);
            that.setData({
              info: JSON.parse(res.data),
              info_display: 1
            }),
              console.log(that.data.info.words_result);
          }
        });

        /**
        wx.previewImage({
          urls: [tempFilePaths[0]]
        })
         */
      },
      fail: function () {
        console.log('没有选择图片')
        that.setData({
          plus_display: 1,
          info_display: 0
        });
      },
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