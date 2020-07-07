/**
 * Summary.
 * Directly depopulates availableNumberArr until it has only
 * 1 element overlap with each zone 1-4
 * For explanation of zones, see {name of whitepaper}
 *
 * Description.
 * Iterates through holeZonesArr, randomly splices out a
 * zoneArray from holeZonesArr, then randomly picks a number
 * from within chosen zoneArray.
 *
 *  If the number is equal to any hole card, does nothing
 *  and puts the chosenZoneArray back into holeZonesArr.
 *
 *  Else splices number out of availableNumberArr
 *
 * Repeats loop this until all holeZonesArr is empty
 *
 *
 * @param {Number[][]} holeZonesArr Array containing array containing numbers of the zones 1-4 of a hole
 * @param {Number[]} availableNumberArr
 */

function depopulateAvailableNumArrUsingZoneArr(
    holeZonesArr,
    availableNumberArr,
    hole1Converted,
    hole2Converted
  ) {
    while (holeZonesArr.length > 0) {
      let pickedZoneArr = holeZonesArr.splice(
        Math.floor(Math.random() * holeZonesArr.length),
        1
      ); //Apparently this returned a double nested array instead of a single array, hence the 0 below being necessary
      let pickedZoneArrNum =
        pickedZoneArr[0][Math.floor(Math.random() * pickedZoneArr.length)]; //The necessity of the 0 here is quite interesting
  
      if (
        pickedZoneArrNum === hole1Converted ||
        pickedZoneArrNum === hole2Converted
      ) {
        holeZonesArr.push(pickedZoneArr);
      } else {
        availableNumberArr.splice(
          availableNumberArr.indexOf(pickedZoneArrNum),
          1
        );
      }
    }
  }

/**
 * Summary.
 * Populates Zone 1 with numbers
 *
 * @param {Number[]} availableNumberArr
 * @param {Number} holeConverted
 * @param {Number[]} holeZone1Arr
 */

function populateZone1(availableNumberArr, holeConverted, holeZone1Arr) {
    if (holeConverted - 4 > 0 && availableNumberArr.includes(holeConverted - 4)) {
      holeZone1Arr.push(holeConverted - 4);
    }
  
    if (holeConverted - 3 > 0 && availableNumberArr.includes(holeConverted - 3)) {
      holeZone1Arr.push(holeConverted - 3);
    }
  }

/**
 * Summary.
 * Populates Zone 2 with numbers
 *
 * @param {Number[]} availableNumberArr
 * @param {Number} holeConverted
 * @param {Number[]} holeZone1Arr
 */

function populateZone2(availableNumberArr, holeConverted, holeZone2Arr) {
    if (holeConverted - 2 > 0 && availableNumberArr.includes(holeConverted - 2)) {
      holeZone2Arr.push(holeConverted - 2);
    }
  
    if (holeConverted - 1 > 0 && availableNumberArr.includes(holeConverted - 1)) {
      holeZone2Arr.push(holeConverted - 1);
    }
  }
  
/**
 * Summary.
 * Populates Zone 3 with numbers
 *
 * @param {Number[]} availableNumberArr
 * @param {Number} holeConverted
 * @param {Number[]} holeZone1Arr
 */

function populateZone3(availableNumberArr, holeConverted, holeZone3Arr) {
    if (
      holeConverted + 1 < 14 &&
      availableNumberArr.includes(holeConverted + 1)
    ) {
      holeZone3Arr.push(holeConverted + 1);
    }
  
    if (
      holeConverted + 2 < 14 &&
      availableNumberArr.includes(holeConverted + 2)
    ) {
      holeZone3Arr.push(holeConverted + 2);
    }
  }

/**
 * Summary.
 * Populates Zone 4 with numbers
 *
 * @param {Number[]} availableNumberArr
 * @param {Number} holeConverted
 * @param {Number[]} holeZone1Arr
 */

function populateZone4(availableNumberArr, holeConverted, holeZone4Arr) {
    if (
      holeConverted + 3 < 14 &&
      availableNumberArr.includes(holeConverted + 3)
    ) {
      holeZone4Arr.push(holeConverted + 3);
    }
  
    if (
      holeConverted + 4 < 14 &&
      availableNumberArr.includes(holeConverted + 4)
    ) {
      holeZone4Arr.push(holeConverted + 4);
    }
  }
  
/**
 * Summary.
 * Populates holeZonesArr with zone arrays 1-4
 *
 * @param {Number[][]} holeZonesArr
 * @param {Number[]} availableNumberArr
 * @param {Number} holeConverted
 */

function populateZoneArr(holeZonesArr, availableNumberArr, holeConverted) {
    let holeZone1Arr = [];
    let holeZone2Arr = [];
    let holeZone3Arr = [];
    let holeZone4Arr = [];
  
    populateZone1(availableNumberArr, holeConverted, holeZone1Arr);
    populateZone2(availableNumberArr, holeConverted, holeZone2Arr);
    populateZone3(availableNumberArr, holeConverted, holeZone3Arr);
    populateZone4(availableNumberArr, holeConverted, holeZone4Arr);
  
    holeZonesArr.push(holeZone1Arr);
    holeZonesArr.push(holeZone2Arr);
    holeZonesArr.push(holeZone3Arr);
    holeZonesArr.push(holeZone4Arr);
  
    //console.log("holeZone1Arr: " + holeZone1Arr);
    //console.log("holeZone2Arr: " + holeZone2Arr);
    //console.log("holeZone3Arr: " + holeZone3Arr);
    //console.log("holeZone4Arr: " + holeZone4Arr);
  }

module.exports = {
    populateZoneArr: populateZoneArr,
    depopulateAvailableNumArrUsingZoneArr: depopulateAvailableNumArrUsingZoneArr,

}