const {
  putCardGetNumAceHigh,
  putNumGetCardValueAceHigh,
} = require("./convertor.js");

const {
  populateZoneArr,
  depopulateAvailableNumArrUsingZoneArr,
} = require("./straightPrevention");

const {
  removeDuplicates,
  isFlushDraw,
  hasDuplicates,
  getRemainingCardsOfSameValue,
} = require("./utilities");

/**
 * Summary.
 * Takes in 2 cards and generates
 * a flop that results in 'OnePairToTwoPairOrTrips'
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

function generateOnePairToTwoPairOrTrips(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let onePairHole1Suits = ["h", "d", "s", "c"];
  let onePairHole2Suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = putCardGetNumAceHigh;
  let backConvertor = putNumGetCardValueAceHigh;
  let hole1ZonesArr = [];
  let hole2ZonesArr = [];
  let completeFlopInformation = {};
  let flopAndHoleCardArr;
  let flopArrNums;
  let outsArr = [];

  //console.log("generateOnePairToTwoPairOrTrips fired...");

  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Error messages
  if (hole1Converted === hole2Converted) {
    console.log("This function is not designed for pocket pairs");
    return;
  }

  // //Just remove numbers corresponding to hole cards from available pool
  // availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  // availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

  //Ensure that when you are assigning suits to flop two
  //pair matches, you don't put a hole card into the flop
  onePairHole1Suits.splice(
    onePairHole1Suits.indexOf(hole1.charAt(hole1.length - 1)),
    1
  );
  onePairHole2Suits.splice(
    onePairHole2Suits.indexOf(hole2.charAt(hole2.length - 1)),
    1
  );

  //Insert card with the same value as one of the hole cards & assign suit into flopArr
  if (Math.random() < 0.5) {
    flopArr.push(hole1Converted);
    flopArr[0] = backConvertor[flopArr[0]];
    flopArr[0] = flopArr[0].concat(
      onePairHole1Suits[Math.floor(Math.random() * onePairHole1Suits.length)]
    );
  } else {
    flopArr.push(hole2Converted);
    flopArr[0] = backConvertor[flopArr[0]];
    flopArr[0] = flopArr[0].concat(
      onePairHole2Suits[Math.floor(Math.random() * onePairHole2Suits.length)]
    );
  }

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

  //Just remove numbers corresponding to hole cards from available pool
  availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

  //console.log("availableNumberArr: " + availableNumberArr);

  //Insert 2 numbers from availableNumberArr into flopArr
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );

  //Preserve flopArrNums incase a second attempt is needed when assigning flop suits
  flopArrNums = flopArr.slice(0);

  //Converts the numbers back into the card values they represent
  flopArr[1] = backConvertor[flopArrNums[1]];
  flopArr[2] = backConvertor[flopArrNums[2]];

  //Partially populates flopAndHoleCardArr
  flopAndHoleCardArr = [hole1, hole2];
  resetVariables = false;

  //Assigns suits to flopCards, and redoes it if a flush draw is generated
  do {
    if (resetVariables) {
      //   console.log('problem flopArr[1]:' + flopArr[1])
      //   console.log('problem flopArr[2]:' + flopArr[2])
      flopArr[1] = backConvertor[flopArrNums[1]];
      flopArr[2] = backConvertor[flopArrNums[2]];
      //   console.log('reattempt flopArr[1]:' + flopArr[1])
      //   console.log('reattempt flopArr[2]:' + flopArr[2])
      flopAndHoleCardArr = [hole1, hole2];
      resetVariables = false;
    }
    // console.log(flopArr[1]);
    flopArr[1] = flopArr[1].concat(
      suits[Math.floor(Math.random() * suits.length)]
    );
    flopArr[2] = flopArr[2].concat(
      suits[Math.floor(Math.random() * suits.length)]
    );

    flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

    if (isFlushDraw(flopAndHoleCardArr) || hasDuplicates(flopAndHoleCardArr)) {
      //   console.log('reattemping suit!!!!!!!!!!!!!!!!!!!!')
      //   console.log('!!!!!!!!!!!!!!!!!!!!')
      //   console.log('!!!!!!!!!!!!!!!!!!!!')

      resetVariables = true;
    }
  } while (
    isFlushDraw(flopAndHoleCardArr) ||
    hasDuplicates(flopAndHoleCardArr)
  );

  populateOnePairToTwoPairOrTripsOutsArr(
    hole1,
    hole2,
    flopAndHoleCardArr,
    outsArr
  );

  outsArr = removeDuplicates(outsArr);

  //Populate completeFlopInformation with information about the flop
  completeFlopInformation["outCards"] = outsArr;
  completeFlopInformation["outs"] = 5;
  completeFlopInformation["holeCards"] = [hole1, hole2];
  completeFlopInformation["flopCards"] = flopArr;
  completeFlopInformation["name"] = "One Pair to Two Pair or Trips";

  //console.log(completeFlopInformation);
  return completeFlopInformation;
}

function populateOnePairToTwoPairOrTripsOutsArr(
  hole1,
  hole2,
  flopAndHoleCardArr,
  outsArr
) {
  outsArr.push.apply(
    outsArr,
    getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
  );

  outsArr.push.apply(
    outsArr,
    getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
  );
}

module.exports = {
  generateOnePairToTwoPairOrTrips: generateOnePairToTwoPairOrTrips,
};

console.log(generateOnePairToTwoPairOrTrips("6c", "7d"));
console.log(generateOnePairToTwoPairOrTrips("6c", "7d"));
