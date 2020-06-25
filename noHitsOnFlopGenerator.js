let Utilities = require("./utilities.js");
let Convertor = require("./convertor.js");

//Having an Ace in the input might fuck things up using a
//Low ace scheme, as A = 1 will be low, so the second
//card will be hole2, and thus remove everything above it

//Modify conversion scheme decider to make it so that
//Having an A automatically makes it use high card scheme

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

function hasDuplicates(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
    var value = array[i];
    if (value in valuesSoFar) {
      return true;
    }
    valuesSoFar[value] = true;
  }
  return false;
}

/** Select a zone, select a number from the zone,
 *  remove selected number from availableNumberArr
 *  until there is only 1 zone with a length greater than 1
 *
 *
 * @param {*} holeZonesArr
 * @param {*} availableNumberArr
 */

function depopulateAvailableNumArrUsingZoneArr(
  holeZonesArr,
  availableNumberArr,
  hole1Converted,
  hole2Converted
) {
  while (holeZonesArr.length > 0) {
    let pickedZoneArr = holeZonesArr.splice(
      Math.floor(Math.random() * holeZonesArr.length),
      1
    ); //Apparently this returned a double nested array instead of a single array, hence the 0 below being necessary
    let pickedZoneArrNum =
      pickedZoneArr[0][Math.floor(Math.random() * pickedZoneArr.length)]; //The necessity of the 0 here is quite interesting

    if(pickedZoneArrNum === hole1Converted || pickedZoneArrNum === hole2Converted) {
      holeZonesArr.push(pickedZoneArr);
    } else {
      availableNumberArr.splice(availableNumberArr.indexOf(pickedZoneArrNum), 1);
    }

  }
}

function populateNoHitsFlopInformation(
  hole1Converted,
  hole2Converted,
  hole1,
  hole2,
  flopArr,
  flopArrNums,
  completeFlopInformation
) {
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

function populateZone1(availableNumberArr, holeConverted, holeZone1Arr) {
  if (holeConverted - 4 > 0 && availableNumberArr.includes(holeConverted - 4)) {
    holeZone1Arr.push(holeConverted - 4);
  }

  if (holeConverted - 3 > 0 && availableNumberArr.includes(holeConverted - 3)) {
    holeZone1Arr.push(holeConverted - 3);
  }
}

function populateZone2(availableNumberArr, holeConverted, holeZone2Arr) {
  if (holeConverted - 2 > 0 && availableNumberArr.includes(holeConverted - 2)) {
    holeZone2Arr.push(holeConverted - 2);
  }

  if (holeConverted - 1 > 0 && availableNumberArr.includes(holeConverted - 1)) {
    holeZone2Arr.push(holeConverted - 1);
  }
}

function populateZone3(availableNumberArr, holeConverted, holeZone3Arr) {
  if (
    holeConverted + 1 < 14 &&
    availableNumberArr.includes(holeConverted + 1)
  ) {
    holeZone3Arr.push(holeConverted + 1);
  }

  if (
    holeConverted + 2 < 14 &&
    availableNumberArr.includes(holeConverted + 2)
  ) {
    holeZone3Arr.push(holeConverted + 2);
  }
}

function populateZone4(availableNumberArr, holeConverted, holeZone4Arr) {
  if (
    holeConverted + 3 < 14 &&
    availableNumberArr.includes(holeConverted + 3)
  ) {
    holeZone4Arr.push(holeConverted + 3);
  }

  if (
    holeConverted + 4 < 14 &&
    availableNumberArr.includes(holeConverted + 4)
  ) {
    holeZone4Arr.push(holeConverted + 4);
  }
}

function populateZoneArr(holeZonesArr, availableNumberArr, holeConverted) {
  let holeZone1Arr = [];
  let holeZone2Arr = [];
  let holeZone3Arr = [];
  let holeZone4Arr = [];

  populateZone1(availableNumberArr, holeConverted, holeZone1Arr);
  populateZone2(availableNumberArr, holeConverted, holeZone2Arr);
  populateZone3(availableNumberArr, holeConverted, holeZone3Arr);
  populateZone4(availableNumberArr, holeConverted, holeZone4Arr);

  holeZonesArr.push(holeZone1Arr)
  holeZonesArr.push(holeZone2Arr)
  holeZonesArr.push(holeZone3Arr)
  holeZonesArr.push(holeZone4Arr)

  console.log('holeZone1Arr: ' + holeZone1Arr)
  console.log('holeZone2Arr: ' + holeZone2Arr)
  console.log('holeZone3Arr: ' + holeZone3Arr)
  console.log('holeZone4Arr: ' + holeZone4Arr)



}

function moveElement(index, fromArray, toArray) {
    toArray.push(fromArray[index]);
    fromArray.splice(index, 1);
  }

function generateFlushDraw(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = Convertor.putCardGetNumAceHigh;
  let backConvertor = Convertor.putNumGetCardValueAceHigh;
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


  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Ensures hole1Converted < hole2Converted
  if (hole1Converted > hole2Converted) {
    let temp = hole1Converted;
    hole1Converted = hole2Converted;
    hole2Converted = temp;
  }

  //Removes numbers corresponding to hole cards from available pool
  availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

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

  depopulateAvailableNumArrUsingZoneArr(hole1ZonesArr, availableNumberArr);
  populateZoneArr(hole2ZonesArr, availableNumberArr, hole2Converted);

  //Filters out zone arrays who don't have more than 1 element
  hole2ZonesArr = hole2ZonesArr.filter((zoneArray) => {
    return zoneArray.length > 1;
  });

  depopulateAvailableNumArrUsingZoneArr(hole2ZonesArr, availableNumberArr);

  console.log(availableNumberArr);

  //Pick 3 numbers from availableNumberArr
  moveElement(Math.floor(Math.random() * availableNumberArr.length), availableNumberArr, flopArr);


  //If hole cards are suited, then the suit of the last card won't be flopSuit, so it can have the same value as secondlast flopArrCard without risking duplication, as they're bound 
  //to have different suits

  //This is not the case when hole cards are not suited
  if(holeCardsAreSuited) {
    flopArr.push(availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]);
    flopArr.push(availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]);
  } else {
    moveElement(Math.floor(Math.random() * availableNumberArr.length), availableNumberArr, flopArr);
    flopArr.push(availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]);
    
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

  if(holeCardsAreSuited) {
    flopArr[2] = flopArr[2].concat(nonFlushSuitsArr[Math.floor(Math.random() * nonFlushSuitsArr .length)]);
  } else {
    flopArr[2] = flopArr[2].concat(flushSuit);
  }

  completeFlopInformation["outs"] = 9;
  completeFlopInformation["holeCards"] = [hole1, hole2];
  completeFlopInformation["flopCards"] = flopArr;
  completeFlopInformation["name"] = "Flush Draw";
  
  console.log(completeFlopInformation);

}

