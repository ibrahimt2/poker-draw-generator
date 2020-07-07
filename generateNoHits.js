const {
  populateZoneArr,
  depopulateAvailableNumArrUsingZoneArr,
} = require("./straightPrevention");

const {
  putCardGetNumAceHigh,
  putNumGetCardValueAceHigh,
} = require("./convertor.js");

const {
  isFlushDraw,
  hasDuplicates,
  getRemainingCardsOfSameValue,
} = require("./utilities");

/**
 * Summary.
 * Takes in 2 cards and generates a flop that results in no hits
 * that results in a draw of 'Pocket pair to trips' or
 * 'Two overcards to overpair' or 'One overcard to overpair' or
 * 'No pair to pair'
 *
 * Depending on the original hole cards
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

function generateNoHitsFlop(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = putCardGetNumAceHigh;
  let backConvertor = putNumGetCardValueAceHigh;
  let hole1ZonesArr = [];
  let hole2ZonesArr = [];
  let completeFlopInformation = {};
  let flopArrNums;
  let flopArrCards;
  let outsArr = [];

  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Ensures hole1Converted < hole2Converted
  if (hole1Converted > hole2Converted) {
    let temp = hole1Converted;
    hole1Converted = hole2Converted;
    hole2Converted = temp;
  }

  //Implementing straight generation protection

  //console.log("hole1Zones");
  populateZoneArr(hole1ZonesArr, availableNumberArr, hole1Converted);

  //console.log(hole1ZonesArr + hole1ZonesArr)

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

  //console.log("availableNumberArr after hole1Depop: " + availableNumberArr);

  //console.log("hole2Zones");
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

  //Pick 3 numbers from availableNumberArr
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );

  //Preserve information in flopArr for completeFlopInformation methods
  flopArrNums = flopArr;

  //Converts the numbers back into the card values they represent
  flopArrCards = flopArr.map((flopNum) => backConvertor[flopNum]);

  //Creates and partially populates flopAndHoleCardArr
  let flopAndHoleCardArr = [hole1, hole2];
  let resetVariables = false;

  //Preserves information in case a reset is needed below due to flushDraw or duplicates
  flopArr = flopArrCards;

  //Assigns suits to flopCards, and redoes it if a flush draw is generated or there are duplicate cards
  do {
    if (resetVariables) {
      flopArr = flopArrCards;
      flopAndHoleCardArr = [hole1, hole2];
    }

    flopArr = flopArr.map((flopCard) =>
      flopCard.concat(suits[Math.floor(Math.random() * suits.length)])
    );

    flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

    if (isFlushDraw(flopAndHoleCardArr) || hasDuplicates(flopAndHoleCardArr)) {
    //   console.log("reattemping suit");
      resetVariables = true;
    }
  } while (
    isFlushDraw(flopAndHoleCardArr) ||
    hasDuplicates(flopAndHoleCardArr)
  );

  //console.log(typeof isFlushDraw);
  //console.log(flopAndHoleCardArr + "flopAndHoleArr");
  //console.log(hole1 + "hole1");
  //console.log(hole2 + "hole2");

  populateNoHitsOutsArr(
    hole1Converted,
    hole2Converted,
    hole1,
    hole2,
    outsArr,
    flopArrNums,
    flopAndHoleCardArr
  );

  populateNoHitsFlopInformation(
    hole1Converted,
    hole2Converted,
    hole1,
    hole2,
    flopArr,
    flopArrNums,
    outsArr,
    completeFlopInformation
  );

  return completeFlopInformation;
}

/**
 * Summary.
 * Populates completeFlopInformation array with
 * information that needs to be communicated to the
 * client
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {String} hole1
 * @param {String} hole2
 * @param {Number[]} flopArr
 * @param {Number[]} flopArrNums
 * @param {Object} completeFlopInformation
 */

function populateNoHitsFlopInformation(
  hole1Converted,
  hole2Converted,
  hole1,
  hole2,
  flopArr,
  flopArrNums,
  outArr,
  completeFlopInformation
) {
  completeFlopInformation["outCards"] = outArr;

  //Populate completeFlopInformation with information about the flop
  if (hole1Converted === hole2Converted) {
    completeFlopInformation["outs"] = 2;
    completeFlopInformation["holeCards"] = [hole1, hole2];
    completeFlopInformation["flopCards"] = flopArr;
    completeFlopInformation["name"] = "Pocket pair to trips";
  } else if (
    flopArrNums.every((el) => el < hole1Converted) &&
    flopArrNums.every((el) => el < hole2Converted)
  ) {
    completeFlopInformation["outs"] = 6;
    completeFlopInformation["holeCards"] = [hole1, hole2];
    completeFlopInformation["flopCards"] = flopArr;
    completeFlopInformation["name"] = "Two overcards to overpair";
  } else if (
    flopArrNums.every((el) => el < hole1Converted) ||
    flopArrNums.every((el) => el < hole2Converted)
  ) {
    completeFlopInformation["outs"] = 3;
    completeFlopInformation["holeCards"] = [hole1, hole2];
    completeFlopInformation["flopCards"] = flopArr;
    completeFlopInformation["name"] = "One overcard to overpair";
  } else {
    completeFlopInformation["outs"] = 6;
    completeFlopInformation["holeCards"] = [hole1, hole2];
    completeFlopInformation["flopCards"] = flopArr;
    completeFlopInformation["name"] = "No pair to pair";
  }
}

function populateNoHitsOutsArr(
  hole1Converted,
  hole2Converted,
  hole1,
  hole2,
  outsArr,
  flopArrNums,
  flopAndHoleCardArr
) {
  //Populate completeFlopInformation with information about the flop
  if (hole1Converted === hole2Converted) {
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
    );
  } else if (
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
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
    );
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
    );
  }
}

module.exports = {
    generateNoHitsFlop: generateNoHitsFlop
}

console.log(generateNoHitsFlop("Ac", "Kd"));
console.log(generateNoHitsFlop("Ac", "2d"));
console.log(generateNoHitsFlop("8c", "8d"));
console.log(generateNoHitsFlop("6c", "7d"));
