let Utilities = require('./utilities.js');
let Convertor = require('./convertor.js');

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


function populateUnderNumArr(availableNumberArr, holeConverted, holeUnderNumArr) {
    for(let i = 0, a = holeConverted - 1; i < 4; i++, a--) {
        if(a > 0 && availableNumberArr.includes(a)) {
            holeUnderNumArr.push(a);
        }
    }
    //console.log(holeUnderNumArr);
}

function populateOverNumArr(availableNumberArr, holeConverted, holeOverNumArr) {
    for(let i = 0, a = holeConverted + 1; i < 4; i++, a++) {
        if(a < 14 && availableNumberArr.includes(a)) {
            holeOverNumArr.push(a)
        }
    }
} 

function populateAcrossNumArr(availableNumberArr, holeConverted, holeAcrossNumArr) {
    for(let i = 0, a = 1; i < 2; i++, a++) {
        if(holeConverted - a > 0 && availableNumberArr.includes(holeConverted - a)) {
            holeAcrossNumArr.push(holeConverted - a)
        }

        if(holeConverted + a < 14 && availableNumberArr.includes(holeConverted + a)) {
            holeAcrossNumArr.push(holeConverted + a)
        }
    }
}



//THIS DOESN'T WORK, ESSENTIALLY YOU WANT IT SO THAT WHENEVER THIS IS CALLED,
//IT REMOVES THE NUMBER FROM THE PRIMARY ARRAY ASWELL AS ALL SECONDARY ARRAYS,
//BUT KEEPS THE NUMBER OF ELEMENTS IN EACH ARRAY ABOVE 2 WHENEVER POSSIBLE
//CURRENTLY, IT LEAVES NUMBERS IT HAS REMOVED FROM ONE ARRAY IN OTHER ARRAYS, POSSIBLY DUE TO THE >2 restriction saving numbers that should have been removed
function depopulateUntil2Elements(removedNumberArr, primaryArray, secondaryArray, secondaryArray2, secondaryArray3, secondaryArray4, secondaryArray5) {

    let firstRemovedElement;
    let secondRemovedElement;

    //Randomly remove 2 numbers from hole1AcrossNumArr
    if(primaryArray.length > 2) {
        let firstRemovedElement = primaryArray.splice(Math.floor(Math.random() * primaryArray.length), 1);
        console.log('Removing element: ' + firstRemovedElement)
        removedNumberArr.push(firstRemovedElement);
        
    }

    if(primaryArray.length > 2) {
        let secondRemovedElement = primaryArray.splice(Math.floor(Math.random() * primaryArray.length), 1);
        console.log('Removing element: ' + secondRemovedElement)
        removedNumberArr.push(secondRemovedElement);
    }

    //Remove numbers you removed from primaryArray, until length is 2
    if(secondaryArray2.length > 2 && firstRemovedElement) {
        secondaryArray2.splice(secondaryArray2.indexOf(firstRemovedElement), 1);
        console.log('Removing element: ' + firstRemovedElement)
        console.log('In secondaryArray2 1')
    }

    if(secondaryArray2.length > 2 && secondRemovedElement) {
        secondaryArray2.splice(secondaryArray2.indexOf(secondRemovedElement), 1);
        console.log('Removing element: ' + secondRemovedElement)
        console.log('In secondaryArray2 2')
    }

    //Remove numbers you removed from primaryArray, until length is 2
    if(secondaryArray.length > 2 && firstRemovedElement) {
        secondaryArray.splice(secondaryArray.indexOf(firstRemovedElement), 1);
        console.log('Removing element: ' + firstRemovedElement)
        console.log('In secondaryArray 1')
    }

    if(secondaryArray.length > 2 && secondRemovedElement) {
        secondaryArray.splice(secondaryArray.indexOf(secondRemovedElement), 1);
        console.log('Removing element: ' + secondRemovedElement)
        console.log('In secondaryArray 2')
    }

    //Remove numbers you removed from primaryArray, until length is 2
    if(secondaryArray3.length > 2 && firstRemovedElement) {
        secondaryArray3.splice(secondaryArray3.indexOf(firstRemovedElement), 1);
        console.log('Removing element: ' + firstRemovedElement)
        console.log('In secondaryArray3 1')
    }

    if(secondaryArray3.length > 2 && secondRemovedElement) {
        secondaryArray3.splice(secondaryArray3.indexOf(secondRemovedElement), 1);
        console.log('Removing element: ' + secondRemovedElement)
        console.log('In secondaryArray3 2')
    }

    //Remove numbers you removed from primaryArray, until length is 2
    if(secondaryArray5.length > 2 && firstRemovedElement) {
        secondaryArray5.splice(secondaryArray5.indexOf(firstRemovedElement), 1);
        console.log('Removing element: ' + firstRemovedElement)
        console.log('In secondaryArray5 1')
    }

    if(secondaryArray5.length > 2 && secondRemovedElement) {
        secondaryArray5.splice(secondaryArray5.indexOf(secondRemovedElement), 1);
        console.log('Removing element: ' + secondRemovedElement)
        console.log('In secondaryArray5 2')
    }

    //Remove numbers you removed from primaryArray, until length is 2
    if(secondaryArray4.length > 2 && firstRemovedElement) {
        secondaryArray4.splice(secondaryArray4.indexOf(firstRemovedElement), 1);
        console.log('Removing element: ' + firstRemovedElement)
        console.log('In secondaryArray4 1')
    }

    if(secondaryArray4.length > 2 && secondRemovedElement) {
        secondaryArray4.splice(secondaryArray4.indexOf(secondRemovedElement), 1);
        console.log('Removing element: ' + secondRemovedElement)
        console.log('In secondaryArray4 2')
    }

    console.log('method end' )
}