function generateTripsToFullhouseOrQuads(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let tripsHole1Suits = ["h", "d", "s", "c"];
  let tripsHole2Suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = Convertor.putCardGetNumAceHigh;
  let backConvertor = Convertor.putNumGetCardValueAceHigh;
  let completeFlopInformation = {};
  let isPocketPair = false;
  let tripsHole1Hole2Suits;

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

  console.log('tripsHole1Suits: ' + tripsHole1Suits)
  console.log('tripsHole2Suits: ' + tripsHole2Suits)

  //If pocket pair, generate an array that has all suits not represented in the hole cards
  if(isPocketPair) {
      tripsHole1Hole2Suits = tripsHole1Suits.filter( ( el ) => tripsHole2Suits.includes( el ) );
  }

  if(isPocketPair) {
      flopArr.push(hole1Converted);
      flopArr[0] = backConvertor[flopArr[0]];
      console.log('tripsHole1Hole2Suits: ' + tripsHole1Hole2Suits)
      flopArr[0] = flopArr[0].concat(tripsHole1Hole2Suits[Math.floor(Math.random() * tripsHole1Hole2Suits.length)]);
  } else {
      if(Math.random() < 0.5) {
          //use first hole card to make trips
          flopArr.push(hole1Converted);
          flopArr.push(hole1Converted);

          //Convert back into card value
          flopArr[0] = backConvertor[flopArr[0]];
          flopArr[1] = backConvertor[flopArr[1]];

          //Select a suit from tripsHole1Suits
          let flopSuit1 = tripsHole1Suits[Math.floor(Math.random() * tripsHole1Suits.length)]
          
          //Remove selected suit from tripsHole1Suits
          tripsHole1Suits.splice(tripsHole1Suits.indexOf(flopSuit1), 1);
          
          //Attach selected suit to card value
          flopArr[0] = flopArr[0].concat(flopSuit1);

          //Select a suit from tripsHole1Suits
          let flopSuit2 = tripsHole1Suits[Math.floor(Math.random() * tripsHole1Suits.length)]
          
          //Remove selected suit from tripsHole1Suits
          tripsHole1Suits.splice(tripsHole1Suits.indexOf(flopSuit2), 1);
          
          //Attach selected suit to card value
          flopArr[1] = flopArr[1].concat(flopSuit2);

        console.log('tripsHole1Suit: ' + tripsHole1Suits)
        console.log('flopSuit1: ' + flopSuit1)
        console.log('flopSuit2: ' + flopSuit2)

      } else {
          //use second hole card to make trips
          flopArr.push(hole2Converted);
          flopArr.push(hole2Converted);

          //Convert back into card value
          flopArr[0] = backConvertor[flopArr[0]];
          flopArr[1] = backConvertor[flopArr[1]];

          //Select a suit from tripsHole1Suits
          let flopSuit1 = tripsHole2Suits[Math.floor(Math.random() * tripsHole2Suits.length)]
          
          //Remove selected suit from tripsHole1Suits
          tripsHole2Suits.splice(tripsHole2Suits.indexOf(flopSuit1), 1);
          
          //Attach selected suit to card value
          flopArr[0] = flopArr[0].concat(flopSuit1);

          //Select a suit from tripsHole1Suits
          let flopSuit2 = tripsHole2Suits[Math.floor(Math.random() * tripsHole2Suits.length)]
          
          //Remove selected suit from tripsHole1Suits
          tripsHole2Suits.splice(tripsHole2Suits.indexOf(flopSuit2), 1);
          
          //Attach selected suit to card value
          flopArr[1] = flopArr[1].concat(flopSuit2);

          console.log('tripsHole2Suit:' + tripsHole2Suits)
          console.log('flopSuit1:' + flopSuit1)
          console.log('flopSuit2: ' + flopSuit2)
      }
  }

  //Insert number from availableNumberArr into flopArr
  flopArr.push(
    availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]
  );

  //If pocket pair, only 1 number has been inserted so far, thus insert another number from availableNumberArr into flopArr
  if(isPocketPair) {
    flopArr.push(availableNumberArr[Math.floor(Math.random() * availableNumberArr.length)]);
  }

  //Preserve flopArrNums incase a second attempt is needed when assigning flop suits
  flopArrNums = flopArr;

  //Converting card numbers into values
  flopArr[2] = backConvertor[flopArrNums[2]];

  //If pocket pair, the number at index 1 has not yet been converted into card value
  if(isPocketPair) {
    flopArr[1] = backConvertor[flopArrNums[1]];
  }

  //Partially populates flopAndHoleCardArr
  flopAndHoleCardArr = [hole1, hole2];
  flopArrNums = flopArr;

  do {

    if(isPocketPair) {
        flopArr[1] = flopArr[1].concat(suits[Math.floor(Math.random() * suits.length)]);
    } 

    flopArr[2] = flopArr[2].concat(suits[Math.floor(Math.random() * suits.length)]);

    flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);


    if(Utilities.isFlushDraw(flopAndHoleCardArr) || hasDuplicates(flopAndHoleCardArr)) {

        flopArr[2] = backConvertor[flopArrNums[2]];
        if(isPocketPair) {
            flopArr[1] = backConvertor[flopArrNums[1]];
        }

        flopAndHoleCardArr = [hole1, hole2];
    }

  } while (
    Utilities.isFlushDraw(flopAndHoleCardArr) ||
    hasDuplicates(flopAndHoleCardArr)
  );

  completeFlopInformation["outs"] = 7;
  completeFlopInformation["holeCards"] = [hole1, hole2];
  completeFlopInformation["flopCards"] = flopArr;
  completeFlopInformation["name"] = "Trips to Fullhouse/Quads"

  console.log(completeFlopInformation);

}

