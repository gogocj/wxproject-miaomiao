 // 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "gogocj-6skcv"
})
const db = cloud.database()
const _= db.command
// 下划线获取了运算的能力
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if(typeof event.data == 'string'){
      event.data =  eval('(' + event.data + ')')
    }
    // 这个判断就是，有doc的时候就用doc，如果没有的话就用where
    if( event.doc ){
      return await db.collection(event.collection).doc(event.doc)
        .update({
          data: {
            ...event.data
          },
        })
    }
    else{
      return await db.collection(event.collection).where({ ...event.where })
        .update({
          data: {
            ...event.data
          },
        })
    }
    
  } catch (e) {
    console.error(e)
  }
}