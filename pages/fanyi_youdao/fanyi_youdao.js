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
    text: '',
    translation_array:['汉','英','日','法','俄'],
    translation_array_code: ['zh-CHS','EN','ja','fr','ru'],
    source_index: 0,
    destination_index: 1,
    search_history: [],
    search_history_display: 1
  },

  /**
   * 通过历史查询消息查询
   */
  history_submit: function (e) {
    //console.log(e);

    var that = this;

    wx.request({
      url: 'http://localhost:3000/text_youdao/text_youdao',
      data: {
        text: e.currentTarget.dataset.content,
        from: e.currentTarget.dataset.from,
        to: e.currentTarget.dataset.to
      },
      method: 'POST',
      success(res) {
        let data = res.data;
        that.setData({
          info: JSON.parse(res.data),
          info_display: 1,
          search_history_display: 0
        });
        console.log(data);
        console.log(that.data.info.translation);
      },
      fail(err) {
        console.log('err');
        console.log(err)
      }
    });
  },

  /**
   * 清空搜索历史
   */
  clearHistory: function(){
    var that = this;

    wx.removeStorage({
      key: 'search_history',
      success: function(res) {
        console.log('clearHistory');
        that.setData({
          search_history_display: 0
        });
      },
    })
  },

  /**
   * 监控picker source 变化
   */
  sourceIndexChange: function(e){
    console.log('sourceIndex:'+e.detail.value);
    this.setData({
      source_index: e.detail.value
    });
  },

  /**
   * 监控picker destination 变化
   */
  destinationIndexChange: function (e) {
    console.log('destinationIndex:' + e.detail.value);
    this.setData({
      destination_index: e.detail.value
    });
  },

  /**
   * 长按粘贴
   */
  longPress: function (e) {
    console.log(e);
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: wx.showToast({
        title: '复制到剪切板',
      }),
    })
  },

  /**
   * 搜索区域 textarea 失去焦点后获取输入值
   */
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value);
    this.setData({
      text: e.detail.value
    })
  },

  /**
   * 提交查询
   */
  submit: function (e) {
    console.log(this.data.text);
    var that = this;

    that.data.search_history.push({ content: this.data.text, source: this.data.translation_array_code[this.data.source_index], destination: this.data.translation_array_code[this.data.destination_index] });

    wx.setStorage({
      key: 'search_history',
      data: this.data.search_history,
      success: function(){
        console.log('setStorage: success');
      }
    });

    wx.request({
      url: 'http://localhost:3000/text_youdao/text_youdao',
      data: {
        text: this.data.text,
        from: this.data.translation_array_code[this.data.source_index],
        to: this.data.translation_array_code[this.data.destination_index]
      },
      method: 'POST',
      success(res) {
        let data = res.data;
        that.setData({
          info: JSON.parse(res.data),
          info_display: 1,
          search_history_display: 0
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

    wx.getStorage({
      key: 'search_history',
      success: function(res) {
        console.log(res.data);
        that.setData({
          search_history: res.data
        })
      },
      fail: function () {
        console.log('getStorage: failure');
        that.setData({
          search_history_display: 0
        })
      }
    })

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