const {
    putCardGetNumAceHigh,
    putCardGetNumAceLow,
    putNumGetCardValueAceHigh,
  } = require("./convertor.js");
  
  const {
    populateZoneArr,
    depopulateAvailableNumArrUsingZoneArr,
  } = require("./straightPrevention");

  const {
      populateInternalArr
  } = require("./straightDrawUtils")
  
  const {
    getFlushDrawSuit,
    isFlush,
    isFlushDraw,
    hasDuplicates,
    getRemainingCardsOfSameValue,
    getRemainingCardsOfSameSuit,
    removeDuplicates,
    moveElement,
    decideConversionScheme
  } = require("./utilities");
  
/**
 * @typedef {Object} completeFlopInformation
 * @param {Number} outs The number of outs associated with the draw
 * @param {Array} holeCards The original hole cards
 * @param {Array} flopArr The cards in the flop
 * @param {String} name The specific name of the draw
 */

/**
 * Summary.
 * Takes in two hole cards and generates
 * an inside straight draw most of the time
 * but it's something else, it is detected and
 * accounts for in by changing information in
 * completeFlopInformation
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

function generateInsideStraight(hole1, hole2) {
  let completeFlopInformation = {};
  let suits = ["h", "d", "s", "c"];
  let remainingNumberSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let hole1Converted;
  let hole2Converted;
  let convertor;
  let backConvertor;
  let externalArr = [];
  let internalArr = [];
  let outermostArr = [];
  let flopArr = [];
  let outArr = [];
  let doubleGutshotNum;
  let openStraightNum;
  let thirdFlopNumber;
  let straightCausingNum;

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

  if (hole2Converted - hole1Converted > 4) {
    console.log(
      "Error: This function is not designed for pocket cards seperated by more than 3 cards"
    );
    return;
  }

  populateOutermostArr(hole1Converted, hole2Converted, outermostArr);
  populateInternalArr(
    hole1Converted,
    hole2Converted,
    internalArr
  );
  populateExternalArr(hole1Converted, hole2Converted, externalArr);

  externalArr = removeOverlappingElementsFromExternalArr(
    hole1Converted,
    hole2Converted,
    outermostArr,
    internalArr,
    externalArr
  );

  buildInsideFlopArr(
    hole1Converted,
    hole2Converted,
    outermostArr,
    internalArr,
    externalArr,
    flopArr
  );

  //Makes an array out of hole and flop cards, sort in ascending order
  let flopAndHoleArr = [hole1Converted, hole2Converted];
  flopAndHoleArr = flopAndHoleArr.concat(flopArr);

  //Important to sort in ascending fasion for logic in detectNotInsideStraightAndPreventStraight
  flopAndHoleArr.sort((a, b) => a - b);

  //Detects numbers that make the flop something other than an inside straight, and prevents flop straights
  let notInsideStraightCausers = detectNotInsideStraightAndPreventStraight(
    flopAndHoleArr,
    remainingNumberSet
  );

  openStraightNum = notInsideStraightCausers[0];
  doubleGutshotNum = notInsideStraightCausers[1];
  remainingNumberSet = notInsideStraightCausers[2];
  straightCausingNum = notInsideStraightCausers[3][0];

  //console.log(remainingNumberSet);
  //console.log(openStraightNum);
  //console.log(doubleGutshotNum);
  //console.log(straightCausingNum);

  //Inserts random value from remainingNumberSet into flopArr
  thirdFlopNumber =
    remainingNumberSet[Math.floor(Math.random() * remainingNumberSet.length)];
  flopArr.push(thirdFlopNumber);

  flopAndHoleArr.push(thirdFlopNumber);

  flopAndHoleArr.sort((a, b) => a - b);
  let flopAndHoleArrNums = flopAndHoleArr;
  //console.log(flopAndHoleArr + "flopAndHole2");

  /*Start of new suit assigner */

  //Preserve information in flopArr for completeFlopInformation methods
  let flopArrNums = flopArr;

  //Converts the numbers back into the card values they represent
  let flopArrCards = flopArr.map((flopNum) => backConvertor[flopNum]);

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

    if (
      isFlush(flopAndHoleCardArr) ||
      hasDuplicates(flopAndHoleCardArr)
    ) {
      console.log(
        "reattemping suit!"
      );

      resetVariables = true;
    }
  } while (
    isFlush(flopAndHoleCardArr) ||
    hasDuplicates(flopAndHoleCardArr)
  );

