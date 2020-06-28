 // miniprogram/pages/index/index.js
const db =wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
      listData : [],
      current　: 'links'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData();
    this.getBannerList();
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
  handleLinks(ev){
    let id = ev.target.dataset.id;
  //  name就是云函数的名字，data就是要往云函数中传递的参数
  //  doc就是当前要给点赞的这个用户的id，其实就是唯一标识
  wx.cloud.callFunction({
    name: 'update',
    data: {
      collection : 'users',
      doc : id,
      data: "{links : _.inc(1)}"
  }
  }).then((res)=>{
    // console.log(res);  
    let updated = res.result.stats.updated;
    if(updated){
      // 先用扩展运算符 克隆一份数组
      let cloneListData = [...this.data.listData];
      for(let i = 0;i < cloneListData.length ; i++){
        if( cloneListData[i]._id == id){ 
          cloneListData[i].links++;
        }
      }
      this.setData({
        listData : cloneListData
      });
    }
  });
  },
  handleCurrent(ev){
    let current = ev.target.dataset.current;
    if( current == this.data.current){
      return false;
    }
    this.setData({
      current : current
    },()=>{
      this.getListData();
    });
    
  },
  getListData(){
    db.collection('users')
      .field({
        userPhoto: true,
        nickName: true,
        links: true
      })
      .orderBy(this.data.current, 'desc')
      .get()
      .then((res) => {
        // console.log(res.data)
        this.setData({
          listData: res.data
        });
      });
  },
  handleDetail(ev){
    console.log(ev);
    let id = ev.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id
    })
  },
  getBannerList(){
    db.collection('banner').get().then((res)=>{
      // console.log( res.data );
      this.setData({
        imgUrls : res.data
      });
    });
  }
})