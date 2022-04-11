const ERROR_CANCEL = 'User rejected request'
const ERROR_REVERT = -32603

/**
 * @dev Formats contract response error message
 * @param {*} error
 * @returns string
 */
export const mintErrorFormat = (error) => {
  if (error?.error?.code === ERROR_REVERT) {
    return `${error.error.message} - 預期此交易可能會執行失敗!`
  }
  if (error.message === ERROR_CANCEL) {
    return `${error.message} - 交易取消!`
  }

  return `非預期錯誤`
}