//   let isFlushDraw = isFlushDraw(flopAndHoleCardArr);

  let hasTwoOvercards =
    flopArrNums.every((el) => el < hole1Converted) &&
    flopArrNums.every((el) => el < hole2Converted);

  let hasOneOvercard =
    flopArrNums.every((el) => el < hole1Converted) ||
    flopArrNums.every((el) => el < hole2Converted);

  //Handles special case of a single Ace in the hole1, hole2
  if (
    JSON.stringify(convertor) === JSON.stringify(putCardGetNumAceLow)
  ) {
    if (hole1.startsWith("A") || hole2.startsWith("A")) {
      hasOneOvercard = true;
    }
  }

  //Need to have info about which suit is causing the flush draw
  //Need to have flop and hole arr reliably sorted
  //So for open straight, add the middle card to outs and check which side of the open straight num card is free, and add that side card to outsArr

  //console.log(flopAndHoleCardArr);

  populateInsideStraightOutArr(
    hole1,
    hole2,
    convertor,
    backConvertor,
    flopAndHoleArrNums,
    flopAndHoleCardArr,
    isFlushDraw,
    thirdFlopNumber,
    doubleGutshotNum,
    openStraightNum,
    straightCausingNum,
    hasOneOvercard,
    hasTwoOvercards,
    outArr
  );

  outArr = removeDuplicates(outArr);

  // console.log('openStraightNum: ' +backConvertor[openStraightNum])
  // console.log('straightCausingNum: ' +backConvertor[straightCausingNum])
  // console.log('doubleGutshotNum: ' +backConvertor[doubleGutshotNum])

  // console.log(outArr + 'OUT ARR')

  //populateInsideStraightOutArr(flopAndHoleCardArr, isFlushDraw, thirdFlopNumber, doubleGutshotNum, openStraightNum, straightCausingNum, hasOneOvercard, hasTwoOvercards, outArr);

  //Populates completeFlopInformation with information to be displayed

  completeFlopInformation["outCards"] = outArr;

  if (isFlushDraw(flopAndHoleCardArr)) {
    if (thirdFlopNumber === doubleGutshotNum) {
      if (hasTwoOvercards) {
        completeFlopInformation["outs"] = 21;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Double Gutshot Flush Draw With 2 Overcards";
      } else if (hasOneOvercard) {
        completeFlopInformation["outs"] = 18;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Double Gutshot Flush Draw With 1 Overcard";
      } else {
        completeFlopInformation["outs"] = 15;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Double Gutshot Flush Draw";
      }
    } else if (thirdFlopNumber === openStraightNum) {
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
    } else {
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
    }
  } else {
    if (thirdFlopNumber === doubleGutshotNum) {
      if (hasTwoOvercards) {
        completeFlopInformation["outs"] = 14;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] =
          "Double Gutshot Draw With 2 Overcards";
      } else if (hasOneOvercard) {
        completeFlopInformation["outs"] = 11;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Double Gutshot Draw With 1 Overcard";
      } else {
        completeFlopInformation["outs"] = 8;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Double Gutshot Draw";
      }
    } else if (thirdFlopNumber === openStraightNum) {
      if (hasTwoOvercards) {
        completeFlopInformation["outs"] = 14;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw With 2 Overcards";
      } else if (hasOneOvercard) {
        completeFlopInformation["outs"] = 11;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw With 1 Overcard";
      } else {
        completeFlopInformation["outs"] = 8;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw";
      }
    } else {
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
    }
  }

  //console.log(completeFlopInformation);
  return completeFlopInformation;
}

