// miniprogram/pages/message/message.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMessage : [],
    logged : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(1)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(2)
    if( app.userInfo._id ){
      this.setData({
        logged : true,
        userMessage : app.userMessage
      });
    }else{
      wx.showToast({
        title: '请先登陆',
        duration: 2000,
        // 然后不要让它显示图标
        icon: 'none',
        success: () => {
          // 如果成功的话就直接跳转到我的页面去
          // 但是注意了这里不能用 navigator to，因为它主要是跳转
          // 普通的页面，而这里“我的页面”其实是同tabbar来进行配置的
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user',
            })
          }, 2000);
        }
      })
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onMyEvent(ev){
    this.setData({
      userMessage : []
    },()=>{
        this.setData({
          userMessage : ev.detail
        });
    });
  }
  
})