function generateOneOvercardDraw(hole1, hole2) {
    let flopArr;
    let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let removedNumberArr = []
    let convertor = Convertor.putCardGetNumAceHigh;
    let backConvertor = Convertor.putNumGetCardValueAceHigh;
    hole1UnderNumArr = [];
    hole1OverNumArr = [];
    hole1AcrossNumArr = [];
    hole2UnderNumArr = [];
    hole2OverNumArr = [];
    hole2AcrossNumArr = [];

    //Converts cards using decided conversion scheme
    hole1Converted = convertor[hole1];
    hole2Converted = convertor[hole2];

    //Ensures hole1Converted < hole2Converted
    if (hole1Converted > hole2Converted) {
        let temp = hole1Converted;
        hole1Converted = hole2Converted;
        hole2Converted = temp;
      }  

    // if(hole2Converted === hole2Converted ) {
    //     console.log("This function is not meant for pocket pairs")
    //     return;
    // } else if (hole2Converted < 5) {
    //     console.log("One Overcard Draw not possible when your highest hole card is less than 5");
    //     return;
    // }

    //Just remove numbers corresponding to hole cards from available pool
    availableNumberArr.splice(availableNumberArr.indexOf(hole1Converted), 1);
    availableNumberArr.splice(availableNumberArr.indexOf(hole2Converted), 1);

    console.log(availableNumberArr)
    // //Remove numbers higher than intended overcard
    // remainingNumberArray = remainingNumberArray.filter((number) => {
    //     return number < hole2Converted;
    // })

    //Implement straight generation protection

    console.log(`hole1: ${hole1Converted}`);
    console.log(`hole2: ${hole2Converted}`);

    //Populate hole1 arrays
    populateUnderNumArr(availableNumberArr, hole1Converted, hole1UnderNumArr);
    populateOverNumArr(availableNumberArr, hole1Converted, hole1OverNumArr);
    populateAcrossNumArr(availableNumberArr, hole1Converted, hole1AcrossNumArr);
    console.log(`hole1UnderNumArr: ${hole1UnderNumArr}`);
    console.log(`hole1OverNumArr: ${hole1OverNumArr}`);
    console.log(`hole1AcrossNumArr: ${hole1AcrossNumArr}`);

    //Populate hole2 arrays
    populateUnderNumArr(availableNumberArr, hole2Converted, hole2UnderNumArr);
    populateOverNumArr(availableNumberArr, hole2Converted, hole2OverNumArr);
    populateAcrossNumArr(availableNumberArr, hole2Converted, hole2AcrossNumArr);
    console.log(`hole2UnderNumArr: ${hole2UnderNumArr}`);
    console.log(`hole2OverNumArr: ${hole2OverNumArr}`);
    console.log(`hole2AcrossNumArr: ${hole2AcrossNumArr}`);

    availableNumberArr.filter
    
    // console.log(hole1AcrossNumArr.length);
    // console.log(hole1UnderNumArr.length);
    // console.log(hole1OverNumArr.length);
    // console.log(hole2AcrossNumArr.length)
    // console.log(hole2UnderNumArr.length);
    // console.log(hole2OverNumArr.length);

    //Then, just implement loop to regenerate suit values if it's a flush draw


}

generateOneOvercardDraw('Ac', 'Kd');
generateOneOvercardDraw('Qc', 'Kd');
generateOneOvercardDraw('5c', '7d');
generateOneOvercardDraw('Ac', '2d');
generateOneOvercardDraw('Ac', '4d');