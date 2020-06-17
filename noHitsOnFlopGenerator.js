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


function populateZone1(availableNumberArr, holeConverted, holeZone1Arr) {
    
    if(holeConverted - 4 > 0 && availableNumberArr.includes(holeConverted - 4)) {
        holeZone1Arr.push(holeConverted - 4);
    }

    if(holeConverted - 3 > 0 && availableNumberArr.includes(holeConverted - 3)) {
        holeZone1Arr.push(holeConverted - 3);
    }

}

function populateZone2(availableNumberArr, holeConverted, holeZone2Arr) {
    
    if(holeConverted - 2 > 0 && availableNumberArr.includes(holeConverted - 2)) {
        holeZone2Arr.push(holeConverted - 2);
    }

    if(holeConverted - 1 > 0 && availableNumberArr.includes(holeConverted - 1)) {
        holeZone2Arr.push(holeConverted - 1);
    }

}

function populateZone3(availableNumberArr, holeConverted, holeZone3Arr) {
    
    if(holeConverted + 1 < 14 && availableNumberArr.includes(holeConverted + 1)) {
        holeZone3Arr.push(holeConverted + 1);
    }

    if(holeConverted + 2 < 14 && availableNumberArr.includes(holeConverted + 2)) {
        holeZone3Arr.push(holeConverted + 2);
    }

}

