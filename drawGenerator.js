let Convertor = require('./convertor');
let StrDrawGen = require('./straightDrawGenerator');
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

populateDrawFunctionArray(drawFunctionArray, StrDrawGen.generateInsideStraight, INSIDE_STRAIGHT_FREQ);
populateDrawFunctionArray(drawFunctionArray, StrDrawGen.generateOpenStraight, OPEN_STRAIGHT_FREQ);
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateFlushDraw, FLUSH_DRAW_FREQ);
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateNoHitsFlop, NO_HITS_FREQ);
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateOnePairToTwoPairOrTrips, ONE_PAIR_TO_TWO_PAIR_OR_TRIPS_FREQ)
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateTripsToFullhouseOrQuads, TRIPS_TO_FULLHOUSE_QUADS_FREQ);
populateDrawFunctionArray(drawFunctionArray, ReductiveDrawGen.generateTwoPairToFullhouse, TWO_PAIR_TO_FULLHOSE_FREQ);

console.log(drawFunctionArray)
let chosenFunction = drawFunctionArray[1]
console.log(hole1 + " " + hole2)
let flopInformation = chosenFunction(hole1, hole2)
