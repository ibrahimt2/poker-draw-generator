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
 * a flop that results in 'TripsToFullhouseOrQuads'
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

function generateTripsToFullhouseOrQuads(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let tripsHole1Suits = ["h", "d", "s", "c"];
  let tripsHole2Suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = putCardGetNumAceHigh;
  let backConvertor = putNumGetCardValueAceHigh;
  let completeFlopInformation = {};
  let isPocketPair = false;
  let tripsHole1Hole2Suits;
  let outsArr = [];

  //console.log("generateTripsToFullhouseOrQuads fired...");

  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Error messages
  if (hole1Converted === hole2Converted) {
    isPocketPair = true;
  }

  //Removes numbers corresponding to hole cards from available pool
  availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

  //Ensure that when you are assigning suits to flop two
  //pair matches, you don't put the flop card into the flop
  tripsHole1Suits.splice(
    tripsHole1Suits.indexOf(hole1.charAt(hole1.length - 1)),
    1
  );
  tripsHole2Suits.splice(
    tripsHole2Suits.indexOf(hole2.charAt(hole2.length - 1)),
    1
  );

  //console.log("tripsHole1Suits: " + tripsHole1Suits);
  //console.log("tripsHole2Suits: " + tripsHole2Suits);

  //If pocket pair, generate an array that has all suits not represented in the hole cards
  if (isPocketPair) {
    tripsHole1Hole2Suits = tripsHole1Suits.filter((el) =>
      tripsHole2Suits.includes(el)
    );
  }

  if (isPocketPair) {
    flopArr.push(hole1Converted);
    flopArr[0] = backConvertor[flopArr[0]];
    //console.log("tripsHole1Hole2Suits: " + tripsHole1Hole2Suits);
    flopArr[0] = flopArr[0].concat(
      tripsHole1Hole2Suits[
        Math.floor(Math.random() * tripsHole1Hole2Suits.length)
      ]
    );
  } else {
    if (Math.random() < 0.5) {
      //use first hole card to make trips
      flopArr.push(hole1Converted);
      flopArr.push(hole1Converted);

      //Convert back into card value
      flopArr[0] = backConvertor[flopArr[0]];
      flopArr[1] = backConvertor[flopArr[1]];

      //Select a suit from tripsHole1Suits
      let flopSuit1 =
        tripsHole1Suits[Math.floor(Math.random() * tripsHole1Suits.length)];

      //Remove selected suit from tripsHole1Suits
      tripsHole1Suits.splice(tripsHole1Suits.indexOf(flopSuit1), 1);

      //Attach selected suit to card value
      flopArr[0] = flopArr[0].concat(flopSuit1);

      //Select a suit from tripsHole1Suits
      let flopSuit2 =
        tripsHole1Suits[Math.floor(Math.random() * tripsHole1Suits.length)];

      //Remove selected suit from tripsHole1Suits
      tripsHole1Suits.splice(tripsHole1Suits.indexOf(flopSuit2), 1);

      //Attach selected suit to card value
      flopArr[1] = flopArr[1].concat(flopSuit2);

      //console.log("tripsHole1Suit: " + tripsHole1Suits);
      //console.log("flopSuit1: " + flopSuit1);
      //console.log("flopSuit2: " + flopSuit2);
    } else {
      //use second hole card to make trips
      flopArr.push(hole2Converted);
      flopArr.push(hole2Converted);

      //Convert back into card value
      flopArr[0] = backConvertor[flopArr[0]];
      flopArr[1] = backConvertor[flopArr[1]];

      //Select a suit from tripsHole1Suits
      let flopSuit1 =
        tripsHole2Suits[Math.floor(Math.random() * tripsHole2Suits.length)];

      //Remove selected suit from tripsHole1Suits
      tripsHole2Suits.splice(tripsHole2Suits.indexOf(flopSuit1), 1);

      //Attach selected suit to card value
      flopArr[0] = flopArr[0].concat(flopSuit1);

      //Select a suit from tripsHole1Suits
      let flopSuit2 =
        tripsHole2Suits[Math.floor(Math.random() * tripsHole2Suits.length)];

      //Remove selected suit from tripsHole1Suits
      tripsHole2Suits.splice(tripsHole2Suits.indexOf(flopSuit2), 1);

      //Attach selected suit to card value
      flopArr[1] = flopArr[1].concat(flopSuit2);

      //console.log("tripsHole2Suit:" + tripsHole2Suits);
      //console.log("flopSuit1:" + flopSuit1);
      //console.log("flopSuit2: " + flopSuit2);
    }
  }

  //Insert number from availableNumberArr into flopArr
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );

  //If pocket pair, only 1 number has been inserted so far, thus insert another number from availableNumberArr into flopArr
  if (isPocketPair) {
    flopArr.push(
      availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
    );
  }

  //Preserve flopArrNums incase a second attempt is needed when assigning flop suits
  flopArrNums = flopArr;

  //Converting card numbers into values
  flopArr[2] = backConvertor[flopArrNums[2]];

  //If pocket pair, the number at index 1 has not yet been converted into card value
  if (isPocketPair) {
    flopArr[1] = backConvertor[flopArrNums[1]];
  }

  //Partially populates flopAndHoleCardArr
  flopAndHoleCardArr = [hole1, hole2];
  flopArrNums = flopArr;

  do {
    if (isPocketPair) {
      flopArr[1] = flopArr[1].concat(
        suits[Math.floor(Math.random() * suits.length)]
      );
    }

    flopArr[2] = flopArr[2].concat(
      suits[Math.floor(Math.random() * suits.length)]
    );

    flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

    if (isFlushDraw(flopAndHoleCardArr) || hasDuplicates(flopAndHoleCardArr)) {
      flopArr[2] = backConvertor[flopArrNums[2]];
      if (isPocketPair) {
        flopArr[1] = backConvertor[flopArrNums[1]];
      }

      flopAndHoleCardArr = [hole1, hole2];
    }
  } while (
    isFlushDraw(flopAndHoleCardArr) ||
    hasDuplicates(flopAndHoleCardArr)
  );

  populateTripsToFullhouseOrPairOutsArr(
    hole1,
    hole2,
    flopArr,
    flopAndHoleCardArr,
    outsArr
  );

  outsArr = removeDuplicates(outsArr);

  completeFlopInformation["outCards"] = outsArr;
  completeFlopInformation["outs"] = 7;
  completeFlopInformation["holeCards"] = [hole1, hole2];
  completeFlopInformation["flopCards"] = flopArr;
  completeFlopInformation["name"] = "Trips to Fullhouse/Quads";

  //console.log(completeFlopInformation);
  return completeFlopInformation;
}

/**
 * Summary.
 * Populates the outsArr of the
 * TripsToFullhouseOrPair Scenario
 * @param {*} hole1
 * @param {*} hole2
 * @param {*} flopArr
 * @param {*} flopAndHoleCardArr
 * @param {*} outsArr
 */

function populateTripsToFullhouseOrPairOutsArr(
  hole1,
  hole2,
  flopArr,
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

  outsArr.push.apply(
    outsArr,
    getRemainingCardsOfSameValue(flopArr[2], flopAndHoleCardArr)
  );
}

module.exports = {
  generateTripsToFullhouseOrQuads: generateTripsToFullhouseOrQuads,
};

