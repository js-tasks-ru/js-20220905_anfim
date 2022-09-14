/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj) {
    const keysArr = Object.keys(obj)
    const valuesArr = Object.values(obj)
    const result = {}
    valuesArr.forEach((v, i, a) => {
      result[v] = keysArr[i]
    })
    return result
  } else return
}
