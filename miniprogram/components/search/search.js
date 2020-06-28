// components/search/search.js

const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus : false,
    historyList : [],
    searchList : []
  },

  /**
   * 组件的方法列表
   */
  methods: {

    handleFocus(){

      wx.getStorage({
        key: 'searchHistory',
        success:(res)=> {
          this.setData({
            historyList: res.data
          });
        }
      })

     this.setData({
       isFocus : true
     }); 
    },
    handleCancel(){
      this.setData({
        isFocus: false
      }); 
    },
    handleConfirm(ev){
      // console.log(ev.detail.value);
      let value = ev.detail.value;
      let cloneHistoryList = [...this.data.historyList];
      cloneHistoryList.unshift(value);
      wx.setStorage({
        key: "searchHistory",
        data: [...new Set(cloneHistoryList)]
      });
      this.changeSearchList(value);
    },
    handleHistoryDelete(){
      wx.removeStorage({
        key: 'searchHistory',
        success:(res)=>{
          this.setData({
            historyList : []
          });

        }
      })
    },
    changeSearchList(value){
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value ,
          options: 'i',
        })
      }).field({
        userPhoto : true,
        nickName : true
      }).get().then((res)=>{
        console.log(res);
        this.setData({
          searchList : res.data
        });
      });
    },
    handleHistoryItemDel(ev){
      let value = ev.target.dataset.text;
      // console.log(value);
      this.changeSearchList(value);
    }
  }
})
