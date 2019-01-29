/**
 * Generate unique hash
 * 
 * @param {Number} length
 * 
 * @return {String}
 */
export default function (length = 5) {
  return Math.random().toString(36).substr(2, length)
}
