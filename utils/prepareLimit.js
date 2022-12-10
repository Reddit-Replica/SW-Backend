/**
 * Function used to prepare the limit that will be used by mongoose to limit the results
 *
 * @param {Number} listingLimit Time interval that we want to get the post in
 * @returns {Object} Object that will be used by mongoose to limit the results
 */
export function prepareLimit(listingLimit) {
  let result = null;
  if (!listingLimit && listingLimit !== 0) {
    result = 25;
  } else {
    listingLimit = parseInt(listingLimit);
    if (isNaN(listingLimit)) {
      result = 25;
    } else if (listingLimit > 100) {
      result = 100;
    } else if (listingLimit <= 0) {
      result = 1;
    } else {
      result = listingLimit;
    }
  }
  return result;
}
