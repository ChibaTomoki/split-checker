const mongoose = require('mongoose')

const connetDB = (url: any) => {
  console.log('connetDB() is called')
  return mongoose
    .connect(url)
    .then(() => console.log('データベースと接続中...'))
    .catch((err: any) => console.log(err))
}

export default connetDB
