const Convertor = require("./convertor.js");
const Utilities = require("./utilities.js");

//TODO: Convert methods to use the methods utilities.js to reduce
//Code repitition

//TODO: Make comments more readable, comment variables aswell

class flopGenerator {

  moveElement(index, fromArray, toArray) {
    toArray.push(fromArray[index]);
    fromArray.splice(index, 1);
  }

  /** Goes through the deck and populates the outermostArr
   *  This is the set of numbers which are exactly 3 cards below
   *  the highest card, or exactly 3 cards above the lowest card
   *
   * @param {*} hole1Converted
   * @param {*} hole2Converted
   * @param {*} outermostArr
   */

  populateOutermostArr(hole1Converted, hole2Converted, outermostArr) {
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

  /** Goes through deck and populates the internalArr
   *  This is the set of cards which falls in between the 2 hole cards
   *
   * @param {*} hole1Converted
   * @param {*} hole2Converted
   * @param {*} internalArr
   */

  populateInternalArr(hole1Converted, hole2Converted, internalArr) {
    for (let i = hole1Converted + 1; i < hole2Converted; i++) {
      internalArr.push(i);
    }

    //console.log("Internal Card Array: " + internalArr);
  }

  /** Go through deck and populate the externalArr
   *  This is set of cards that is less than 3 clicks from below the highest card,
   *  or less than 3 clicks above the lowest card
   *
   * @param {*} hole1Converted
   * @param {*} hole2Converted
   * @param {*} externalArr
   */

  populateExternalArr(hole1Converted, hole2Converted, externalArr) {
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

  /**  Ensures that all elements in outermostArr, internalArr and externalArr
   *   are mutually exclusive
   *
   * @param {*} hole1Converted
   * @param {*} hole2Converted
   * @param {*} outermostArr
   * @param {*} internalArr
   * @param {*} externalArr
   */

  removeOverlappingElementsFromExternalArr(
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

    return externalArr
  }

  /** Randomly picks the first 2 cards to insert into the flop array
   *  based on seperation between hole cards. At the end of this method,
   *  the flopArr will have 2 cards that are going to combine with the
   *  hole cards to make a inside straight draw, or variations of it 
   *
   * @param {*} hole1Converted
   * @param {*} hole2Converted
   * @param {*} outermostArr
   * @param {*} internalArr
   * @param {*} externalArr
   * @param {*} flopArr
   */

  buildInsideFlopArr(
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
      this.moveElement(
        Math.floor(Math.random() * internalArr.length),
        internalArr,
        flopArr
      );

      //Insert element from internalArr into flopArr
      this.moveElement(
        Math.floor(Math.random() * internalArr.length),
        internalArr,
        flopArr
      );

      //Enter this if hole cards seperated by 2 cards
    } else if (hole2Converted - hole1Converted == 3) {
      //Insert element from internalArr into flopArr
      this.moveElement(
        Math.floor(Math.random() * internalArr.length),
        internalArr,
        flopArr
      );

      //Insert element from outermostArr into flopArr
      this.moveElement(
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
        flopArr.push(
          internalArr[Math.floor(Math.random() * internalArr.length)]
        );
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

  /** Randomly picks the first 2 cards to insert into the flop array
   *  based on seperation between hole cards. At the end of this method,
   *  the flopArr will have 2 cards that are going to combine with the
   *  hole cards to make a open straight draw, or variations of it 
   * 
   * @param {*} hole1Converted 
   * @param {*} hole2Converted 
   * @param {*} flopArr 
   * @param {*} leftBranchArr 
   * @param {*} internalArr 
   * @param {*} rightBranchArr 
   */
  buildOpenFlopArr(
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
      this.moveElement(
        Math.floor(Math.random() * internalArr.length),
        internalArr,
        flopArr
      );

      //Inserts element from internalArr into flopArr
      this.moveElement(
        Math.floor(Math.random() * internalArr.length),
        internalArr,
        flopArr
      );
    } else if (hole2Converted - hole1Converted === 2) {
      //Inserts element from internalArr into flopArr
      this.moveElement(
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

  /**  Populates the 'left branch' of the 2 hole card set up,
   *   in descending order (highest first)
   *
   * @param {} hole1Converted
   * @param {*} hole2Converted
   * @param {*} leftBranchArr
   */

  populateLeftBranchArr(hole1Converted, hole2Converted, leftBranchArr) {
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

  /** Populates the 'right branch' of the 2 hole card set up,
   *  in ascending order (lowest first)
   *
   * @param { } hole1Converted
   * @param {*} hole2Converted
   * @param {*} rightBranchArr
   */

  populateRightBranchArr(hole1Converted, hole2Converted, rightBranchArr) {
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

  /** Decides whether to use a high ace conversion scheme (A = 13)
   *  Or a low ace conversion scheme (A = 1)
   *
   * @param {*} hole1
   * @param {*} hole2
   */

  decideConversionScheme(hole1, hole2) {
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

  /** Detects and deals with particular numbers that, if
   *  selected, will cause the flop to not be an inside straight.
   *  Modifies remainingNumberSet
   *
   * @param {*} flopAndHoleArr
   * @param {*} remainingNumberSet
   */

  detectNotInsideStraightAndPreventStraight(
    flopAndHoleArr,
    remainingNumberSet
  ) {
    let doubleGutshotNum;
    let openStraightNum;

    //Ensures no overlap
    remainingNumberSet = remainingNumberSet.filter(function (val) {
      return flopAndHoleArr.indexOf(val) == -1;
    });

    // Check the relationship between flopAndHoleArr[1] and flopAndHoleArr[2], adjacent means 3 numbers in flopAndHoleArr are adjacent
    // This makes it possible to end up with a Double Gutshot Draw or a Open Straight Draw that uses only 1 hole car
    if (flopAndHoleArr[1] + 1 === flopAndHoleArr[2]) {
      //Indicates 3 adjacent numbers are lower than the isolated number, so we look below them to detect open straight draws and double gutshots
      if (flopAndHoleArr[0] + 1 == flopAndHoleArr[1]) {
        //Removes middle card, eliminates possibility of straight directly on the flop
        remainingNumberSet.splice(
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
        remainingNumberSet.splice(
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
      remainingNumberSet.splice(
        remainingNumberSet.indexOf(flopAndHoleArr[1] + 1),
        1
      );
    }

    return [openStraightNum, doubleGutshotNum];
  }

  detectFlushDraw(flopAndHoleCardArr) {
    let suitArray = [];
    var count = {};
    let isFlushDraw = false;

    //Extracts just the suit values from each card
    flopAndHoleCardArr.forEach((card) => {
      suitArray.push(card[card.length - 1]);
    });

    //console.log(suitArray)

    suitArray.forEach(function (i) {
      count[i] = (count[i] || 0) + 1;
    });
    //console.log(count);

    //Decides if the cards are a flush draw
    if (
      count["d"] >= 4 ||
      count["h"] >= 4 ||
      count["s"] >= 4 ||
      count["c"] >= 4
    ) {
      isFlushDraw = true;
      //console.log("set flush draw to true")
    }

    return isFlushDraw;
  }

  //Assumes 2 different cards, within 3 cards of eachother
  generateInsideStraight(hole1, hole2) {
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
    let doubleGutshotNum;
    let openStraightNum;
    let thirdFlopNumber;

    //Decides conversion scheme
    let conversionArray = this.decideConversionScheme(hole1, hole2);
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
    }

    this.populateOutermostArr(hole1Converted, hole2Converted, outermostArr);
    this.populateInternalArr(hole1Converted, hole2Converted, internalArr);
    this.populateExternalArr(hole1Converted, hole2Converted, externalArr);
    
   
    //console.log("left branch:" + leftBranchArr);
    //console.log("right branch:" + rightBranchArr);
    //console.log("internalArr:" + internalArr);

    externalArr = this.removeOverlappingElementsFromExternalArr(
      hole1Converted,
      hole2Converted,
      outermostArr,
      internalArr,
      externalArr
    );

    console.log(hole1Converted)
    console.log(hole2Converted)
    console.log('outermostArr:' + outermostArr);
    console.log('internalArr:' + internalArr);
    console.log('externalArr:' + externalArr);


    this.buildInsideFlopArr(
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
    flopAndHoleArr.sort((a, b) => a - b);

    //Detects numbers that make the flop something other than an inside straight, and prevents flop straights
    let notInsideStraightCausers = this
      .detectNotInsideStraightAndPreventStraight(flopAndHoleArr, remainingNumberSet);
    openStraightNum = notInsideStraightCausers[0];
    doubleGutshotNum = notInsideStraightCausers[1];

    console.log(openStraightNum);
    console.log(doubleGutshotNum);
    console.log(remainingNumberSet);

    //Inserts random value from remainingNumberSet into flopArr
    thirdFlopNumber =
      remainingNumberSet[Math.floor(Math.random() * remainingNumberSet.length)];
    flopArr.push(thirdFlopNumber);

    //Converts the numbers back into the card values they represent
    flopArr = flopArr.map((flopNum) => backConvertor[flopNum]);

    //Attaches randomly selected suit values to the flop cards
    flopArr = flopArr.map((flopCard) =>
      flopCard.concat(suits[Math.floor(Math.random() * suits.length)])
    );

    //Creates array of the flop cards and the hole cards
    let flopAndHoleCardArr = [hole1, hole2];
    flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

    let isFlushDraw = this.detectFlushDraw(flopAndHoleCardArr);

    //Populates completeFlopInformation with information to be displayed
    if (isFlushDraw) {
      if (thirdFlopNumber === doubleGutshotNum) {
        completeFlopInformation["outs"] = 15;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Double Gutshot Flush Draw";
        
      } else if (thirdFlopNumber === openStraightNum) {
        completeFlopInformation["outs"] = 15;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Flush Draw";
      } else {
        completeFlopInformation["outs"] = 12;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Inside Straight Flush Draw";
      }
    } else {
      if (thirdFlopNumber === doubleGutshotNum) {
        completeFlopInformation["outs"] = 8;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Double Gutshot Draw";
      } else if (thirdFlopNumber === openStraightNum) {
        completeFlopInformation["outs"] = 8;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw";
      } else {
        completeFlopInformation["outs"] = 4;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Inside Straight Draw";
      }
    }

    //console.log("Hole cards: " + hole1 + " " + hole2);
    //console.log("Flop set: " + flopArr);
    //console.log("Outs: 4");
    console.log(completeFlopInformation);
  }

  generateOpenStraight(hole1, hole2) {
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
    let doubleGutshotNum;
    let openStraightNum;
    let thirdFlopNumber;
    let leftBranchIsUncut = true;
    let rightBranchIsUncut = true;
    let isCutIntoInsideStraight = false;

    //Decides conversion scheme
    let conversionArray = this.decideConversionScheme(hole1, hole2);
    convertor = conversionArray[0];
    backConvertor = conversionArray[1];

    //Converts cards using decided conversion scheme
    hole1Converted = convertor[hole1];
    hole2Converted = convertor[hole2];

    //console.log(convertor[hole1]);

    //console.log(hole1)
    //console.log(hole2)

    //Ensures hole1Converted < hole2Converted
    if (hole1Converted > hole2Converted) {
      let temp = hole1Converted;
      hole1Converted = hole2Converted;
      hole2Converted = temp;
    }

    //Detects if any branches are uncut
    if (hole2Converted < 5) {
      leftBranchIsUncut = false;
    }

    if (hole1Converted > 9) {
      rightBranchIsUncut = false;
    }

    //Error messages
    //console.log(hole1Converted)
    //console.log(hole2Converted)
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

    this.populateInternalArr(hole1Converted, hole2Converted, internalArr);
    this.populateLeftBranchArr(hole1Converted, hole2Converted, leftBranchArr);
    this.populateRightBranchArr(hole1Converted, hole2Converted, rightBranchArr);

    //TODO Build up openFlopArray
    //Enter if hole cards seperated by 2 cards

    this.buildOpenFlopArr(
      hole1Converted,
      hole2Converted,
      flopArr,
      leftBranchArr,
      internalArr,
      rightBranchArr
    );

    //Makes an array out of hole and flop cards, sort in ascending order
    let flopAndHoleArr = [hole1Converted, hole2Converted];
    flopAndHoleArr = flopAndHoleArr.concat(flopArr);
    flopAndHoleArr.sort((a, b) => a - b);

    //Checks to see if generated open straight it at the edge of numberline
    //in which case it is actually an inside straight
    if (flopAndHoleArr.includes(1) || flopAndHoleArr.includes(13)) {
      isCutIntoInsideStraight = true;
    }

    //Ensure no overlap
    remainingNumberSet = remainingNumberSet.filter(function (val) {
      return flopAndHoleArr.indexOf(val) == -1;
    });

    //Remove numbers that might cause outright straight upon flop
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

    // //Converts the numbers back into the card values they represent
    // console.log(flopArr);
    // flopArr = flopArr.map((flopNum) => backConvertor[flopNum]);
    // console.log(flopArr);

    /*********Start of new suit assigner */

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

    if (
      resetVariables
    ) {
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
      console.log('reattemping suit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!!!!!!!!!')
      
      resetVariables = true;
      
    }


    
  } while (
    Utilities.isFlush(flopAndHoleCardArr) ||
    Utilities.hasDuplicates(flopAndHoleCardArr)
  );

    /*********End of new suit assigner */


    // /****Start of old suit assigner  */

    // //Attaches randomly selected suit values to the flop cards
    // flopArr = flopArr.map((flopCard) =>
    //   flopCard.concat(suits[Math.floor(Math.random() * suits.length)])
    // );

    // //Creates array of the flop cards and the hole cards
    // let flopAndHoleCardArr = [hole1, hole2];
    // flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

    // /****End of old suit assigner  */

    let isFlushDraw = this.detectFlushDraw(flopAndHoleCardArr);

    //TODO: Insert overcard detection, and account for it below

    if (isFlushDraw) {
      if (isCutIntoInsideStraight) {
        completeFlopInformation["outs"] = 12;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Inside Straight Flush Draw";
      } else {
        completeFlopInformation["outs"] = 15;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Flush Draw";
      }
    } else {
      if (isCutIntoInsideStraight) {
        completeFlopInformation["outs"] = 4;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Inside Straight Draw";
      } else {
        completeFlopInformation["outs"] = 8;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Open Straight Draw";
      }
    }

    console.log(completeFlopInformation);
  }
}

let flopGen = new flopGenerator();



flopGen.generateInsideStraight("4c", "6c");
flopGen.generateInsideStraight("4c", "5c");
flopGen.generateInsideStraight("4c", "7c");
flopGen.generateInsideStraight("4c", "8c");

// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");
// flopGen.generateOpenStraight("4c", "6c");



console.log("----")

//todo write a class to generate hole cards

//TODO: For generate insideStraight, sometimes a straight draw 
//occurs. I thought this was prevented? Investigate how it's happening
//and as a brute force solution you could just include the straight 
//prevention mechanism you wrote in 

//TODO: Also import mechanism to prevent straight up flushes on the flop
//from your 