function populateZone4(availableNumberArr, holeConverted, holeZone4Arr) {
    
    if(holeConverted + 3 < 14 && availableNumberArr.includes(holeConverted + 3)) {
        holeZone4Arr.push(holeConverted + 3);
    }

    if(holeConverted + 4 < 14 && availableNumberArr.includes(holeConverted + 4)) {
        holeZone4Arr.push(holeConverted + 4);
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
    let flopArr = [];
    let suits = ["h", "d", "s", "c"];
    let availableNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let removedNumberArr = []
    let convertor = Convertor.putCardGetNumAceHigh;
    let backConvertor = Convertor.putNumGetCardValueAceHigh;
    let hole1zone1arr = [];
    let hole1zone2arr = [];
    let hole1zone3arr = [];
    let hole1zone4arr = [];
    let hole2zone1arr = [];
    let hole2zone2arr = [];
    let hole2zone3arr = [];
    let hole2zone4arr = [];
    let completeFlopInformation = {};
    
    

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

    //console.log(`hole1: ${hole1Converted}`);
    //console.log(`hole2: ${hole2Converted}`);

    populateZone1(availableNumberArr, hole1Converted, hole1zone1arr)
    populateZone2(availableNumberArr, hole1Converted, hole1zone2arr)
    populateZone3(availableNumberArr, hole1Converted, hole1zone3arr)
    populateZone4(availableNumberArr, hole1Converted, hole1zone4arr)

    //Form an array of zone
    let hole1ZonesArr = [hole1zone1arr, hole1zone2arr, hole1zone3arr, hole1zone4arr];

    //Filters out zone arrays who's elements were already removed by the round of removals on hole1ZoneArrays
    hole1ZonesArr = hole1ZonesArr.filter(zoneArray => {
        return zoneArray.length > 1
    });

    console.log(hole1ZonesArr);

    while(hole1ZonesArr.length > 1) {

    //Select a zone, select a number from the zone, remove selected number from availableNumberArr (3 times)
    let pickedHole1ZoneArr = hole1ZonesArr.splice(Math.floor(Math.random()*hole1ZonesArr.length), 1)            //Apparently this returned a double nested array instead of a single array, hence the 0 below being necessary
    // console.log('pickedHole1ZoneArr: ' + pickedHole1ZoneArr)
    // console.log('hole1ZonesAr' + hole1ZonesArr)
    let pickedHole1ZoneArrNum = pickedHole1ZoneArr[0][Math.floor(Math.random() * pickedHole1ZoneArr.length)];   //The necessity of the 0 here is quite interesting
    // console.log('pickedHole1ZoneArrNum' + pickedHole1ZoneArrNum)
    availableNumberArr.splice(availableNumberArr.indexOf(pickedHole1ZoneArrNum), 1);

    }

    

    //Populate hole2 zone arrays
    populateZone1(availableNumberArr, hole2Converted, hole2zone1arr)
    populateZone2(availableNumberArr, hole2Converted, hole2zone2arr)
    populateZone3(availableNumberArr, hole2Converted, hole2zone3arr)
    populateZone4(availableNumberArr, hole2Converted, hole2zone4arr)

    //Form an array of zone
    let hole2ZonesArr = [hole2zone1arr, hole2zone2arr, hole2zone3arr, hole2zone4arr];

    //Filters out zone arrays who's elements were already removed by the round of removals on hole1ZoneArrays
    hole2ZonesArr = hole2ZonesArr.filter(zoneArray => {
        return zoneArray.length > 1
    });

    while(hole2ZonesArr.length > 1) {

    //Select a zone, select a number from the zone, remove selected number from availableNumberArr (3 times)
    let pickedHole2ZoneArr = hole2ZonesArr.splice(Math.floor(Math.random()*hole2ZonesArr.length), 1)
    let pickedHole2ZoneArrNum = pickedHole2ZoneArr[0][Math.floor(Math.random() * pickedHole2ZoneArr.length)];
    availableNumberArr.splice(availableNumberArr.indexOf(pickedHole2ZoneArrNum), 1);

    }

    //At this point, you can select any number from availableNumberArr without fear of causing a straight

    //Move 3 items from availableNumberArr into flopArr

   

    flopArr.push(availableNumberArr.splice(Math.floor(Math.random()*availableNumberArr.length), 1))
    flopArr.push(availableNumberArr.splice(Math.floor(Math.random()*availableNumberArr.length), 1))
    flopArr.push(availableNumberArr.splice(Math.floor(Math.random()*availableNumberArr.length), 1))

    let flopArrNums = flopArr;

    //Converts the numbers back into the card values they represent
    flopArr = flopArr.map((flopNum) => backConvertor[flopNum]);
    let flopAndHoleCardArr = [hole1, hole2];


    //Assigns suits to flopCards, and redoes it if a flush draw is generated
    do {

        flopArr = flopArr.map((flopCard) =>
            flopCard.concat(suits[Math.floor(Math.random() * suits.length)])
        );

        flopAndHoleCardArr = flopAndHoleCardArr.concat(flopArr);

    } while (Utilities.detectFlushDraw(flopAndHoleCardArr))

    if(hole1Converted === hole2Converted) {
        //Pocket pair to trips
        completeFlopInformation["outs"] = 2;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Pocket pair to trips";
    } else if (flopArrNums.every(el => el < hole1Converted) && flopArrNums.every(el => el < hole2Converted))  {
        //Two overcards to overpair
        completeFlopInformation["outs"] = 6;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "Two overcards to overpair";
    } else if (flopArrNums.every(el => el < hole1Converted) || flopArrNums.every(el => el < hole2Converted)) {
        //One overcard to overpair
        completeFlopInformation["outs"] = 3;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "One overcard to overpair";
    } else {
        //No pair to pair
        completeFlopInformation["outs"] = 6;
        completeFlopInformation["holeCards"] = [hole1, hole2];
        completeFlopInformation["flopCards"] = flopArr;
        completeFlopInformation["name"] = "No pair to pair";
    }



    //At this point your availableNumberArr should pass the 3/4 zones inactive test, but verify further


    // console.log('hole1: ' + hole1Converted)
    // console.log('hole2: ' + hole2Converted)
    // console.log('hole1zone1arr: ' + hole1zone1arr)
    // console.log('hole1zone2arr: ' + hole1zone2arr)
    // console.log('hole1zone3arr: ' + hole1zone3arr)
    // console.log('hole1zone4arr: ' + hole1zone4arr)
    // console.log('hole2zone1arr: ' + hole2zone1arr)
    // console.log('hole2zone2arr: ' + hole2zone2arr)
    // console.log('hole2zone3arr: ' + hole2zone3arr)
    // console.log('hole2zone4arr: ' + hole2zone4arr)
    
    // console.log('hole1:'+ hole1Converted)
    // console.log('hole2:'+ hole2Converted)
    // console.log('availabeNumberArr' + availableNumberArr);

    // console.log('hole1:'+ hole1)
    // console.log('hole2:'+ hole2)
    // console.log('flop: ' + flopArr)
    console.log(completeFlopInformation);


    
    

    //Populate hole2 arrays
  
    // console.log(hole1AcrossNumArr.length);
    // console.log(hole1UnderNumArr.length);
    // console.log(hole1OverNumArr.length);
    // console.log(hole2AcrossNumArr.length)
    // console.log(hole2UnderNumArr.length);
    // console.log(hole2OverNumArr.length);

    //Then, just implement loop to regenerate suit values if it's a flush draw


}


generateOneOvercardDraw('5c', '7d');
generateOneOvercardDraw('6c', '7d');
generateOneOvercardDraw('3c', '7d');
generateOneOvercardDraw('Ac', '7d');
generateOneOvercardDraw('Ac', 'Kd');
generateOneOvercardDraw('10c', 'Qd');
generateOneOvercardDraw('9c', 'Qd');
generateOneOvercardDraw('Ac', '2d');
generateOneOvercardDraw('Ac', '3d');
generateOneOvercardDraw('Jc', '8d');


