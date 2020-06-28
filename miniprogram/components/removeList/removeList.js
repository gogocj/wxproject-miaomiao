// components/removeList/removeList.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId : String
  },

  /**
   * 组件的初始数据
   */
  data: {
      userMessage : {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelMessage(){
      wx.showModal({
        title: '提示信息',
        content: '删除消息',
        confirmText : "删除",
        success : (res)=>{
          if (res.confirm) {
            this.removeMessage();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    handleAddFriend(){
      wx.showModal({
        title: '提示信息',
        content: '申请好友',
        confirmText: "同意",
        success: (res) => {
          if (res.confirm) {
              db.collection('users').doc(app.userInfo._id).update({
                data:{
                    friendList : _.unshift(this.data.messageId)
                }
              }).then((res)=>{});

          //其他用户和我构成好友的关系，用到客户端来实现（也就是用云函数来实现）
          wx.cloud.callFunction({
            name : 'update',
            data : {
              collection : 'users',
              doc : this.data.messageId,
              data : `{ friendList:  _.unshift('${app.userInfo._id}')}`
            }
          }).then((res)=>{});
          this.removeMessage();
          } else if (res.cancel) {
            console.log('用户点击取消')

          }
        }
      })
    },
    removeMessage(){
      //也就是点击了确定的话，就不提示这个了，而是删除信息
      //  目前没有直接更新的，智能是这个过程就变成了先查询然后再更新
      db.collection('message').where({
        userId: app.userInfo._id
      }).get().then((res) => {
        // console.log(res);
        let list = res.data[0].list;
        console.log(list);
        list = list.filter((val, i) => {
          return val != this.data.messageId
        });
        // console.log(list);
        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'message',
            where: {
              userId: app.userInfo._id
            },
            data: {
              list: list
            }
          }
        }).then((res) => {
          this.triggerEvent('myevent', list)
        });
      });
  }
  },  lifetimes: {
    
    attached: function () {
      // 一进来就会进行它了
      db.collection('users').doc(this.data.messageId)
      .field({
        userPhoto : true,
        nickName : true
      })
      .get().then((res)=>{
        this.setData({
            userMessage　: res.data
        });
      });
    }
  }
})
