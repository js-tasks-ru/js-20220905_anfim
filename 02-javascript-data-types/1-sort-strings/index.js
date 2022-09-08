/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let sortedArr = arr.slice().sort((a, b) => {
    let aLow = a.toLowerCase();
    let bLow = b.toLowerCase();
    if (aLow === bLow) {
      return (a[0] > b[0]) ? 1 : -1;
    }
    return aLow.localeCompare(bLow);
  });

  if (param === 'desc') {
    return sortedArr.reverse();
  } else {
    return sortedArr;
  }
}
