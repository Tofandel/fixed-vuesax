/**
 * Checks if the flag is set
 * @param val
 * @param flag
 * @returns {boolean}
 */
function hasFlag(val, flag) {
  return (val & flag) === flag;
}

export default hasFlag;