/**
 * Summary.
 * Goes through the deck and populates the outermostArr
 * This is the set of numbers which are exactly 3 cards below
 * the highest card, or exactly 3 cards above the lowest card
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} outermostArr
 */

function populateOutermostArr(hole1Converted, hole2Converted, outermostArr) {
  if (hole2Converted >= 5) {
    //Prevents numbers outside conversion range
    outermostArr.push(hole2Converted - 4);
  }

  if (hole1Converted <= 9) {
    //Prevents numbers outside conversion range
    outermostArr.push(hole1Converted + 4);
  }

  //console.log("Outermost Card Array: " + outermostArr)
}

/**
 * Summary.
 * Go through deck and populate the externalArr
 * This is set of cards that is less than 3 cards from
 * below the highest card, or less than 3 cards above
 * the lowest card
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} externalArr
 */

function populateExternalArr(hole1Converted, hole2Converted, externalArr) {
  for (let i = hole1Converted + 1; i < hole1Converted + 4; i++) {
    if (i <= 13) {
      externalArr.unshift(i);
    }
  }

  for (let i = hole2Converted - 1; i > hole2Converted - 4; i--) {
    if (i >= 0) {
      externalArr.unshift(i);
    }
  }

  //console.log("External Card Array: " + externalArr);
}

/**
 * Summary.
 * Ensures that all elements in outermostArr, internalArr
 * and externalArr are mutually exclusive and also removes hole
 * cards from external array
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} outermostArr
 * @param {Number[]} internalArr
 * @param {Number[]} externalArr
 */

function removeOverlappingElementsFromExternalArr(
  hole1Converted,
  hole2Converted,
  outermostArr,
  internalArr,
  externalArr
) {
  //Eliminate overlap with internalArr
  externalArr = externalArr.filter(function (val) {
    return internalArr.indexOf(val) == -1;
  });

  //Eliminate overlap with outermostArr
  externalArr = externalArr.filter(function (val) {
    return outermostArr.indexOf(val) == -1;
  });

  //Remove hole cards
  externalArr.splice(externalArr.indexOf(hole1Converted), 1);
  externalArr.splice(externalArr.indexOf(hole2Converted), 1);

  return externalArr;
}

/**
 * Solution.
 * Detects and deals with particular numbers that, if
 * selected, will cause the flop to not be an inside straight.
 * Modifies remainingNumberSet
 *
 * @param {Number[]} flopAndHoleArr
 * @param {Number[]} remainingNumberSet
 */

function detectNotInsideStraightAndPreventStraight(
  flopAndHoleArr,
  remainingNumberSet
) {
  let doubleGutshotNum;
  let openStraightNum;
  let straightCausingNum;

  //Ensures no overlap
  remainingNumberSet = remainingNumberSet.filter(function (val) {
    return flopAndHoleArr.indexOf(val) == -1;
  });

  //console.log('inside function remNumset' + remainingNumberSet);

  // Check the relationship between flopAndHoleArr[1] and flopAndHoleArr[2], adjacent means 3 numbers in flopAndHoleArr are adjacent
  // This makes it possible to end up with a Double Gutshot Draw or a Open Straight Draw that uses only 1 hole car
  if (flopAndHoleArr[1] + 1 === flopAndHoleArr[2]) {
    //Indicates 3 adjacent numbers are lower than the isolated number, so we look below them to detect open straight draws and double gutshots
    if (flopAndHoleArr[0] + 1 == flopAndHoleArr[1]) {
      //Removes middle card, eliminates possibility of straight directly on the flop
      straightCausingNum = remainingNumberSet.splice(
        remainingNumberSet.indexOf(flopAndHoleArr[3] - 1),
        1
      );

      //Checks to ensure we don't go below 1
      if (flopAndHoleArr[0] - 1 > 0) {
        //Remembers number that leads to open straight draw
        openStraightNum = flopAndHoleArr[0] - 1;
      }

      //Checks to ensure we don't go below 0
      if (flopAndHoleArr[0] - 2 > 0) {
        //Remembers number that leads to double gutshot draw
        doubleGutshotNum = flopAndHoleArr[0] - 2;
      }
      //Indicates 3 adjacent numbers are higher than the isolated number, so we look above them to detect open straight draws and double gutshots
    } else if (flopAndHoleArr[2] + 1 === flopAndHoleArr[3]) {
      //Removes middle card, eliminates possibility of straight directly on the flop
      straightCausingNum = remainingNumberSet.splice(
        remainingNumberSet.indexOf(flopAndHoleArr[0] + 1),
        1
      );

      //Checks to ensure we don't go below 1
      if (flopAndHoleArr[3] + 1 < 13) {
        //Remembers number that leads to open straight draw
        openStraightNum = flopAndHoleArr[3] + 1;
      }
      if (flopAndHoleArr[3] + 2 < 13) {
        //Remembers number that leads to double gutshot draw
        doubleGutshotNum = flopAndHoleArr[3] + 2;
      }
    }
    //flopAndHoleArr numbers follow the pattern = 2 adjacent numbers, space, 2 adjacent numbers
  } else {
    //Removes middle card, eliminates possibility of straight directly on the flop
    straightCausingNum = remainingNumberSet.splice(
      remainingNumberSet.indexOf(flopAndHoleArr[1] + 1),
      1
    );
  }

  return [
    openStraightNum,
    doubleGutshotNum,
    remainingNumberSet,
    straightCausingNum,
  ];
}

