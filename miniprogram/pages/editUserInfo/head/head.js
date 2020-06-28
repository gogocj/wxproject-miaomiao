// miniprogram/pages/editUserInfo/head/head.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto : ''
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
      this.setData({
        userPhoto : app.userInfo.userPhoto
      })
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
  handleUploadImage() {
    wx.chooseImage({
      // 这个count表示的是用户可以同时选择多少张图片
      count: 1,
      // 这个type就是可以选择其中一个的，我们选择了压缩图片类型
      sizeType: ['compressed'],
      // 这里表示的就是从相册中招还是直接拍照
      sourceType: ['album', 'camera'],
      // success(res) {
      //   // tempFilePath可以作为img标签的src属性显示图片
      //   const tempFilePaths = res.tempFilePaths
      // }
    }).then((res) => {
      // console.log(res)
      const tempFilePaths = res.tempFilePaths[0];
      this.setData({
        userPhoto: tempFilePaths
      })
    });
  },
  handleBtn(){
    wx.showLoading({
      title : '上传中'
    })
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() +  ".jpg";
    // 因为小程序上传图片是有缓存的,所以就要添加随机数和时间戳了
    // 我们这里不搞这些,这些太麻烦了,我们就是每次都是上传一个新的地址,而不是进行覆盖了
    // 所以要每次上传的地址都是新的话，就可以添加一个时间戳
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.userPhoto // 文件路径
    }).then((res)=>{
      // 这里的res是返回了一个重要的值 fileID
      // console.log(res);
      // 下面进行的是数据库的更新，因为上面主要是对云开发的存储中进行了更新的
      let fileID = res.fileID;
      if(fileID){
        db.collection('users').doc(app.userInfo._id).update({
          data:{
            userPhoto : fileID
          }
        }).then((res)=>{
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功',
          });
          // 最后这个就是为了返回到“我的页面”中也进行了更新的操作了
          app.userInfo.userPhoto = fileID;
        });
      }
    });
  },
  bindGetUserInfo(ev){
    let userInfo = ev.detail.userInfo;
    if (userInfo) {
      this.setData({
        // 注意了这个时候就不是用userinfo.userphoto，而是用一个叫做
        // avatarurl的东西了
        userPhoto: userInfo.avatarUrl
      }, () => {
        wx.showLoading({
          title: '上传中'
        })
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userPhoto: userInfo.avatarUrl
          }
        }).then((res) => {

          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功',
          });
          // 最后这个就是为了返回到“我的页面”中也进行了更新的操作了
          app.userInfo.userPhoto = userInfo.avatarUrl;
        });
        
      });
      // 用于是异步的，不能直接用 this.updateNickName()的，
      // 这里就可以使用setData的的二个参数来进行回调了
    }
  }
})