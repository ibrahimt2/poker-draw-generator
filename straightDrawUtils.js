/**
 * Summary.
 * Goes through deck and populates the internalArr
 * This is the set of cards which falls in between the 2 hole cards
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} internalArr
 */

function populateInternalArr(hole1Converted, hole2Converted, internalArr) {
    for (let i = hole1Converted + 1; i < hole2Converted; i++) {
      internalArr.push(i);
    }
  
    //console.log("Internal Card Array: " + internalArr);
  }
  

  module.exports = {
      populateInternalArr: populateInternalArr
  }