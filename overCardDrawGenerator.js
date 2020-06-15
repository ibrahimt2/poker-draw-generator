let utilities = require('./utilities.js');
let convertor = require('./convertor.js');

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


function populateUnderNumArr(holeConverted, holeUnderNumArr) {
    for(let i = 0, a = holeConverted - 1; i < 4; i++, a--) {
        if(a > 0) {
            holeUnderNumArr.push(a);
        }
    }
    console.log(holeUnderNumArr);
}

function populateOverNumArr(holeConverted, holeOverNumArr) {
    for(let i = 0, a = holeConverted + 1; i < 4; i++, a++) {
        if(a < 14) {
            holeOverNumArr.push(a)
        }
    }
} 

function populateAcrossNumArr(holeConverted, holeAcrossNumArr) {
    for(let i = 0, a = 1; i < 2; i++, a++) {
        if(holeConverted - a > 0) {
            holeAcrossNumArr.push(holeConverted - a)
        }

        if(holeConverted + a < 14) {
            holeAcrossNumArr.push(holeConverted + a)
        }
    }
}


function generateOneOvercardDraw(hole1, hole2) {
    let flopArr;
    let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let convertor = convertor.putCardGetNumAceHigh;
    let backConvertor = convertor.putNumGetCardValueAceHigh;
    hole1UnderNumArr = [];
    hole1OverNumArr = [];
    hole1AcrossNumArr = [];
    hole2UnderNumArr = [];

    //Converts cards using decided conversion scheme
    hole1Converted = convertor[hole1];
    hole2Converted = convertor[hole2];

    //Ensures hole1Converted < hole2Converted
    if (hole1Converted > hole2Converted) {
        let temp = hole1Converted;
        hole1Converted = hole2Converted;
        hole2Converted = temp;
      }  

    if(hole2Converted === hole2Converted ) {
        console.log("This function is not meant for pocket pairs")
        return;
    } else if (hole2Converted < 5) {
        console.log("One Overcard Draw not possible when your highest hole card is less than 5");
        return;
    }

    //Just remove numbers corresponding to hole cards from available pool
    remainingNumberArray.splice(remainingNumberArray.indexOf(hole1Converted), 1);
    remainingNumberArray.splice(remainingNumberArray.indexOf(hole2Converted), 1);

    //Remove numbers higher than intended overcard
    remainingNumberArray = remainingNumberArray.filter((number) => {
        return number < hole2Converted;
    })

    //Implement straight generation protection

    //Populate hole1 arrays
    populateUnderNumArr(hole1, hole1UnderNumArr);
    populateOverNumArr(hole1, hole1OverNumArr);
    populateAcrossNumArr(hole1, hole1AcrossNumArr);

    //Populate hole2 arrays
    //No use populating over and across arrays, as they have already been depopulated
    //sufficiently by removing all numbers above hole2Converted
    populateUnderNumArr(hole2, hole2UnderNumArr);

    //Randomly remove 2 numbers from hole1AcrossNumArr
    let hole1RemovedNum1 = hole1AcrossNumArr.splice(Math.floor(Math.random() * remainingNumberSet.length));
    let hole1RemovedNum2 = hole1AcrossNumArr.splice(Math.floor(Math.random() * remainingNumberSet.length));

    //Remove numbers you removed from hole1AcrossNumArr from hole1OverNumArr
    hole1OverNumArr.splice(hole1OverNumArr.indexOf(hole1RemovedNum1), 1);
    hole1OverNumArr.splice(hole1OverNumArr.indexOf(hole1RemovedNum2), 1);

    //Remove numbers you removed from hole1AcrossNumArr from hole1UnderNumArr
    hole1UnderNumArr.splice(hole1UnderNumArr.indexOf(hole1RemovedNum1), 1);
    hole1UnderNumArr.splice(hole1UnderNumArr.indexOf(hole1RemovedNum2), 1);

    //Remove numbers you removed from hole1AcrossNumArr from hole1OverNumArr
    hole1OverNumArr.splice(hole1OverNumArr.indexOf(hole1RemovedNum1), 1);
    hole1OverNumArr.splice(hole1OverNumArr.indexOf(hole1RemovedNum2), 1);

    while(hole1Under)

    //Then, just implement loop to regenerate suit values if it's a flush draw


}

let holeAcrossNumArr = []

populateAcrossNumArr(6, holeAcrossNumArr);
console.log(holeAcrossNumArr);