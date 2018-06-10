// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面配置
    winWidth: 0,
    winHeight: 0,
    categories: []
  },
  
  //页面跳转到类别list页
  jumpToList: function (e) {
    var categoryName = e.currentTarget.dataset.categoryName;
    wx.navigateTo({
      url: '../list/list?categoryName='+categoryName,
    })
  },

  scrollToLower: function(){
    var that = this;
    console.log('加载更多');
    setTimeout(function () {
      console.log('successsToLower');
    }, 1500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.showLoading({
      title: '拼命加载中...',
    });

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    wx.request({
      url: 'http://localhost:3000/categorys',
      method: 'GET',
      data: {
        
      },
      header: {

      },
      success: function (res) {
        var categories = 'categories';
        //console.log(res);
        that.setData({
          [categories]: res.data,
        })
      },
      fail: function(){
        var categories = 'categories';
        that.setData(
          {
                
          }
        )

      },
      complete: function(){
        that.setData({
          
        })
      }
    });

    wx.hideLoading();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      console.log('PullDownRefresh');
      wx.showNavigationBarLoading();
      //模拟加载
      setTimeout(function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log('加载更多');
    setTimeout(function(){
      console.log('successs');
    }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})