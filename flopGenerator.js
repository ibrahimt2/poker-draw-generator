class flopGenerator {
    convertor = new Convertor();
    num2card = convertor.num2card;
    card2num = convertor.card2num;

    generateInsideStraight(hole1, hole2) { 
        //Populate sets of internal, external, outermost cards
        let outermostArr;
        let internalArr;
        let externalArr;
        let flopArr;

        //To make calculation of straight easy, first you must convert hole cards from string representation (A,K,Q etc) into numbers 1-13
        //There are 2 schemes for this, one with A as 1 (low card) and the other with A as 13 (high card)

        if (/*Both hole cards less than 5, A will be low card, so choose A as 1 */) {
            //Set mapping that converts hole cards into appropriate numbers
        } else if (/*Both hole cards more than 9, A will be high card, so choose A as 13 */) {
            //Set mapping that converts hole cards into appropriate numbers
        } else {
            //Use A --> 1 mapping
        }

        //Now you have 13 numbers with the appropriate mapping (either A of clubs = 13c or 1c)

        //Remove hole cards from the 13 numbers

        //Now you have 11 numbers, with the numbers of hole cards removed

        //Go through the deck and populate the outermostArr
        //This is the set of cards which are exactly 3 clicks below the highest card, or exactly 3 clicks above the lowest card
        //Make sure you remove this from the original 11 cards
        
        //Go through deck and populate the internalArr
        //This is the set of cards which falls in between the 2 hole cards
        //Make sure you remove this from the original 11 cards

        //Go through deck and populate the externalArr
        //This is set of cards that is less than 3 clicks from below the highest card, or less than 3 clicks above the lowest card 
        //Make sure you remove this from the original 11 cards

        //Now start building the flop array
        if(/* hole cards seperated by 3 clicks */) {
            //Select & remove 1 number from internalArr
            //Select & remove 1 number from internalArr
        } else if (/* hole cards seperated by 2 clicks */) {
            //Select & remove 1 internal card
            //Select & remove 1 external card
        } else if (/* hole cards seperated by 1 clicks */) {
            //Select & remove 1 outermost card
            //If high outermost card is selected, remove cards from externalArr that are lower than hole cards
            //If low outermost card is selected, remove cards from externalArr that are higher than hole cards
            if (/* probability function with probablity of NoOfInternalCards/NoOfInternalCards + NoOfExternalCards of being true*/ ) {
                //Select & remove 1 internal card
            } else {
                //Select & remove 1 external card
            }
        } else if (/* hole cards seperated by 0 clicks */) {
            //Select & remove 1 outermost card, remove remaining cards with with equivalent value
            //If high outermost card is selected, remove cards from externalArr that are lower than hole cards
            //If low outermost card is selected, remove cards from externalArr that are higher than hole cards
            //Select & remove 1 external card, remove remaining cards with with equivalent value
            //Select & remove 1 external card, remove remaining cards with with equivalent value
        }

        //Now, randomise flopArray order
        //Convert numbers back into facecards (13 --> A or 1 --> A)
        //Give facecards suit values from [h, s, d, c]
        //Present flopArray
    }
}