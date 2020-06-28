// miniprogram/pages/detail/detail.js

const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detail : {},
      isFriend : false,
      isHidden : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    let userId = options.userId;
    db.collection('users').doc(userId).get().then((res)=>{
      console.log(res);
      this.setData({
        detail :　res.data
      });
      let friendList = res.data.friendList;
      if ( friendList.includes(app.userInfo._id )){
        this.setData({
          isFriend : true
        });
      }
      else{
        this.setData({
          isFriend : false
        },()=>{
          if ( userId == app.userInfo._id){
            // 当前用户看自己的详情页的时候
            this.setData({
              isFriend : true ,
              isHidden : true 
            });
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  
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
  handleAddFriend(){
      if( app.userInfo._id){
        db.collection('message').where({
          userId : this.data.detail._id
        }).get().then((res)=>{
 
            if( res.data.length){//更新 
              if( res.data[0].list.includes(app.userInfo._id)){
                  wx.showToast({
                    title: '已申请过！',
                  })
              }
              else{
                wx.cloud.callFunction({
                  // name也就是我们要修改的数据库的名字，data就是在云函数中
                  // 想要的参数了
                  name : 'update',
                  data : {
                    collection : 'message',
                    where :{
                        userId : this.data.detail._id
                    },
                    data : `{list : _.unshift('${app.userInfo._id}')}`
                  }
                }).then((res)=>{
                  wx.showToast({
                    title: '申请成功~'
                  })
                });
              }
            }
            else{  //tianjia1
              db.collection('message').add({
                data : {
                  userId : this.data.detail._id,
                  list : [ app.userInfo._id]
                }
              }).then((res)=>{
                wx.showToast({
                  title: '申请成功' 
                })
              });
            }
        });
      }
      else{
        wx.showToast({
          title: '请先登陆',
          duration : 2000,
          // 然后不要让它显示图标
          icon : 'none',
          success: ()=>{
            // 如果成功的话就直接跳转到我的页面去
            // 但是注意了这里不能用 navigator to，因为它主要是跳转
            // 普通的页面，而这里“我的页面”其实是同tabbar来进行配置的
         setTimeout(()=>{
           wx.switchTab({
             url: '/pages/user/user',
           })
         } , 2000);
          }
        })
      }
  }
})