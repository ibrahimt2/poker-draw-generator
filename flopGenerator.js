const Convertor = require('./convertor.js');


class flopGenerator {

    moveElement(index, fromArray, toArray) {
        toArray.push(fromArray[index]);
        fromArray.splice(index, 1);
      }

    generateInsideStraight(hole1, hole2) {


    //Assumes 2 different cards, within 3 clicks
    generateInsideStraightWithTwoCards(hole1, hole2) { 
        //Populate sets of internal, external, outermost cards
        let suits = ['a', 'd', 's', 'c'];
        let remainingNumberSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        let hole1Converted;
        let hole2Converted;
        let convertor = Convertor.putCardGetNumAceLow;
        let backConvertor = Convertor.putNumGetCardValueAceLow
        let outermostArr = [];
        let internalArr = [];
        let externalArr = [];
        let flopArr = []

        //To make calculation of straight easy, first you must convert hole cards from string representation (A,K,Q etc) into numbers 1-13
        //There are 2 schemes for this, one with A as 1 (low card) and the other with A as 13 (high card)
        //We use A as 1 by default, and switch if a high straight is possible

        //Convert cards using low ace scheme
        hole1Converted = convertor[hole1];
        hole2Converted = convertor[hole2];
        //console.log("First hole card: " + hole1Converted)
        //console.log("Second hole card: " + hole2Converted)
        

        //Switch to high ace scheme if necessary
        if(hole1Converted >= 10 || hole2Converted >= 10) {
            if(hole1Converted == 1 || hole2Converted == 1) {
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
        
        //Now you have 13 numbers with the appropriate mapping (either A of clubs = 13 or 1)

        //Ensure hole1Converted < hole2Converted
        if (hole1Converted > hole2Converted) {
            let temp = hole1Converted;
            hole1Converted = hole2Converted;
            hole2Converted = temp;
        }

        if (hole1Converted == hole2Converted) {
            console.log("This function is not designed for pocket pairs")
            return;
        }

        if(hole2Converted - hole1Converted > 4) {
            console.log("This function is not designed for pocket cards seperated by more than 3 clicks");
        }
        //console.log("Low Hole Card: " + hole1Converted);
        //console.log("High Hole Card: " + hole2Converted);

        //Remove hole cards from the 13 numbers
        //numberSet.splice(numberSet.indexOf(hole1Converted), 1);
        //numberSet.splice(numberSet.indexOf(hole2Converted), 1);
        //console.log(numberSet);

        //Now you have 11 numbers, with the numbers of hole cards removed

        //Go through the deck and populate the outermostArr
        //This is the set of cards which are exactly 3 clicks below the highest card, or exactly 3 clicks above the lowest card
        if(hole2Converted >= 5) {   //Prevents numbers outside conversion range
            outermostArr.push(hole2Converted - 4);
        }

        if(hole1Converted <= 9) {  //Prevents numbers outside conversion range
            outermostArr.push(hole1Converted + 4);
        }
        //console.log("Outermost Card Array: " + outermostArr)
        
        //Go through deck and populate the internalArr
        //This is the set of cards which falls in between the 2 hole cards
        for (let i = hole1Converted + 1; i < hole2Converted; i++) {
            internalArr.push(i);
        }
        //console.log("Internal Card Array: " + internalArr);

        //Go through deck and populate the externalArr
        //This is set of cards that is less than 3 clicks from below the highest card, or less than 3 clicks above the lowest card 
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
        
        //Eliminate overlap with internalArr
        externalArr = externalArr.filter(function(val) {
            return internalArr.indexOf(val) == -1;
        })

        //Eliminate overlap with outermostArr
        externalArr = externalArr.filter(function(val) {
            return outermostArr.indexOf(val) == -1;
        })

        //Remove hole cards
        externalArr.splice(externalArr.indexOf(hole1Converted), 1);
        externalArr.splice(externalArr.indexOf(hole2Converted), 1);

        //console.log("External Card Array: " + externalArr);



        //Start building flop array
        if (hole2Converted - hole1Converted == 4) {         //Seperated by 3 clicks
            this.moveElement(Math.floor(Math.random() * internalArr.length), internalArr, flopArr); //Insert element from internalArr into flopArr
            this.moveElement(Math.floor(Math.random() * internalArr.length), internalArr, flopArr); //Insert element from internalArr into flopArr
        } else if (hole2Converted - hole1Converted == 3) {  //Seperated by 2 clicks
            this.moveElement(Math.floor(Math.random() * internalArr.length), internalArr, flopArr); //Insert element from internalArr into flopArr
            this.moveElement(Math.floor(Math.random() * outermostArr.length), outermostArr, flopArr); //Insert element from externalArr into flopArr
        } else if (hole2Converted - hole1Converted == 2) {  //Seperated by 1 click
            let selectedOutermostCard = outermostArr[Math.floor(Math.random() * outermostArr.length)]; //Insert element from outermostArr into flopArr
            flopArr.push(selectedOutermostCard);
            if (Math.random() < (internalArr.length/(internalArr.length + externalArr.length))) {      //Probability functions that depends on internalArr and externalArr
                flopArr.push(internalArr[Math.floor(Math.random() * internalArr.length)]);             
            } else {
                if (selectedOutermostCard < hole1Converted) {
                    flopArr.push(selectedOutermostCard + 1);
                } else if (selectedOutermostCard > hole2Converted) {
                    flopArr.push(selectedOutermostCard - 1) 
                }
            }
        } else if (hole2Converted - hole1Converted == 1) { //Seperated by 0 clicks
            let selectedOutermostCard = outermostArr[Math.floor(Math.random() * outermostArr.length)];
            flopArr.push(selectedOutermostCard);
            if (selectedOutermostCard < hole1Converted) {
                if (Math.random() < 0.5) {
                    flopArr.push(selectedOutermostCard + 1) 
                } else {
                    flopArr.push(selectedOutermostCard + 2)
                }
            } else if (selectedOutermostCard > hole2Converted) {
                if (Math.random() < 0.5) {
                    flopArr.push(selectedOutermostCard - 1) 
                } else {
                    flopArr.push(selectedOutermostCard - 2)
                }
            } 
        }

        //Making an array out of Hole and Flop cards
        let flopAndHoleArr = [hole1Converted, hole2Converted]
        flopAndHoleArr = flopAndHoleArr.concat(flopArr);
        //Sorting numerically
        flopAndHoleArr.sort((a,b)=>a-b);
        //console.log(flopAndHoleArr);

        remainingNumberSet = remainingNumberSet.filter(function(val) {
            return flopAndHoleArr.indexOf(val) == -1;
        })

        //Removing double gutshot possibility 
        //Check the relationship between flopAndHoleArr[1] and flopAndHoleArr[2], adjacent means 3 cards bunched up together
        if(flopAndHoleArr[1] + 1 === flopAndHoleArr[2]) {
            //console.log('3 cards bunched up together')
            if(flopAndHoleArr[0] + 1 == flopAndHoleArr[1]) { //Indicates 3 cards bunched up at the end
                remainingNumberSet.splice(remainingNumberSet.indexOf(flopAndHoleArr[3] - 1), 1); //removes middle card

                if(flopAndHoleArr[0] - 1 > 0) { //Check to ensure we don't go below 0
                    remainingNumberSet.splice(remainingNumberSet.indexOf(flopAndHoleArr[0] - 1), 1); //removes open straight draw
                }

                if(flopAndHoleArr[0] - 2 > 0) { //Check to ensure we don't go below 0
                    remainingNumberSet.splice(remainingNumberSet.indexOf(flopAndHoleArr[0] - 2), 1); //removes double gutshot draw
                    
                }
            } else if(flopAndHoleArr[2] + 1 === flopAndHoleArr[3]) {//Indicates 3 cards bunced up at the start
                remainingNumberSet.splice(remainingNumberSet.indexOf(flopAndHoleArr[0] + 1), 1); //removes middle card
                if (flopAndHoleArr[3] + 1 < 13) { //Check to ensure we don't go below 0
                    remainingNumberSet.splice(remainingNumberSet.indexOf(flopAndHoleArr[3] + 1), 1); //removes open straight draw
                    
                }
                if (flopAndHoleArr[3] + 2 < 13) {
                    remainingNumberSet.splice(remainingNumberSet.indexOf(flopAndHoleArr[3] + 2), 1); //removes double gutshot draw
                }
            }
        } else { //2 cards, space, 2 cards
            remainingNumberSet.splice(remainingNumberSet.indexOf(flopAndHoleArr[1] + 1), 1); //remove middle card
        }
       
        //console.log(remainingNumberSet);
        //Inserting random value from remainingNumberSet into flopArr
        this.moveElement(Math.floor(Math.random() * remainingNumberSet.length), remainingNumberSet, flopArr);

        flopArr = flopArr.map(flopNum => backConvertor[flopNum]);
        flopArr = flopArr.map(flopCard => flopCard.concat(suits[Math.floor(Math.random() * suits.length)]));
        console.log("Hole cards: " + hole1 + " " + hole2);
        console.log("Flop set: " + flopArr);
        console.log("Outs: 4");
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

flopGen.generateInsideStraight('6c', '7d');
console.log("----")
flopGen.generateInsideStraight('Kc', '10d');
console.log("----")
flopGen.generateInsideStraight('7c', '10d');
console.log("----")
flopGen.generateInsideStraight('Ac', '10d');
console.log("----")
flopGen.generateInsideStraight('4c', 'Ad');
console.log("----")
flopGen.generateInsideStraight('Ac', 'Qd');
console.log("----")
flopGen.generateInsideStraight('Ac', 'Kd');
console.log("----")
flopGen.generateInsideStraight('Kc', 'Jd');
console.log("----")
flopGen.generateInsideStraight('Ac', '10d');
console.log("----")
flopGen.generateInsideStraight('Qc', '10d');
console.log("----")
flopGen.generateInsideStraight('5s', '6d');
console.log("----")
flopGen.generateInsideStraight('8c', '5d');