function OnePairToTwoPairOrTrips(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let onePairHole1Suits = ["h", "d", "s", "c"];
  let onePairHole2Suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = Convertor.putCardGetNumAceHigh;
  let backConvertor = Convertor.putNumGetCardValueAceHigh;
  let hole1ZonesArr = [];
  let hole2ZonesArr = [];
  let completeFlopInformation = {};
  let flopAndHoleCardArr;
  let flopArrNums;

  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Error messages
  if (hole1Converted === hole2Converted) {
    console.log("This function is not designed for pocket pairs");
    return;
  }

  //Just remove numbers corresponding to hole cards from available pool
  availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

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

  depopulateAvailableNumArrUsingZoneArr(hole1ZonesArr, availableNumberArr, hole1Converted);
  populateZoneArr(hole2ZonesArr, availableNumberArr, hole2Converted);

  //Filters out zone arrays who don't have more than 1 element
  hole2ZonesArr = hole2ZonesArr.filter((zoneArray) => {
    return zoneArray.length > 1;
  });

  depopulateAvailableNumArrUsingZoneArr(hole2ZonesArr, availableNumberArr);

  console.log('availableNumberArr: ' + availableNumberArr)

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
    
    if(resetVariables) {
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

    if (
      Utilities.isFlushDraw(flopAndHoleCardArr) ||
      hasDuplicates(flopAndHoleCardArr)
    ) {
    //   console.log('reattemping suit!!!!!!!!!!!!!!!!!!!!')
    //   console.log('!!!!!!!!!!!!!!!!!!!!')
    //   console.log('!!!!!!!!!!!!!!!!!!!!')
      
      resetVariables = true;
      
    }
  } while (
    Utilities.isFlushDraw(flopAndHoleCardArr) ||
    hasDuplicates(flopAndHoleCardArr)
  );

  //Populate completeFlopInformation with information about the flop
  completeFlopInformation["outs"] = 5;
  completeFlopInformation["holeCards"] = [hole1, hole2];
  completeFlopInformation["flopCards"] = flopArr;
  completeFlopInformation["name"] = "One Pair to Two Pair or Trips";

  console.log(completeFlopInformation);
}