/**
 * Summary.
 * Randomly picks the first 2 cards to insert into the flop array
 * based on seperation between hole cards. At the end of this method,
 * the flopArr will have 2 cards that are going to combine with the
 * hole cards to make a inside straight draw, or variations of it
 *
 * @param {Number} hole1Converted
 * @param {Number} hole2Converted
 * @param {Number[]} outermostArr
 * @param {Number[]} internalArr
 * @param {Number[]} externalArr
 * @param {Number[]} flopArr
 */

function buildInsideFlopArr(
  hole1Converted,
  hole2Converted,
  outermostArr,
  internalArr,
  externalArr,
  flopArr
) {
  //Start building flop array
  //Enter this if hole cards seperated by 3 cards
  if (hole2Converted - hole1Converted == 4) {
    //Insert element from internalArr into flopArr
    moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );

    //Insert element from internalArr into flopArr
    moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );

    //Enter this if hole cards seperated by 2 cards
  } else if (hole2Converted - hole1Converted == 3) {
    //Insert element from internalArr into flopArr
    moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );

    //Insert element from outermostArr into flopArr
    moveElement(
      Math.floor(Math.random() * outermostArr.length),
      outermostArr,
      flopArr
    );

    //Enter this if hole cards seperated by 1 card
  } else if (hole2Converted - hole1Converted == 2) {
    //Insert element from outermostArr into flopArr
    //And remember the selected element
    let selectedOutermostCard =
      outermostArr[Math.floor(Math.random() * outermostArr.length)]; //Insert element from outermostArr into flopArr
    flopArr.push(selectedOutermostCard);

    //Randomise selection of second element to be inserted into flopArr
    //Based on probability function that depends on internalArr and externalArr
    if (
      Math.random() <
      internalArr.length / (internalArr.length + externalArr.length)
    ) {
      //Insert element from outermost into flopArr
      flopArr.push(internalArr[Math.floor(Math.random() * internalArr.length)]);
    } else {
      if (selectedOutermostCard < hole1Converted) {
        //Insert element that is one above the selectedOutermostCard
        flopArr.push(selectedOutermostCard + 1);
      } else if (selectedOutermostCard > hole2Converted) {
        //Insert element that is one below the selectedOutermostCard
        flopArr.push(selectedOutermostCard - 1);
      }
    }
    //Enter this if hole cards seperated by 0 cards
  } else if (hole2Converted - hole1Converted == 1) {
    //Insert element from outermostArr into flopArr
    //And remember the selected element
    let selectedOutermostCard =
      outermostArr[Math.floor(Math.random() * outermostArr.length)];
    flopArr.push(selectedOutermostCard);
    if (selectedOutermostCard < hole1Converted) {
      //Randomly decide between selecting one above or two above the selectedOutermostCard
      if (Math.random() < 0.5) {
        flopArr.push(selectedOutermostCard + 1);
      } else {
        flopArr.push(selectedOutermostCard + 2);
      }
    } else if (selectedOutermostCard > hole2Converted) {
      //Randomly decide between selecting one below or two below the selectedOutermostCard
      if (Math.random() < 0.5) {
        flopArr.push(selectedOutermostCard - 1);
      } else {
        flopArr.push(selectedOutermostCard - 2);
      }
    }
  }
}

