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
  const INSIDE_STRAIGHT_FREQ = 4;
  const OPEN_STRAIGHT_FREQ = 4;
  const FLUSH_DRAW_FREQ = 1;
  const NO_HITS_FREQ = 10;
  const TRIPS_TO_FULLHOUSE_QUADS_FREQ = 1;
  const TWO_PAIR_TO_FULLHOSE_FREQ = 1;
  const ONE_PAIR_TO_TWO_PAIR_OR_TRIPS_FREQ = 1;

  let cardDeck = Convertor.putPosNumGetCard;

  let hole1 = cardDeck.splice(Math.floor(Math.random() * cardDeck.length), 1);
  let hole2 = cardDeck.splice(Math.floor(Math.random() * cardDeck.length), 1);

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
    hole2Converted - hole1Converted > 4
  ) {
    populateDrawFunctionArray(
      drawFunctionArray,
      StrDrawGen.generateInsideStraight,
      INSIDE_STRAIGHT_FREQ
    );
  }

  if (
    hole1Converted !== hole2Converted &&
    hole2Converted - hole1Converted > 3
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
  populateDrawFunctionArray(
    drawFunctionArray,
    ReductiveDrawGen.generateOnePairToTwoPairOrTrips,
    ONE_PAIR_TO_TWO_PAIR_OR_TRIPS_FREQ
  );
  populateDrawFunctionArray(
    drawFunctionArray,
    ReductiveDrawGen.generateTripsToFullhouseOrQuads,
    TRIPS_TO_FULLHOUSE_QUADS_FREQ
  );
  populateDrawFunctionArray(
    drawFunctionArray,
    ReductiveDrawGen.generateTwoPairToFullhouse,
    TWO_PAIR_TO_FULLHOSE_FREQ
  );

  let chosenFunction =
    drawFunctionArray[Math.floor(Math.random() * drawFunctionArray.length)];
  let flopInformation = chosenFunction(hole1, hole2);
  console.log(flopInformation);
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