function generateTwoPairToFullhouse(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let twoPairHole1Suits = ["h", "d", "s", "c"];
  let twoPairHole2Suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = Convertor.putCardGetNumAceHigh;
  let backConvertor = Convertor.putNumGetCardValueAceHigh;
  let completeFlopInformation = {};

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

  //Populate completeFlopInformation with information about the flop
  completeFlopInformation["outs"] = 4;
  completeFlopInformation["holeCards"] = [hole1, hole2];
  completeFlopInformation["flopCards"] = flopArr;
  completeFlopInformation["name"] = "Two pair to Fullhouse";

  console.log(completeFlopInformation);
}

function generateNoHitsFlop(hole1, hole2) {
  let flopArr = [];
  let suits = ["h", "d", "s", "c"];
  let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let convertor = Convertor.putCardGetNumAceHigh;
  let backConvertor = Convertor.putNumGetCardValueAceHigh;
  let hole1ZonesArr = [];
  let hole2ZonesArr = [];
  let completeFlopInformation = {};
  let flopArrNums;
  let flopArrCards;

  //Converts cards using decided conversion scheme
  hole1Converted = convertor[hole1];
  hole2Converted = convertor[hole2];

  //Ensures hole1Converted < hole2Converted
  if (hole1Converted > hole2Converted) {
    let temp = hole1Converted;
    hole1Converted = hole2Converted;
    hole2Converted = temp;
  }

  // //Removes numbers corresponding to hole cards from available pool
  // availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  // availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

  //Implementing straight generation protection

  console.log('hole1Zones');
  populateZoneArr(hole1ZonesArr, availableNumberArr, hole1Converted);

  //console.log(hole1ZonesArr + hole1ZonesArr)

  //Filters out zone arrays who don't have more than 1 element
  hole1ZonesArr = hole1ZonesArr.filter((zoneArray) => {
    return zoneArray.length > 1;
  });

  depopulateAvailableNumArrUsingZoneArr(hole1ZonesArr, availableNumberArr, hole1Converted, hole2Converted);
  console.log('availableNumberArr after hole1Depop: ' + availableNumberArr);


  console.log('hole2Zones');
  populateZoneArr(hole2ZonesArr, availableNumberArr, hole2Converted);

  //Filters out zone arrays who don't have more than 1 element
  hole2ZonesArr = hole2ZonesArr.filter((zoneArray) => {
    return zoneArray.length > 1;
  });

  depopulateAvailableNumArrUsingZoneArr(hole2ZonesArr, availableNumberArr, hole1Converted, hole2Converted);
  console.log('availableNumberArr after hole2Depop: ' + availableNumberArr);


  //At this point, you can select any number from availableNumberArr without fear of causing a straight

  //Removes numbers corresponding to hole cards from available pool
  availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
  availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);
  console.log('hole1Converted: ' + hole1Converted)
  console.log('hole2Converted: ' + hole2Converted)
  console.log('availableNumberArr: ' + availableNumberArr);

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
  resetVariables = false;

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
      Utilities.isFlushDraw(flopAndHoleCardArr) ||
      hasDuplicates(flopAndHoleCardArr)
    ) {
      console.log('reattemping suit!!!!!!!!!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!!!!!!!!!')
      
      resetVariables = true;
      
    }


    
  } while (
    Utilities.isFlushDraw(flopAndHoleCardArr) ||
    hasDuplicates(flopAndHoleCardArr)
  );

  populateNoHitsFlopInformation(
    hole1Converted,
    hole2Converted,
    hole1,
    hole2,
    flopArr,
    flopArrNums,
    completeFlopInformation
  );

  console.log(completeFlopInformation);
}



