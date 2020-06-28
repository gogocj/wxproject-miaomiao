// miniprogram/pages/user/user.js
// 初始化数据库
const db=wx.cloud.database()

// 拿到app.js里面的this出现
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto:"/images/user/头像.png",
    nickName:"小喵喵",
    // 是否同意登陆,初始化为不同意
    logged:false,
    disabled : true,
    id : ''
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

    this.getLocation();


    wx.cloud.callFunction({
      name : "login",
      // 这个就是云函数的名字即可
      data : {}
    }).then((res)=>{
      // console.log(res);
      db.collection('users').where({
        _openid : res.result.openid
      }).get().then((res)=>{
      //  就要判断一下这个用户有没有登陆过
        if(res.data.length){
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            logged: true,
            id : app.userInfo._id
          });
          this.getMessage();
        }
        else{
          this.setData({
            disabled : false
          })
        }
      });
         
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhoto : app.userInfo.userPhoto,
      nickName : app.userInfo.nickName,
      id: app.userInfo._id
    })
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
  bindGetUserInfo(ev){
      // console.log(ev);
      let userInfo = ev.detail.userInfo;
      if(!this.data.logged && userInfo){
        // 数据库云插入 用户信息操作
         db.collection('users').add({
           data:{
            //  获取用户的微信头像
            userPhoto:userInfo.avatarUrl,
            nickName:userInfo.nickName,
            // 个人签名
            signature:'',
            // 电话号码
            phoneNumber: '',
            // 微信号
            weixinNumber:'',
            // 点赞数
            links:0,
            // 当前注册的时间
            time: new Date(),
            //初始的时候默认是开启位置共享的
             isLocation  : true,
             friendList : [],
             longitude : this.longitude,
             latitude : this.latitude,
             location: db.Geo.Point(this.longitude, this.latitude)
            // 上面空的字段都是授权的时候获取不了的，要用户自己填写的
           } //这个就是为了查看用户上传的是不是成功的，符合了ES6的promise
         }).then((res)=>{
            db.collection('users').doc(res._id).get().then((res)=>{
              // console.log(res.data);
              // 注意这里不可以直接给app赋值如：
              // app.userInfo = res.data
            // 而是用js中的拷贝一份
            app.userInfo = Object.assign(app.userInfo , res.data);
            // 更新数据
            console.log(res.data);
            this.setData({
              userPhoto : app.userInfo.userPhoto,
              nickName : app.userInfo.nickName,
              logged : true,
              id: app.userInfo._id
            })
            });
         });//如果是失败的话一般也是在后面直接用catch
      }

  },
  getMessage(){
    db.collection('message').where({
      userId : app.userInfo._id
    }).watch({
      onChange: function (snapshot) {
    //  console.log(snapshot)
        if( snapshot.docChanges.length){
          //这里就可以直接拿到message里面所对应的消息列表了
          let list = snapshot.docChanges[0].doc.list;
          if( list.length ){
            wx.showTabBarRedDot({
              index: 2,
            });
            app.userMessage = list;
          }
          else{
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.userMessage = [];
          }
        }
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    });
  },
  getLocation(){
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.latitude = res.latitude
        this.longitude = res.longitude
       
      }
    })
  }
})