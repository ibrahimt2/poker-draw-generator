const Convertor = require("./convertor.js");

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
    for (let i = hole1Converted + 1; i < hole2Converted + 4; i++) {
      if (i <= 13) {
        externalArr.push(i);
      }
    }

    for (let i = hole2Converted - 1; i > hole2Converted - 4; i--) {
      if (i >= 0) {
        externalArr.push(i);
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

  removeOverlappingElements(
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
  }

  /** Randomly picks the first 2 cards to insert into the flop array
   *  based on seperation between hole cards. At the end of this method,
   *  the flopArr will have 2 cards that are going to combine with the
   *  hole cards to make a straight
   *
   * @param {*} hole1Converted
   * @param {*} hole2Converted
   * @param {*} outermostArr
   * @param {*} internalArr
   * @param {*} externalArr
   * @param {*} flopArr
   */

  buildFlopArr(
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

  //Assumes 2 different cards, within 3 clicks
  generateInsideStraight(hole1, hole2) {
    
    let completeFlopInformation = {};
    //By the end of this method, should look like
    /*
    {
        holeCards: ['Ac', 'Qc'],
        flopCards: ['10c', '9s', '2c'],
        name: 'Inside Straight Flush Draw',
        noOfOuts: 12
    }

    */
    let suits = ["h", "d", "s", "c"];
    let remainingNumberSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let hole1Converted;
    let hole2Converted;
    let convertor = Convertor.putCardGetNumAceLow;
    let backConvertor = Convertor.putNumGetCardValueAceLow;
    let outermostArr = [];
    let internalArr = [];
    let externalArr = [];
    let flopArr = [];
    let gutshotNum;
    let openStraightNum;
    let thirdFlopNumber;

    //To make calculation of straight easy, first you must convert hole cards from string representation (A,K,Q etc) into numbers 1-13
    //There are 2 schemes for this, one with A as 1 (low card) and the other with A as 13 (high card)
    //We use A as 1 by default, and switch if a high straight is possible

    //Convert cards using low ace scheme
    hole1Converted = convertor[hole1];
    hole2Converted = convertor[hole2];
    //console.log("First hole card: " + hole1Converted)
    //console.log("Second hole card: " + hole2Converted)

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

    //Cards reconverted to account for switched conversion scheme
    hole1Converted = convertor[hole1];
    hole2Converted = convertor[hole2];
    //console.log("Hole cards:" + hole1Converted + " " + hole2Converted);

    //Ensure hole1Converted < hole2Converted
    if (hole1Converted > hole2Converted) {
      let temp = hole1Converted;
      hole1Converted = hole2Converted;
      hole2Converted = temp;
    }

    if (hole1Converted == hole2Converted) {
      console.log("Error: This function is not designed for pocket pairs");
      return;
    }

    if (hole2Converted - hole1Converted > 4) {
      console.log(
        "Error: This function is not designed for pocket cards seperated by more than 3 cards"
      );
    }
    //console.log("Low Hole Card: " + hole1Converted);
    //console.log("High Hole Card: " + hole2Converted);

    this.populateOutermostArr(hole1Converted, hole2Converted, outermostArr);
    this.populateInternalArr(hole1Converted, hole2Converted, internalArr);
    this.populateExternalArr(hole1Converted, hole2Converted, externalArr);

    this.removeOverlappingElements(
      hole1Converted,
      hole2Converted,
      outermostArr,
      internalArr,
      externalArr
    );

    this.buildFlopArr(
      hole1Converted,
      hole2Converted,
      outermostArr,
      internalArr,
      externalArr,
      flopArr
    );

    //Making an array out of Hole and Flop cards, sort in ascending order
    let flopAndHoleArr = [hole1Converted, hole2Converted];
    flopAndHoleArr = flopAndHoleArr.concat(flopArr);
    flopAndHoleArr.sort((a, b) => a - b);
    //console.log(flopAndHoleArr);

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
          openStraightNum = flopAndHoleArr[0] - 1
        }

        //Checks to ensure we don't go below 0
        if (flopAndHoleArr[0] - 2 > 0) {
          
          //Remembers number that leads to double gutshot draw
          gutshotNum = flopAndHoleArr[0] - 2

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
          gutshotNum = flopAndHoleArr[3] + 2

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

    //console.log(remainingNumberSet);
    //Inserting random value from remainingNumberSet into flopArr

    thirdFlopNumber = remainingNumberSet[Math.floor(Math.random() * remainingNumberSet.length)];
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

    console.log(flopAndHoleCardArr);



    let suitArray = [];

    //Extracts just the suit values from each card
    flopAndHoleCardArr.forEach(card => {
        suitArray.push(card[card.length - 1]);
    })
        
    console.log(suitArray)

    let isFlushDraw = false;

    var count = {};
    suitArray.forEach(function(i) { count[i] = (count[i]||0) + 1;});
    console.log(count);

    //Decides if the cards are a flush draw
    if(count['d'] >= 4 || count['h'] >= 4 || count['s'] >= 4 || count['c'] >= 4) {
        isFlushDraw = true
        console.log("set flush draw to true")
    }

    if(isFlushDraw) {
        if(thirdFlopNumber === gutshotNum) {
            completeFlopInformation['outs'] = 15;
            completeFlopInformation['holeCards'] = [hole1, hole2];
            completeFlopInformation['flopCards'] = flopArr;
            completeFlopInformation['name'] = 'Double Gutshot Flush Draw';
        }

        if(thirdFlopNumber === openStraightNum) {
            completeFlopInformation['outs'] = 15;
            completeFlopInformation['holeCards'] = [hole1, hole2];
            completeFlopInformation['flopCards'] = flopArr;
            completeFlopInformation['name'] = 'Open Straight Flush Draw';
        } else {
            completeFlopInformation['outs'] = 12;
            completeFlopInformation['holeCards'] = [hole1, hole2];
            completeFlopInformation['flopCards'] = flopArr;
            completeFlopInformation['name'] = 'Inside Straight Flush Draw';
        }
    } else {
        if(thirdFlopNumber === gutshotNum) {
            completeFlopInformation['outs'] = 8;
            completeFlopInformation['holeCards'] = [hole1, hole2];
            completeFlopInformation['flopCards'] = flopArr;
            completeFlopInformation['name'] = 'Double Gutshot Draw';
        }

        if(thirdFlopNumber === openStraightNum) {
            completeFlopInformation['outs'] = 8;
            completeFlopInformation['holeCards'] = [hole1, hole2];
            completeFlopInformation['flopCards'] = flopArr;
            completeFlopInformation['name'] = 'Open Straight Draw';
        } else {
            completeFlopInformation['outs'] = 4;
            completeFlopInformation['holeCards'] = [hole1, hole2];
            completeFlopInformation['flopCards'] = flopArr;
            completeFlopInformation['name'] = 'Inside Straight Draw';
        }
    }
    
    console.log("Hole cards: " + hole1 + " " + hole2);
    console.log("Flop set: " + flopArr);
    console.log("Outs: 4");
    console.log(completeFlopInformation)
    //Now start building the flop array
    //if(/* hole cards seperated by 3 clicks */) {
    //Select & remove 1 number from internalArr
    //Select & remove 1 number from internalArr
    //} else if (/* hole cards seperated by 2 clicks */) {
    //Select & remove 1 internal card
    //Select & remove 1 external card
    //} else if (/* hole cards seperated by 1 clicks */) {
    //Select & remove 1 outermost card
    //If high outermost card is selected, remove cards from externalArr that are lower than hole cards
    //If low outermost card is selected, remove cards from externalArr that are higher than hole cards
    //    if (/* probability function with probablity of NoOfInternalCards/NoOfInternalCards + NoOfExternalCards of being true*/ ) {
    //Select & remove 1 internal card
    //    } else {
    //Select & remove 1 external card
    //    }
    //} else if (/* hole cards seperated by 0 clicks */) {
    //Select & remove 1 outermost card, remove remaining cards with with equivalent value
    //If high outermost card is selected, remove cards from externalArr that are lower than hole cards
    //If low outermost card is selected, remove cards from externalArr that are higher than hole cards
    //Select & remove 1 external card, remove remaining cards with with equivalent value
    //Select & remove 1 external card, remove remaining cards with with equivalent value
    //}

    //4 OPTIONS NOW
    //1. Pick middle card, have therfore flopping a flush
    //2. Pick card that is 1 click from lowest of 4 cards or 1 click above highest of 4 cards (Double Belly Buster = 8 outs)
    //3. Pick any other card (normal straight draw)
    //4. Pick a card that pairs with a hole card (6 outs)
    //5. Inside straight flush
    //6. Other possibilities
    //7. TODO write seperate functions that use this one to produce each of the given scenarios

    //Now, randomise flopArray order
    //Convert numbers back into facecards (13 --> A or 1 --> A)
    //Give facecards suit values from [h, s, d, c]
    //Present flopArray
  }
}

let flopGen = new flopGenerator();

flopGen.generateInsideStraight("6c", "7d");
console.log("----");
flopGen.generateInsideStraight("Kc", "10d");
console.log("----");
flopGen.generateInsideStraight("7c", "10d");
console.log("----");
flopGen.generateInsideStraight("Ac", "10d");
console.log("----");
flopGen.generateInsideStraight("4c", "Ad");
console.log("----");
flopGen.generateInsideStraight("Ac", "Qd");
console.log("----");
flopGen.generateInsideStraight("Ac", "Kd");
console.log("----");
flopGen.generateInsideStraight("Kc", "Jd");
console.log("----");
flopGen.generateInsideStraight("Ac", "10c");
console.log("----");
flopGen.generateInsideStraight("Qh", "10h");
console.log("----");
flopGen.generateInsideStraight("5d", "6d");
console.log("----");
flopGen.generateInsideStraight("8c", "5c");

//todo write a class to generate hole cards 
