let Convertor = require('./convertor');
let StrDrawGen = require('./straightDrawGenerator');
let Utilities = require('./utilities');
let ReductiveDrawGen = require('./reductiveDrawGenerator');

const INSIDE_STRAIGHT_FREQ = 1 
const OPEN_STRAIGHT_FREQ = 1
const FLUSH_DRAW_FREQ = 1
const NO_HITS_FREQ = 1
const TRIPS_TO_FULLHOUSE_QUADS_FREQ = 1
const TWO_PAIR_TO_FULLHOSE_FREQ = 1
const ONE_PAIR_TO_TWO_PAIR_OR_TRIPS_FREQ = 1


let cardDeck = Convertor.putPosNumGetCard;

let hole1 = cardDeck.splice(Math.floor(Math.random() * cardDeck.length), 1);
let hole2 = cardDeck.splice(Math.floor(Math.random() * cardDeck.length), 1);

//Splicing returns a String[], but extracts the String within the String[]
hole1 = hole1[0]
hole2 = hole2[0]

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

const drawFunctionArray = []

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

function populateDrawFunctionArray(drawFunctionArray, drawFunction, funtionFrequency) {
    for(let i = 0; i < funtionFrequency; i++) {
        drawFunctionArray.push(drawFunction);
    }
}

if(hole1Converted !== hole2Converted && hole2Converted - hole1Converted > 4) {
    populateDrawFunctionArray(drawFunctionArray, StrDrawGen.generateInsideStraight, INSIDE_STRAIGHT_FREQ);
}

if(hole1Converted !== hole2Converted && hole2Converted - hole1Converted > 3) {
    populateDrawFunctionArray(drawFunctionArray, StrDrawGen.generateOpenStraight, OPEN_STRAIGHT_FREQ);
}

populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateFlushDraw, FLUSH_DRAW_FREQ);
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateNoHitsFlop, NO_HITS_FREQ);
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateOnePairToTwoPairOrTrips, ONE_PAIR_TO_TWO_PAIR_OR_TRIPS_FREQ)
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateTripsToFullhouseOrQuads, TRIPS_TO_FULLHOUSE_QUADS_FREQ);
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateTwoPairToFullhouse, TWO_PAIR_TO_FULLHOSE_FREQ);

console.log(drawFunctionArray)
let chosenFunction = drawFunctionArray[Math.floor(Math.random() * drawFunctionArray.length)]
console.log(typeof hole1 + " " + typeof hole2)
let flopInformation = chosenFunction(hole1, hole2)
console.log(flopInformation)
