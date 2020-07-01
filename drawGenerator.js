let Convertor = require("./convertor");
let StrDrawGen = require("./straightDrawGenerator");
let Utilities = require("./utilities");
let ReductiveDrawGen = require("./reductiveDrawGenerator");

/**
 * @typedef {Object} completeFlopInformation
 * @param {Number} outs The number of outs associated with the draw
 * @param {Array} holeCards The original hole cards
 * @param {Array} flopArr The cards in the flop
 * @param {String} name The specific name of the draw
 */

/**
 * Summary.
 * Randomly selects hole cards from 52 card deck,
 * then selects a method to generate flop from, and
 * returns an object containing information about the
 * flop
 *
 * @returns {completeFlopInformation}
 */

function generateFlopScenario() {
  const INSIDE_STRAIGHT_FREQ = 0;
  const OPEN_STRAIGHT_FREQ = 0;
  const FLUSH_DRAW_FREQ =1;
  const NO_HITS_FREQ = 0;
  const TRIPS_TO_FULLHOUSE_QUADS_FREQ = 0;
  const TWO_PAIR_TO_FULLHOSE_FREQ = 1;
  const ONE_PAIR_TO_TWO_PAIR_OR_TRIPS_FREQ = 0;

  //Error messages
  if(NO_HITS_FREQ === 0 && TRIPS_TO_FULLHOUSE_QUADS_FREQ === 0 && FLUSH_DRAW_FREQ === 0) {
    console.log('Error: Ensure atleast one of NO_HITS_FREQ, TRIPS_TO_FULLHOUSE_QUADS_FREQ OR FLUSH_DRAW_FREQ > 0');
    return;
  }

  //simple assignment results in array being passed by ref
  //we want to pass by value cos we need fresh deck each time
  let cardDeckArr = Array.from(Convertor.putPosNumGetCard);

  let hole1 = cardDeckArr.splice(Math.floor(Math.random() * cardDeckArr.length), 1);
  let hole2 = cardDeckArr.splice(Math.floor(Math.random() * cardDeckArr.length), 1);

  //Splicing returns a String[], but extracts the String within the String[]
  hole1 = hole1[0];
  hole2 = hole2[0];

  //Decides conversion scheme
  let conversionArray = Utilities.decideConversionScheme(hole1, hole2);
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

  const drawFunctionArray = [];

  if (
    hole1Converted !== hole2Converted &&
    !(hole2Converted - hole1Converted > 4)
  ) {
    populateDrawFunctionArray(
      drawFunctionArray,
      StrDrawGen.generateInsideStraight,
      INSIDE_STRAIGHT_FREQ
    );
  }

  if (
    hole1Converted !== hole2Converted &&
    !(hole2Converted - hole1Converted > 3)
  ) {
    populateDrawFunctionArray(
      drawFunctionArray,
      StrDrawGen.generateOpenStraight,
      OPEN_STRAIGHT_FREQ
    );
  }

  populateDrawFunctionArray(
    drawFunctionArray,
    ReductiveDrawGen.generateFlushDraw,
    FLUSH_DRAW_FREQ
  );
  populateDrawFunctionArray(
    drawFunctionArray,
    ReductiveDrawGen.generateNoHitsFlop,
    NO_HITS_FREQ
  );

  if(hole1Converted !== hole2Converted) {
    populateDrawFunctionArray(
      drawFunctionArray,
      ReductiveDrawGen.generateOnePairToTwoPairOrTrips,
      ONE_PAIR_TO_TWO_PAIR_OR_TRIPS_FREQ
    );
  }

  
  populateDrawFunctionArray(
    drawFunctionArray,
    ReductiveDrawGen.generateTripsToFullhouseOrQuads,
    TRIPS_TO_FULLHOUSE_QUADS_FREQ
  );

  if(hole1Converted !== hole2Converted) {
    populateDrawFunctionArray(
      drawFunctionArray,
      ReductiveDrawGen.generateTwoPairToFullhouse,
      TWO_PAIR_TO_FULLHOSE_FREQ
    );
  }

  

  let chosenFunction =
    drawFunctionArray[Math.floor(Math.random() * drawFunctionArray.length)];
    console.log(typeof chosenFunction);
    console.log(cardDeckArr)
    console.log(hole1 + " " + hole2)
    let flopInformation = chosenFunction(hole1, hole2);
  console.log(flopInformation);
  //refresh card deck
  cardDeckArr = Convertor.putPosNumGetCard;
  return flopInformation;
}

/**
 * Summary.
 * Inserts given number of instances of
 * a draw generating funciton into draw
 * function array
 *
 * @param {Function[]} drawFunctionArray
 * @param {Function} drawFunction
 * @param {Number} funtionFrequency
 */

function populateDrawFunctionArray(
  drawFunctionArray,
  drawFunction,
  funtionFrequency
) {
  for (let i = 0; i < funtionFrequency; i++) {
    drawFunctionArray.push(drawFunction);
  }
}

generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();

generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();
generateFlopScenario();

