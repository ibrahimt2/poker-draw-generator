const { decideConversionScheme } = require("./utilities");
const { putPosNumGetCard } = require("./convertor");
const { generateFlushDraw } = require("./generateFlushDraw");
const { generateInsideStraight } = require("./generateInsideStraight");
const { generateOpenStraight } = require("./generateOpenStraight");
const { generateNoHitsFlop } = require("./generateNoHits");
const {
  generateOnePairToTwoPairOrTrips,
} = require("./generateOnePairToTwoPairOrTrips");
const {
  generateTripsToFullhouseOrQuads,
} = require("./generateTripsToFullhouseOrQuads");
const { generateTwoPairToFullhouse } = require("./generateTwoPairToFullhouse");

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

function generateFlopScenario(insideStraightFreq, openStraightFreq, flushDrawFreq, noHitsFreq, tripsToFullhouseOrQuadsFreq, twoPairToFullhouseFreq, onePairToTwoPairOrTripsFreq) {
  //console.log(Utilities)


  //Error messages
  if (
    noHitsFreq === 0 &&
    tripsToFullhouseOrQuadsFreq === 0 &&
    flushDrawFreq === 0
  ) {
    console.log(
      "Error: Ensure atleast one of NO_HITS_FREQ, TRIPS_TO_FULLHOUSE_QUADS_FREQ OR FLUSH_DRAW_FREQ > 0"
    );
    return;
  }

  //simple assignment results in array being passed by ref
  //we want to pass by value cos we need fresh deck each time
  let cardDeckArr = Array.from(putPosNumGetCard);

  let hole1 = cardDeckArr.splice(
    Math.floor(Math.random() * cardDeckArr.length),
    1
  );
  let hole2 = cardDeckArr.splice(
    Math.floor(Math.random() * cardDeckArr.length),
    1
  );

  //Splicing returns a String[], but extracts the String within the String[]
  hole1 = hole1[0];
  hole2 = hole2[0];

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

  const drawFunctionArray = [];

  if (
    hole1Converted !== hole2Converted &&
    !(hole2Converted - hole1Converted > 4)
  ) {
    populateDrawFunctionArray(
      drawFunctionArray,
      generateInsideStraight,
      insideStraightFreq
    );
  }

  if (
    hole1Converted !== hole2Converted &&
    !(hole2Converted - hole1Converted > 3)
  ) {
    populateDrawFunctionArray(
      drawFunctionArray,
      generateOpenStraight,
      openStraightFreq
    );
  }

  populateDrawFunctionArray(
    drawFunctionArray,
    generateFlushDraw,
    flushDrawFreq
  );
  populateDrawFunctionArray(
    drawFunctionArray,
    generateNoHitsFlop,
    noHitsFreq
  );

  if (hole1Converted !== hole2Converted) {
    populateDrawFunctionArray(
      drawFunctionArray,
      generateOnePairToTwoPairOrTrips,
      onePairToTwoPairOrTripsFreq
    );
  }

  populateDrawFunctionArray(
    drawFunctionArray,
    generateTripsToFullhouseOrQuads,
    tripsToFullhouseOrQuadsFreq
  );

  if (hole1Converted !== hole2Converted) {
    populateDrawFunctionArray(
      drawFunctionArray,
      generateTwoPairToFullhouse,
      twoPairToFullhouseFreq
    );
  }

  let chosenFunction =
    drawFunctionArray[Math.floor(Math.random() * drawFunctionArray.length)];
  //console.log(typeof chosenFunction);
  //console.log(cardDeckArr)
  //console.log(hole1 + " " + hole2)
  let flopInformation = chosenFunction(hole1, hole2);
  //console.log(flopInformation);
  //refresh card deck
  cardDeckArr = putPosNumGetCard;
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

module.exports = {
  generateFlopScenario: generateFlopScenario,
};


console.log(generateFlopScenario(0, 0, 1, 0, 0, 0, 0));
console.log(generateFlopScenario(100, 0, 1, 0, 0, 0, 0));
console.log(generateFlopScenario(0, 100, 1, 0, 0, 0, 0));
console.log(generateFlopScenario(0, 0, 1, 100, 0, 0, 0));
console.log(generateFlopScenario(0, 0, 1, 0, 100, 0, 0));
console.log(generateFlopScenario(0, 0, 1, 0, 0, 100, 0));
console.log(generateFlopScenario(0, 0, 1, 0, 0, 0, 100));
