/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  if (param === 'asc') {
    const sortedAscArr = arr.slice().sort((a, b) => {
      return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
    });
    return sortedAscArr;
  } else if (param === 'desc') {
    const sortedDescArr = arr.slice().sort((a, b) => {
      return b.localeCompare(a, ['ru', 'en'], {caseFirst: 'upper'});
    });
    return sortedDescArr;
  }
}
