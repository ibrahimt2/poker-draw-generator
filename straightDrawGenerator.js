const Convertor = require("./convertor.js");
const Utilities = require("./utilities.js");


//TODO: Convert methods to use the methods utilities.js to reduce
//Code repitition

//TODO: Make comments more readable, comment variables aswell

function moveElement(index, fromArray, toArray) {
  toArray.push(fromArray[index]);
  fromArray.splice(index, 1);
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
 * and externalArr are mutually exclusive
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
    console.log("Cards seperation: 2");
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

/**
 * Solution.
 * Decides whether to use a high ace conversion scheme (A = 13)
 * Or a low ace conversion scheme (A = 1)
 *
 * @param {Number} hole1
 * @param {Number} hole2
 */

function decideConversionScheme(hole1, hole2) {
  let convertor = Convertor.putCardGetNumAceLow;
  let backConvertor = Convertor.putNumGetCardValueAceLow;

  let hole1Converted = convertor[hole1];
  let hole2Converted = convertor[hole2];

  //Checks conversion scheme validity, switches to using high ace conversion scheme is necessary
  if (hole1Converted >= 10 || hole2Converted >= 10) {
    if (hole1Converted == 1 || hole2Converted == 1) {
      //console.log("A and card > 10, Using Ace High Conversion Scheme...");
      convertor = Convertor.putCardGetNumAceHigh;
      backConvertor = Convertor.putNumGetCardValueAceHigh;
    } else if (hole1Converted >= 10 && hole2Converted >= 10) {
      //console.log("2 cards > 10, Using Ace High Conversion Scheme...");
      convertor = Convertor.putCardGetNumAceHigh;
      backConvertor = Convertor.putNumGetCardValueAceHigh;
    }
  } else {
    //console.log("Using Ace Low Conversion Scheme...")
  }

  return [convertor, backConvertor];
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

function populateOpenStraightOurArr(
  hole1,
  hole2,
  convertor,
  backConvertor,
  flopAndHoleArr,
  flopAndHoleCardArr,
  isFlushDraw,
  isCutIntoInsideStraight,
  hasOneOvercard,
  hasTwoOvercards,
  outsArr
) {

    //Lower open straight outs
    if(flopAndHoleArr[0] - 1 >= 1) {
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(backConvertor[flopAndHoleArr[0] - 1], flopAndHoleCardArr)
      );
    }
  
    //Higher open straight outs
    if(flopAndHoleArr[3] + 1 <= 13) {
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(backConvertor[flopAndHoleArr[3] + 1], flopAndHoleCardArr)
      );
    }

  if (isFlushDraw) {
    //Get the flush causing outs
    outsArr.push.apply(
      outsArr,
      Utilities.getRemainingCardsOfSameSuit(
        Utilities.getFlushDrawSuit(flopAndHoleCardArr),
        flopAndHoleCardArr
      )
    );
    if (isCutIntoInsideStraight) {
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    } else {
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
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
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
        
      }
    } else {
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
        
      }
    }
  }
}



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
  if (isFlushDraw) {
    //Get the flush causing outs
    outsArr.push.apply(
      outsArr,
      Utilities.getRemainingCardsOfSameSuit(
        Utilities.getFlushDrawSuit(flopAndHoleCardArr),
        flopAndHoleCardArr
      )
    );

    if (thirdFlopNumber === doubleGutshotNum) {
      //Get lower gutshot filling outs
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[1] - 1],
          flopAndHoleCardArr
        )
      );

      //Get upper gutshot filling outs
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[3] + 1],
          flopAndHoleCardArr
        )
      );

      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
        //todo: remove inevitable duplicates
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    } else if (thirdFlopNumber === openStraightNum) {
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

      //Outs from openStraight
      //Probably faulty, untested mathematics, praying this works
      if (straightCausingNum < openStraightNum && openStraightNum + 1 <= 13) {
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(
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
          Utilities.getRemainingCardsOfSameValue(
            backConvertor[openStraightNum - 1],
            flopAndHoleCardArr
          )
        );
      }

      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    } else {
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
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
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[1] - 1],
          flopAndHoleCardArr
        )
      );

      //Get upper gutshot filling outs
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[flopAndHoleArrNums[3] + 1],
          flopAndHoleCardArr
        )
      );

      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    } else if (thirdFlopNumber === openStraightNum) {
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

      //Outs from openStraight
      //Probably faulty, untested mathematics, praying this works
      if (straightCausingNum < openStraightNum && openStraightNum + 1 <= 13) {
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(
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
          Utilities.getRemainingCardsOfSameValue(
            backConvertor[openStraightNum - 1],
            flopAndHoleCardArr
          )
        );
      }
      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    } else {
      //Outs from middleCard
      outsArr.push.apply(
        outsArr,
        Utilities.getRemainingCardsOfSameValue(
          backConvertor[straightCausingNum],
          flopAndHoleCardArr
        )
      );

      if (hasTwoOvercards) {
        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
        );

        //Outs from overcards
        outsArr.push.apply(
          outsArr,
          Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
        );
      } else if (hasOneOvercard) {
        if (convertor[hole1] > convertor[hole2]) {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole1, flopAndHoleCardArr)
          );
        } else {
          //Outs from overcards
          outsArr.push.apply(
            outsArr,
            Utilities.getRemainingCardsOfSameValue(hole2, flopAndHoleCardArr)
          );
        }
      } else {
      }
    }
  }
}

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
  populateInternalArr(hole1Converted, hole2Converted, internalArr);
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

  console.log(remainingNumberSet);
  console.log(openStraightNum);
  console.log(doubleGutshotNum);
  console.log(straightCausingNum);

  //Inserts random value from remainingNumberSet into flopArr
  thirdFlopNumber =
    remainingNumberSet[Math.floor(Math.random() * remainingNumberSet.length)];
  flopArr.push(thirdFlopNumber);

  flopAndHoleArr.push(thirdFlopNumber);

  flopAndHoleArr.sort((a, b) => a - b);
  let flopAndHoleArrNums = flopAndHoleArr;
  console.log(flopAndHoleArr + "flopAndHole2");

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
      Utilities.isFlush(flopAndHoleCardArr) ||
      Utilities.hasDuplicates(flopAndHoleCardArr)
    ) {
      console.log(
        "reattemping suit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      console.log("!!!!!!!!!!!!!!!!!!!!");
      console.log("!!!!!!!!!!!!!!!!!!!!");

      resetVariables = true;
    }
  } while (
    Utilities.isFlush(flopAndHoleCardArr) ||
    Utilities.hasDuplicates(flopAndHoleCardArr)
  );

  let isFlushDraw = Utilities.isFlushDraw(flopAndHoleCardArr);

  let hasTwoOvercards =
    flopArrNums.every((el) => el < hole1Converted) &&
    flopArrNums.every((el) => el < hole2Converted);

  let hasOneOvercard =
    flopArrNums.every((el) => el < hole1Converted) ||
    flopArrNums.every((el) => el < hole2Converted);

  //Handles special case of a single Ace in the hole1, hole2
  if (
    JSON.stringify(convertor) === JSON.stringify(Convertor.putCardGetNumAceLow)
  ) {
    if (hole1.startsWith("A") || hole2.startsWith("A")) {
      hasOneOvercard = true;
    }
  }

  //Need to have info about which suit is causing the flush draw
  //Need to have flop and hole arr reliably sorted
  //So for open straight, add the middle card to outs and check which side of the open straight num card is free, and add that side card to outsArr

  console.log(flopAndHoleCardArr);

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

  outArr = Utilities.removeDuplicates(outArr);

  // console.log('openStraightNum: ' +backConvertor[openStraightNum])
  // console.log('straightCausingNum: ' +backConvertor[straightCausingNum])
  // console.log('doubleGutshotNum: ' +backConvertor[doubleGutshotNum])

  // console.log(outArr + 'OUT ARR')

  //populateInsideStraightOutArr(flopAndHoleCardArr, isFlushDraw, thirdFlopNumber, doubleGutshotNum, openStraightNum, straightCausingNum, hasOneOvercard, hasTwoOvercards, outArr);

  //Populates completeFlopInformation with information to be displayed

  completeFlopInformation["outNumber"] = outArr;

  if (isFlushDraw) {
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
 * Takes in two hole cards and generates
 * an open straight draw variation most of the time
 * but it's something else, it is detected and
 * accounts for in by changing information in
 * completeFlopInformation
 *
 * @param {String} hole1
 * @param {String} hole2
 * @returns {completeFlopInformation}
 */

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

    if (
      Utilities.isFlush(flopAndHoleCardArr) ||
      Utilities.hasDuplicates(flopAndHoleCardArr)
    ) {
      console.log(
        "reattemping suit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      resetVariables = true;
    }
  } while (
    Utilities.isFlush(flopAndHoleCardArr) ||
    Utilities.hasDuplicates(flopAndHoleCardArr)
  );

  //Prepwork to populate completeFlopInformation
  let isFlushDraw = Utilities.isFlushDraw(flopAndHoleCardArr);

  let hasTwoOvercards =
    flopArrNums.every((el) => el < hole1Converted) &&
    flopArrNums.every((el) => el < hole2Converted);

  let hasOneOvercard =
    flopArrNums.every((el) => el < hole1Converted) ||
    flopArrNums.every((el) => el < hole2Converted);

  //Handles special case of a single Ace in the hole1, hole2
  if (
    JSON.stringify(convertor) === JSON.stringify(Convertor.putCardGetNumAceLow)
  ) {
    if (hole1.startsWith("A") || hole2.startsWith("A")) {
      hasOneOvercard = true;
    }
  }

  console.log("flopAndHoleArr: " + flopAndHoleArr);
  console.log("flopAndHoleCardArr: " + flopAndHoleCardArr);
  //console.log('flopAndHoleArrNums: ' + flopAndHoleArrNums)
  // populateOpenStraightOutArr

  populateOpenStraightOurArr(
    hole1,
    hole2,
    convertor,
    backConvertor,
    flopAndHoleArr,
    flopAndHoleCardArr,
    isFlushDraw,
    isCutIntoInsideStraight,
    hasOneOvercard,
    hasTwoOvercards,
    outArr
  );

  outArr = Utilities.removeDuplicates(outArr);

  //console.log(outArr + " :OUTSARR");

  //Populating completeFlopInformation

  completeFlopInformation["outsArr"] = outArr;

  if (isFlushDraw) {
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
  generateInsideStraight: generateInsideStraight,
  generateOpenStraight: generateOpenStraight,
};

// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("Ac", "10c"));
// console.log(generateInsideStraight("Ac", "Kc"));
// console.log(generateInsideStraight("Ac", "Qc"));
// console.log(generateInsideStraight("Ac", "10c"));
// console.log(generateInsideStraight("Ac", "Kc"));
// console.log(generateInsideStraight("Ac", "Qc"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("Ac", "10c"));
// console.log(generateInsideStraight("Ac", "Kc"));
// console.log(generateInsideStraight("Ac", "Qc"));
// console.log(generateInsideStraight("Ac", "10c"));
// console.log(generateInsideStraight("Ac", "Kc"));
// console.log(generateInsideStraight("Ac", "Qc"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("4c", "6c"));
// console.log(generateInsideStraight("Ac", "10c"));
// console.log(generateInsideStraight("Ac", "Kc"));
// console.log(generateInsideStraight("Ac", "Qc"));
// console.log(generateInsideStraight("Ac", "10c"));
// console.log(generateInsideStraight("Ac", "Kc"));
// console.log(generateInsideStraight("Ac", "Qc"));
// generateInsideStraight("4c", "6c");
// generateInsideStraight("4c", "6c");
// generateInsideStraight("4c", "6c");
// generateInsideStraight("4c", "6c");
// generateInsideStraight("4c", "6c");
// generateInsideStraight("4c", "6c");
// generateInsideStraight("Ac", "6c");

// console.log(generateOpenStraight("4c", "6c"));
// console.log(generateOpenStraight("Ac", "Kc"));
// console.log(generateOpenStraight("Ac", "2c"));
// console.log(generateOpenStraight("Qc", "Kc"));
// console.log(generateOpenStraight("4c", "6c"));

// generateOpenStraight("Ac", "Jd");
// generateOpenStraight("Ac", "Kc");
// generateOpenStraight("Qc", "Kc");
// generateOpenStraight("4c", "6c");
// generateOpenStraight("Ac", "Jd");
// generateOpenStraight("Ac", "Qc");
// generateOpenStraight("Qc", "Kc");
// generateOpenStraight("4c", "6c");
// generateOpenStraight("Ac", "Jd");
// generateOpenStraight("Ac", "Qc");
// generateOpenStraight("Qc", "Kc");

// generateOpenStraight("4c", "6c");
// generateOpenStraight("4c", "6c");
// generateOpenStraight("4c", "6c");
// generateOpenStraight("4c", "6c");
// generateOpenStraight("4c", "6c");
// generateOpenStraight("4c", "6c");

console.log("----");

//TODO write a class to generate hole cards

//TODO Convert this pseaudo-class into just a set of functions

//TODO Create a function that generates hole cards, randomly selects of one the available
//flop algorithms available to us, uses it to create a flop and then returns and object containing
//Information about the flop, the hole cards, essentially everything needed to render
//The display on the webapp

//Break up all of the function into there own classes that you can import into the object created
//above for easy maintanence

//Research best practices about architecting your application

//TODO Introduce the capability to list all the outs in a given situation remaining in the deck

//TODO replace all calls to inhouse decideConversionScheme() with the one in utilities.js
