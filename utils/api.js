// 获取新的token
const getNewTokenServe = () => {
  return uni.getStorageSync("STOKEN")
}

export {
  getNewTokenServe
}
