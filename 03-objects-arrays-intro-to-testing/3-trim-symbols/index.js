/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const strArr = string.split('')
  const splitedArr = strArr.reduce((prev,cur,i,arr) => {
    return (arr[i-1] === cur || i === 0) ? prev+cur : prev+'|'+cur;
  }, '').split('|')
  const result = splitedArr.map(item => (item.length > size) ? item.substr(0, size) : item)
  return result.join('')
}
