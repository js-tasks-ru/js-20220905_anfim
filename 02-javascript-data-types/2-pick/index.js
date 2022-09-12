/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const filterArr = Object.entries(obj).filter((elem) => {
    return fields.includes(elem[0]);
  });
  return Object.fromEntries(filterArr);
};
