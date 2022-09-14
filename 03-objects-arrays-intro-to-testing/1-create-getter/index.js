/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArr = path.split('.')
  
  return (obj) => {
    if (!isEmpty(obj)) {
      let result = obj
      pathArr.forEach(item => {
        result = result[item]
      })
    return result
    } else return 
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}