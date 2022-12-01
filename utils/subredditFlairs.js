/**
 * A utility function used as a comparator for the built in sort function to sort the flairs based on their order
 * @param {Object} a the first flair object
 * @param {Object} b the second flair object
 * @returns {Integer} -1 if the first is smaller, 1 if the second is smaller, 0 if they are equal
 */
export function compareFlairs(a, b) {
  if (a.flairOrder < b.flairOrder) {
    return -1;
  }
  if (a.flairOrder > b.flairOrder) {
    return 1;
  }
  return 0;
}
