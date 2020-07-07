const {
  putCardGetNumAceHigh,
  putCardGetNumAceLow,
  putNumGetCardValueAceHigh,
} = require("./convertor.js");

const {
  populateZoneArr,
  depopulateAvailableNumArrUsingZoneArr,
} = require("./straightPrevention");

const { populateInternalArr } = require("./straightDrawUtils");

const {
  getFlushDrawSuit,
  isFlush,
  isFlushDraw,
  hasDuplicates,
  getRemainingCardsOfSameValue,
  getRemainingCardsOfSameSuit,
  removeDuplicates,
  moveElement,
  decideConversionScheme,
} = require("./utilities");

/**
 * Summary.
 * Randomly picks the first 2 cards to insert into the flop array
 * based on seperation between hole cards. At the end of this method,
 * the flopArr will have 2 cards that are going to combine with the
 * hole cards to make a open straight draw, or variations of it
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} flopArr
 * @param {Number[]} leftBranchArr
 * @param {Number[]} internalArr
 * @param {Number[]} rightBranchArr
 */
function buildOpenFlopArr(
  hole1Converted,
  hole2Converted,
  flopArr,
  leftBranchArr,
  internalArr,
  rightBranchArr
) {
  if (hole2Converted - hole1Converted === 3) {
    //console.log("Cards seperation: 2");
    //Inserts element from internalArr into flopArr
    moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );

    //Inserts element from internalArr into flopArr
    moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );
  } else if (hole2Converted - hole1Converted === 2) {
    //Inserts element from internalArr into flopArr
    moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );

    //Randomly insert an element adjacent to hole card from either leftBranch or rightBranch
    if (Math.random() < 0.5 && leftBranchArr.length != 0) {
      flopArr.push(leftBranchArr[0]);
    } else if (rightBranchArr != 0) {
      flopArr.push(rightBranchArr[0]);
    } else {
      //Ensures something gets added if rightBranch is empty
      flopArr.push(leftBranchArr[0]);
    }
  } else if (hole2Converted - hole1Converted === 1) {
    if (Math.random() < 0.5 && leftBranchArr.length != 0) {
      flopArr.push(leftBranchArr[0]);
      if (Math.random() < 0.5 && leftBranchArr.length > 1) {
        flopArr.push(leftBranchArr[1]);
      } else if (rightBranchArr.length != 0) {
        flopArr.push(rightBranchArr[0]);
      } else {
        flopArr.push(leftBranchArr[1]);
      }
    } else if (rightBranchArr.length != 0) {
      flopArr.push(rightBranchArr[0]);
      if (Math.random() < 0.5 && rightBranchArr.length > 1) {
        flopArr.push(rightBranchArr[1]);
      } else if (leftBranchArr.length != 0) {
        flopArr.push(leftBranchArr[0]);
      } else {
        flopArr.push(rightBranchArr[1]);
      }
    } else {
      flopArr.push(leftBranchArr[0]);
      if (Math.random() < 0.5 && leftBranchArr.length > 1) {
        flopArr.push(leftBranchArr[1]);
      } else if (rightBranchArr.length != 0) {
        flopArr.push(rightBranchArr[0]);
      } else {
        flopArr.push(leftBranchArr[1]);
      }
    }
  }
}

/**
 * Summary.
 * Populates the 'left branch' of the 2 hole card set up,
 * in descending order (highest first)
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} leftBranchArr
 */

function populateLeftBranchArr(hole1Converted, hole2Converted, leftBranchArr) {
  for (
    let i = hole1Converted - 1, j = 0;
    j < 4 - (hole2Converted - hole1Converted);
    j++, i--
  ) {
    if (i > 0) {
      leftBranchArr.push(i);
    }
  }
}

/**
 * Solution
 * Populates the 'right branch' of the 2 hole card set up,
 * in ascending order (lowest first)
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} rightBranchArr
 */

function populateRightBranchArr(
  hole1Converted,
  hole2Converted,
  rightBranchArr
) {
  for (
    let i = hole2Converted + 1, j = 0;
    j < 4 - (hole2Converted - hole1Converted);
    j++, i++
  ) {
    if (i < 14) {
      rightBranchArr.push(i);
    }
  }
}

