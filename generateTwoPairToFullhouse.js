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
  removeDuplicates,
} = require("./utilities");

/**
 * Summary.
 * Takes in 2 cards and generates
 * a flop that results in 'TwoPairToFullhouse'
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

function generateTwoPairToFullhouse(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let twoPairHole1Suits = ["h", "d", "s", "c"];
  let twoPairHole2Suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = putCardGetNumAceHigh;
  let backConvertor = putNumGetCardValueAceHigh;
  let completeFlopInformation = {};
  let outsArr = [];

  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Error messages
  if (hole1Converted === hole2Converted) {
    console.log("This function is not designed for pocket pairs");
    return;
  }

  //Ensures hole1Converted < hole2Converted
  if (hole1Converted > hole2Converted) {
    let temp = hole1Converted;
    hole1Converted = hole2Converted;
    hole2Converted = temp;
  }

  //Removes numbers corresponding to hole cards from available pool
  availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

  //Ensure that when you are assigning suits to flop two
  //pair matches, you don't put the flop card into the flop
  twoPairHole1Suits.splice(
    twoPairHole1Suits.indexOf(hole1.charAt(hole1.length - 1)),
    1
  );
  twoPairHole2Suits.splice(
    twoPairHole2Suits.indexOf(hole2.charAt(hole2.length - 1)),
    1
  );

  //Push numbers identical to hole numbers into flopArr
  flopArr.push(hole1Converted);
  flopArr.push(hole2Converted);

  //Select one item from availableNumberArr, push into flopArr
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );

  let flopArrNums = flopArr;

  //Converts the numbers back into the card values they represent
  flopArr = flopArr.map((flopNum) => backConvertor[flopNum]);
  let flopAndHoleCardArr = [hole1, hole2];

  //Assigns suits to flopCards, and redoes it if a flush draw is generated
  flopArr[0] = flopArr[0].concat(
    twoPairHole1Suits[Math.floor(Math.random() * twoPairHole1Suits.length)]
  );
  flopArr[1] = flopArr[1].concat(
    twoPairHole2Suits[Math.floor(Math.random() * twoPairHole2Suits.length)]
  );
  flopArr[2] = flopArr[2].concat(
    suits[Math.floor(Math.random() * suits.length)]
  );
  flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

  populateTwoPairToFullhouseOutsArr(hole1, hole2, flopAndHoleCardArr, outsArr);

  outsArr = removeDuplicates(outsArr);

  //Populate completeFlopInformation with information about the flop
  completeFlopInformation["outCards"] = outsArr;
  completeFlopInformation["outs"] = 4;
  completeFlopInformation["holeCards"] = [hole1, hole2];
  completeFlopInformation["flopCards"] = flopArr;
  completeFlopInformation["name"] = "Two pair to Fullhouse";

  //console.log(completeFlopInformation);
  return completeFlopInformation;
}

function populateTwoPairToFullhouseOutsArr(
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
  generateTwoPairToFullhouse: generateTwoPairToFullhouse,
};