//TODO: The straight draw prevention algorithm doesn't work all the time, just 
//some of the time
//There are a lot of special cases where 

//TODO: I think you broke the straight prevention algorithm when you were sectoring it away into a method
//It doesn't seem to be working in any of it's current incarnations, always only removes just 2 elements.

//UPDATE: Straight draw prevention algorithm fixed in generateNoHitsFlop
//Straight draw prevention algorithm not used in generateTwoPairToFullhouse
//Straight draw  prevention algorithm fixed in generate OnePairToTwoPairOrTrips
//Straight draw  prevention algorithm not used in generateTripsToFullhouseOrQuads
//Straight draw prevention algorithm fixed in generateFlush

//Note that the current straight straight draw prevention algorithm skill OCCASIONALLY
//results in a flush, thus your theoritical basis for the algorithm is wrong and needs
//more work. However, a majority of the time it works so we can use a stopgap measure
//of some sort to detect and weed out straight draw or account for them in the out
//counting stage maybe

// generateFlushDraw("Ac", "Ad");
// generateFlushDraw("7c", "7d");
// generateFlushDraw("3c", "7c");
// generateFlushDraw("Ad", "2d");
// generateFlushDraw("5c", "7d");
// generateFlushDraw("3c", "7d");
// generateFlushDraw("Ac", "2d");

// generateTripsToFullhouseOrQuads("Ac", "Ad")
// generateTripsToFullhouseOrQuads("7c", "7d")
// generateTripsToFullhouseOrQuads("3c", "7d")
// generateTripsToFullhouseOrQuads("Ac", "2d")
// generateTripsToFullhouseOrQuads("5c", "7d")

// generateTwoPairToFullhouse("5c", "7d");
// generateTwoPairToFullhouse("6c", "7d");
// generateTwoPairToFullhouse("3c", "7d");
// generateTwoPairToFullhouse("Ac", "2d");
// generateTwoPairToFullhouse("9c", "Qd");
// generateTwoPairToFullhouse("5c", "7d");
// generateTwoPairToFullhouse("6c", "7d");
// generateTwoPairToFullhouse("3c", "7d");

// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')

// OnePairToTwoPairOrTrips('3c', '7d')
// OnePairToTwoPairOrTrips('Ac', '2d')
// OnePairToTwoPairOrTrips('9c', 'Qd')
// OnePairToTwoPairOrTrips('5c', '7d')
// OnePairToTwoPairOrTrips('6c', '7d')
// OnePairToTwoPairOrTrips('3c', '7d')
// OnePairToTwoPairOrTrips('Ac', '2d')
// OnePairToTwoPairOrTrips('9c', 'Qd')

// generateNoHitsFlop("5c", "7d");
// generateNoHitsFlop("6c", "7d");
// generateNoHitsFlop("8c", "7d");
// generateNoHitsFlop("9c", "8d");
// generateNoHitsFlop("10c", "9d");
// generateNoHitsFlop("10c", "Qd");
// generateNoHitsFlop("9c", "Qd");


generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
generateNoHitsFlop("6c", "7d");
generateNoHitsFlop("8c", "7d");
console.log("end");