function populateOpenStraightOurArr(
  hole1,
  hole2,
  convertor,
  backConvertor,
  flopAndHoleArr,
  flopAndHoleCardArr,
  isCutIntoInsideStraight,
  hasOneOvercard,
  hasTwoOvercards,
  outsArr
) {
  //Lower open straight outs
  if (flopAndHoleArr[0] - 1 >= 1) {
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameValue(
        backConvertor[flopAndHoleArr[0] - 1],
        flopAndHoleCardArr
      )
    );
  }

  //Higher open straight outs
  if (flopAndHoleArr[3] + 1 <= 13) {
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameValue(
        backConvertor[flopAndHoleArr[3] + 1],
        flopAndHoleCardArr
      )
    );
  }

  if (isFlushDraw(flopAndHoleCardArr)) {
    //Get the flush causing outs
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameSuit(
        getFlushDrawSuit(flopAndHoleCardArr),
        flopAndHoleCardArr
      )
    );
    if (isCutIntoInsideStraight) {
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    } else {
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    }
  } else {
    if (isCutIntoInsideStraight) {
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    } else {
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    }
  }
}

function generateOpenStraight(hole1, hole2) {
  let completeFlopInformation = {};
  let suits = ["h", "d", "s", "c"];
  let remainingNumberSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let hole1Converted;
  let hole2Converted;
  let convertor;
  let backConvertor;
  let leftBranchArr = [];
  let internalArr = [];
  let rightBranchArr = [];
  let flopArr = [];
  let isCutIntoInsideStraight = false;
  let outArr = [];

  //Decides conversion scheme
  let conversionArray = decideConversionScheme(hole1, hole2);
  convertor = conversionArray[0];
  backConvertor = conversionArray[1];

  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Ensures hole1Converted < hole2Converted
  if (hole1Converted > hole2Converted) {
    let temp = hole1Converted;
    hole1Converted = hole2Converted;
    hole2Converted = temp;
  }

  //Error messages
  if (hole1Converted === hole2Converted) {
    console.log("Error: This function is not designed for pocket pairs");
    return;
  }

  if (hole2Converted - hole1Converted > 3) {
    console.log(
      "Error: This function is not designed for hole cards seperated by more than 2 cards"
    );
    return;
  }

  populateInternalArr(hole1Converted, hole2Converted, internalArr);
  populateLeftBranchArr(hole1Converted, hole2Converted, leftBranchArr);
  populateRightBranchArr(hole1Converted, hole2Converted, rightBranchArr);

  buildOpenFlopArr(
    hole1Converted,
    hole2Converted,
    flopArr,
    leftBranchArr,
    internalArr,
    rightBranchArr
  );

  //Makes an array out of hole and flop cards
  let flopAndHoleArr = [hole1Converted, hole2Converted];
  flopAndHoleArr = flopAndHoleArr.concat(flopArr);

  //Necessary to make straight prevention logic
  flopAndHoleArr.sort((a, b) => a - b);

  //Checks to see if generated open straight it at the edge of numberline in which case it is actually an inside straight
  if (flopAndHoleArr.includes(1) || flopAndHoleArr.includes(13)) {
    isCutIntoInsideStraight = true;
  }

  //Ensures no overlap
  remainingNumberSet = remainingNumberSet.filter(function (val) {
    return flopAndHoleArr.indexOf(val) == -1;
  });

  //Removes numbers that might cause outright straight upon flop
  remainingNumberSet.splice(
    remainingNumberSet.indexOf(flopAndHoleArr[0] - 1),
    1
  );

  remainingNumberSet.splice(
    remainingNumberSet.indexOf(flopAndHoleArr[3] + 1),
    1
  );

  //Inserts random value from remainingNumberSet into flopArr
  flopArr.push(
    remainingNumberSet[Math.floor(Math.random() * remainingNumberSet.length)]
  );

  /* Start of new suit assigner */

  //Preserve information in flopArr for completeFlopInformation methods
  let flopArrNums = flopArr;

  //Converts the numbers back into the card values they represent
  let flopArrCards = flopArr.map((flopNum) => backConvertor[flopNum]);

  //Creates and partially populates flopAndHoleCardArr
  let flopAndHoleCardArr = [hole1, hole2];
  let resetVariables = false;

  //Preserves information in case a reset is needed below due to flushDraw or duplicates
  flopArr = flopArrCards;

  //Assigns suits to flopCards, and redoes it if a flush is generated or there are duplicate cards
  do {
    if (resetVariables) {
      flopArr = flopArrCards;
      flopAndHoleCardArr = [hole1, hole2];
    }

    flopArr = flopArr.map((flopCard) =>
      flopCard.concat(suits[Math.floor(Math.random() * suits.length)])
    );

    flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

    if (isFlush(flopAndHoleCardArr) || hasDuplicates(flopAndHoleCardArr)) {
      console.log("reattemping suit");
      resetVariables = true;
    }
  } while (isFlush(flopAndHoleCardArr) || hasDuplicates(flopAndHoleCardArr));

  //Prepwork to populate completeFlopInformation
  // let isFlushDraw = isFlushDraw(flopAndHoleCardArr);

  let hasTwoOvercards =
    flopArrNums.every((el) => el < hole1Converted) &&
    flopArrNums.every((el) => el < hole2Converted);

  let hasOneOvercard =
    flopArrNums.every((el) => el < hole1Converted) ||
    flopArrNums.every((el) => el < hole2Converted);

  //Handles special case of a single Ace in the hole1, hole2
  if (JSON.stringify(convertor) === JSON.stringify(putCardGetNumAceLow)) {
    if (hole1.startsWith("A") || hole2.startsWith("A")) {
      hasOneOvercard = true;
    }
  }

  //console.log("flopAndHoleArr: " + flopAndHoleArr);
  //console.log("flopAndHoleCardArr: " + flopAndHoleCardArr);
  //console.log('flopAndHoleArrNums: ' + flopAndHoleArrNums)
  // populateOpenStraightOutArr

  populateOpenStraightOurArr(
    hole1,
    hole2,
    convertor,
    backConvertor,
    flopAndHoleArr,
    flopAndHoleCardArr,
    isCutIntoInsideStraight,
    hasOneOvercard,
    hasTwoOvercards,
    outArr
  );

  outArr = removeDuplicates(outArr);

  //console.log(outArr + " :OUTSARR");

  //Populating completeFlopInformation

  completeFlopInformation["outCards"] = outArr;

  if (isFlushDraw(flopAndHoleCardArr)) {
    if (isCutIntoInsideStraight) {
      if (hasTwoOvercards) {
        completeFlopInformation["outs"] = 18;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Inside Straight Flush Draw With 2 Overcards";
      } else if (hasOneOvercard) {
        completeFlopInformation["outs"] = 15; //Iffy, please check
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Inside Straight Flush Draw With 1 Overcard";
      } else {
        completeFlopInformation["outs"] = 13;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Inside Straight Flush Draw";
      }
    } else {
      if (hasTwoOvercards) {
        completeFlopInformation["outs"] = 21;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Open Straight Flush Draw With 2 Overcards";
      } else if (hasOneOvercard) {
        completeFlopInformation["outs"] = 18;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Open Straight Flush Draw With 1 Overcard";
      } else {
        completeFlopInformation["outs"] = 15;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Flush Draw";
      }
    }
  } else {
    if (isCutIntoInsideStraight) {
      if (hasTwoOvercards) {
        completeFlopInformation["outs"] = 10;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Inside Straight Draw With 2 Overcards";
      } else if (hasOneOvercard) {
        completeFlopInformation["outs"] = 7;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Inside Straight Draw With 1 Overcards";
      } else {
        completeFlopInformation["outs"] = 4;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Inside Straight Draw";
      }
    } else {
      if (hasTwoOvercards) {
        completeFlopInformation["outs"] = 14;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw 2 Overcards";
      } else if (hasOneOvercard) {
        completeFlopInformation["outs"] = 11;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw 1 Overcard";
      } else {
        completeFlopInformation["outs"] = 8;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw";
      }
    }
  }

  //console.log(completeFlopInformation);
  return completeFlopInformation;
}

module.exports = {
  generateOpenStraight: generateOpenStraight,
};

console.log(generateOpenStraight("4c", "6c"));
console.log(generateOpenStraight("Ac", "Kc"));
console.log(generateOpenStraight("Ac", "2c"));
console.log(generateOpenStraight("Qc", "Kc"));
console.log(generateOpenStraight("4c", "6c"));