/**
 * This function populates the outsArr with
 * all the outs contained with this particular
 * inside straight draw
 *
 * @param {*} hole1
 * @param {*} hole2
 * @param {*} convertor
 * @param {*} backConvertor
 * @param {*} flopAndHoleArrNums
 * @param {*} flopAndHoleCardArr
 * @param {*} isFlushDraw
 * @param {*} thirdFlopNumber
 * @param {*} doubleGutshotNum
 * @param {*} openStraightNum
 * @param {*} straightCausingNum
 * @param {*} hasOneOvercard
 * @param {*} hasTwoOvercards
 * @param {*} outsArr
 */

function populateInsideStraightOutArr(
  hole1,
  hole2,
  convertor,
  backConvertor,
  flopAndHoleArrNums,
  flopAndHoleCardArr,
  isFlushDraw,
  thirdFlopNumber,
  doubleGutshotNum,
  openStraightNum,
  straightCausingNum,
  hasOneOvercard,
  hasTwoOvercards,
  outsArr
) {
  if (isFlushDraw(flopAndHoleCardArr)) {
    //Get the flush causing outs
    outsArr.push.apply(
      outsArr,
      getRemainingCardsOfSameSuit(
        getFlushDrawSuit(flopAndHoleCardArr),
        flopAndHoleCardArr
      )
    );

    if (thirdFlopNumber === doubleGutshotNum) {
      //Get lower gutshot filling outs
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[1] - 1],
          flopAndHoleCardArr
        )
      );

      //Get upper gutshot filling outs
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[3] + 1],
          flopAndHoleCardArr
        )
      );

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
        //todo: remove inevitable duplicates
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
    } else if (thirdFlopNumber === openStraightNum) {
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

      //Outs from openStraight
      //Probably faulty, untested mathematics, praying this works
      if (straightCausingNum < openStraightNum && openStraightNum + 1 <= 13) {
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(
            backConvertor[openStraightNum + 1],
            flopAndHoleCardArr
          )
        );
      } else if (
        straightCausingNum > openStraightNum &&
        openStraightNum - 1 >= 1
      ) {
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(
            backConvertor[openStraightNum - 1],
            flopAndHoleCardArr
          )
        );
      }

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
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

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
    if (thirdFlopNumber === doubleGutshotNum) {
      //Get lower gutshot filling outs
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[1] - 1],
          flopAndHoleCardArr
        )
      );

      //Get upper gutshot filling outs
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[3] + 1],
          flopAndHoleCardArr
        )
      );

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
    } else if (thirdFlopNumber === openStraightNum) {
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

      //Outs from openStraight
      //Probably faulty, untested mathematics, praying this works
      if (straightCausingNum < openStraightNum && openStraightNum + 1 <= 13) {
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(
            backConvertor[openStraightNum + 1],
            flopAndHoleCardArr
          )
        );
      } else if (
        straightCausingNum > openStraightNum &&
        openStraightNum - 1 >= 1
      ) {
        outsArr.push.apply(
          outsArr,
          getRemainingCardsOfSameValue(
            backConvertor[openStraightNum - 1],
            flopAndHoleCardArr
          )
        );
      }
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
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

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

module.exports = {
  generateInsideStraight: generateInsideStraight,
};

console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
console.log(generateInsideStraight("4c", "6c"));
