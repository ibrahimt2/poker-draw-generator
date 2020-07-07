const {
    putCardGetNumAceHigh,
    putNumGetCardValueAceHigh,
  } = require("./convertor.js");
  
  const {
    populateZoneArr,
    depopulateAvailableNumArrUsingZoneArr,
  } = require("./straightPrevention");
  
  const {
    isFlushDraw,
    hasDuplicates,
    getRemainingCardsOfSameValue,
    getRemainingCardsOfSameSuit,
    removeDuplicates,
    moveElement
  } = require("./utilities");
  

/**
 * Summary.
 * Takes in 2 cards and generates
 * a flop that results in a flush draw
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

function generateFlushDraw(hole1, hole2) {
    let flopArr = [];
    let outsArr = [];
    let suits = ["h", "d", "s", "c"];
    let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let convertor = putCardGetNumAceHigh;
    let backConvertor = putNumGetCardValueAceHigh;
    let hole1ZonesArr = [];
    let hole2ZonesArr = [];
    let completeFlopInformation = {};
    let flopArrNums;
    let flopArrCards;
    let hole1Suit;
    let hole2Suit;
    let flushSuit;
    let holeCardsAreSuited = false;
    let nonFlushSuitsArr = ["h", "d", "s", "c"];
  
    // console.log("generateFlushDraw fired...");
  
    //Converts cards using decided conversion scheme
    hole1Converted = convertor[hole1];
    hole2Converted = convertor[hole2];
  
    //Ensures hole1Converted < hole2Converted
    if (hole1Converted > hole2Converted) {
      let temp = hole1Converted;
      hole1Converted = hole2Converted;
      hole2Converted = temp;
    }
  
    //Extract holeSuits
    hole1Suit = hole1.charAt(hole1.length - 1);
    hole2Suit = hole2.charAt(hole2.length - 1);
  
    //Check is hole cards are suited
    if (hole1Suit === hole2Suit) {
      holeCardsAreSuited = true;
    }
  
    //Select which hole card the flush will be created with
    if (Math.random() < 0.5) {
      flushSuit = hole1Suit;
    } else {
      flushSuit = hole2Suit;
    }
  
    //Remove flushSuit from the nonFlushSuitsArr
    nonFlushSuitsArr.splice(nonFlushSuitsArr.indexOf(flushSuit), 1);
  
    //Implementing straight generation protection
  
    populateZoneArr(hole1ZonesArr, availableNumberArr, hole1Converted);
  
    //Filters out zone arrays who don't have more than 1 element
    hole1ZonesArr = hole1ZonesArr.filter((zoneArray) => {
      return zoneArray.length > 1;
    });
  
    depopulateAvailableNumArrUsingZoneArr(
      hole1ZonesArr,
      availableNumberArr,
      hole1Converted,
      hole2Converted
    );
    populateZoneArr(hole2ZonesArr, availableNumberArr, hole2Converted);
  
    //Filters out zone arrays who don't have more than 1 element
    hole2ZonesArr = hole2ZonesArr.filter((zoneArray) => {
      return zoneArray.length > 1;
    });
  
    depopulateAvailableNumArrUsingZoneArr(
      hole2ZonesArr,
      availableNumberArr,
      hole1Converted,
      hole2Converted
    );
  
    //Removes numbers corresponding to hole cards from available pool
    availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
    availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);
  
    //console.log(availableNumberArr);
  
    //Pick 3 numbers from availableNumberArr
    moveElement(
      Math.floor(Math.random() * availableNumberArr.length),
      availableNumberArr,
      flopArr
    );
  
    //If hole cards are suited, then the suit of the last card won't be flopSuit, so it can have the same value as secondlast flopArrCard without risking duplication, as they're bound
    //to have different suits
  
    //This is not the case when hole cards are not suited
    if (holeCardsAreSuited) {
      flopArr.push(
        availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
      );
      flopArr.push(
        availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
      );
    } else {
      moveElement(
        Math.floor(Math.random() * availableNumberArr.length),
        availableNumberArr,
        flopArr
      );
      flopArr.push(
        availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
      );
    }
  
    //Preserve information in flopArr for completeFlopInformation methods
    flopArrNums = flopArr;
  
    //Converts the numbers back into the card values they represent
    flopArrCards = flopArr.map((flopNum) => backConvertor[flopNum]);
  
    //Creates and partially populates flopAndHoleCardArr
    let flopAndHoleCardArr = [hole1, hole2];
  
    //Preserves information in case a reset is needed below due to flushDraw or duplicates
    flopArr = flopArrCards;
  
    flopArr[0] = flopArr[0].concat(flushSuit);
    flopArr[1] = flopArr[1].concat(flushSuit);
  
    if (holeCardsAreSuited) {
      flopArr[2] = flopArr[2].concat(
        nonFlushSuitsArr[Math.floor(Math.random() * nonFlushSuitsArr.length)]
      );
    } else {
      flopArr[2] = flopArr[2].concat(flushSuit);
    }
  
    //Insert flopArr cards into flopAndHoleCardArr
    flopAndHoleCardArr.push.apply(flopAndHoleCardArr, flopArr);
  
    //console.log(flopAndHoleCardArr + "flopAndHoleArr")
  
    populateFlushOutsArr(
      hole1Converted,
      hole2Converted,
      hole1,
      hole2,
      flopAndHoleCardArr,
      flushSuit,
      flopArrNums,
      outsArr
    );
  
    outsArr = removeDuplicates(outsArr)
  
    //console.log('Outs:' + outsArr)
    populateFlushFlopInformation(
      hole1Converted,
      hole2Converted,
      hole1,
      hole2,
      flopArr,
      outsArr,
      flopArrNums,
      completeFlopInformation
    );
  
    //console.log(completeFlopInformation);
    return completeFlopInformation;
  }
  
/**
 * Summary.
 * Populates completeFlopInformation depending
 * on whether there are one overcards or two overcard
 *
 * Depending on the original hole cards
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

function populateFlushFlopInformation(
    hole1Converted,
    hole2Converted,
    hole1,
    hole2,
    flopArr,
    outsArr,
    flopArrNums,
    completeFlopInformation
  ) {
    completeFlopInformation["outCards"] = outsArr;
    if (
      flopArrNums.every((el) => el < hole1Converted) &&
      flopArrNums.every((el) => el < hole2Converted)
    ) {
      completeFlopInformation["outs"] = 15;
      completeFlopInformation["holeCards"] = [hole1, hole2];
      completeFlopInformation["flopCards"] = flopArr;
      completeFlopInformation["name"] = "Flush Draw & Two Overcards";
    } else if (
      flopArrNums.every((el) => el < hole1Converted) ||
      flopArrNums.every((el) => el < hole2Converted)
    ) {
      completeFlopInformation["outs"] = 12;
      completeFlopInformation["holeCards"] = [hole1, hole2];
      completeFlopInformation["flopCards"] = flopArr;
      completeFlopInformation["name"] = "Flush Draw & One Overcards";
    } else {
      completeFlopInformation["outs"] = 9;
      completeFlopInformation["holeCards"] = [hole1, hole2];
      completeFlopInformation["flopCards"] = flopArr;
      completeFlopInformation["name"] = "Flush Draw";
    }
  }

/**
 * Summary.
 * Populates flush draw outs array
 *
 */

function populateFlushOutsArr(
    hole1Converted,
    hole2Converted,
    hole1,
    hole2,
    flopAndHoleCardArr,
    flushSuit,
    flopArrNums,
    outsArr
  ) {
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameSuit(flushSuit, flopAndHoleCardArr)
    );
    if (
      flopArrNums.every((el) => el < hole1Converted) &&
      flopArrNums.every((el) => el < hole2Converted)
    ) {
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
      );
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
      );
    } else if (
      flopArrNums.every((el) => el < hole1Converted) ||
      flopArrNums.every((el) => el < hole2Converted)
    ) {
      if (hole1Converted > hole2Converted) {
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );
      } else {
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      }
    } else {
    }
  }

module.exports = {
    generateFlushDraw: generateFlushDraw
}
  
  
  console.log(generateFlushDraw("Kc", "2c"));
console.log(generateFlushDraw("Ac", "Kc"));