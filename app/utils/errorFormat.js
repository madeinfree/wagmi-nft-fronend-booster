export const mintErrorFormat = (error) => {
  if (error.error.code === -32603) {
    return `${error.error.message} - 預期此交易可能會執行失敗!`
  }
}
