let Convertor = require('./convertor');

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

function isFlushDraw(flopAndHoleCardArr) {
  let suitArray = [];
  var count = {};
  let isFlushDraw = false;

  //Extracts just the suit values from each card
  flopAndHoleCardArr.forEach((card) => {
    suitArray.push(card[card.length - 1]);
  });

  //console.log(suitArray)

  suitArray.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  //console.log(count);

  //Decides if the cards are a flush draw
  if (
    count["d"] >= 4 ||
    count["h"] >= 4 ||
    count["s"] >= 4 ||
    count["c"] >= 4
  ) {
    isFlushDraw = true;
    //console.log("set flush draw to true")
  }

  return isFlushDraw;
}

function isFlush(flopAndHoleCardArr) {
  let suitArray = [];
  var count = {};
  let isFlush = false;

  //Extracts just the suit values from each card
  flopAndHoleCardArr.forEach((card) => {
    suitArray.push(card[card.length - 1]);
  });

  //console.log(suitArray)

  suitArray.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  //console.log(count);

  //Decides if the cards are a flush draw
  if (
    count["d"] >= 5 ||
    count["h"] >= 5 ||
    count["s"] >= 5 ||
    count["c"] >= 5
  ) {
    isFlush = true;
    //console.log("set flush draw to true")
  }

  return isFlush;
}

function hasDuplicates(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
    var value = array[i];
    if (value in valuesSoFar) {
      return true;
    }
    valuesSoFar[value] = true;
  }
  return false;
}

/**
 * Summary.
 * Takes an array of cards and returns
 * an array of suits that are not present
 * within the cards of this array
 * 
 * @param {*} cardArray 
 */

function getSuitsNotInCardArray(cardArray) {
  let suits = ['h', 's', 'c', 'd'];
  let inputCardSuitsArr = [];
  //console.log(cardArray)
  
  cardArray.forEach(card => {
    //console.log(card);
    inputCardSuitsArr.push(card.charAt(card.length - 1));
    //console.log(inputCardSuitsArr)
  })

  suits = suits.filter(cardSuit => {
    return !inputCardSuitsArr.includes(cardSuit);
  })

  //console.log(suits);
  return suits
}

/**
 * Summary.
 * Takes an array of cards and a suit,
 * and returns the cards of given suit
 * not included in the input card array
 * 
 * @param {} suit 
 * @param {*} inputCardArr 
 */

function getRemainingCardsOfSameSuit(suit, inputCardArr) {
  let cardsOfGivenSuit = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let remainingCardsOfSameSuit = []

  cardsOfGivenSuit = Array.from(cardsOfGivenSuit, card => (card + suit))
  console.log(cardsOfGivenSuit);

  remainingCardsOfSameSuit = cardsOfGivenSuit.filter(card => {
    return !inputCardArr.includes(card);
  })

  return remainingCardsOfSameSuit;
}

function getFlushDrawSuit(flopAndHoleCardArr) {
  let suitArray = [];
  var count = {};

  //Extracts just the suit values from each card
  flopAndHoleCardArr.forEach((card) => {
    suitArray.push(card[card.length - 1]);
  });

  //console.log(suitArray)

  suitArray.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  //console.log(count);

  //Decides if the cards are a flush draw
  if (count["d"] >= 4) {
    return "d"
  } else if (count["s"] >= 4) {
    return "s"
  } else if (count["c"] >= 4) {
    return "c"
  } else if (count["h"] >= 4) {
    return "h"
  }
}

/**
 * Sumamry.
 * Takes a card value and an array of
 * cards and returns the other cards left 
 * in the deck of the same value which are
 * not included in the input array
 * 
 * @param {} cardValue 
 * @param {*} inputCardArr 
 */

function getRemainingCardsOfSameValue(cardValue, inputCardArr) {

  //Takes care of stripping out suit value if entered, but works 
  //with just value aswell

  if(cardValue.length === 3) {
    //'10d' or similar
    //console.log(cardValue + 'before3')
    cardValue = cardValue.charAt(0) + cardValue.charAt(1);
    //console.log(cardValue + 'after')
  } else if(cardValue.length === 2 && cardValue !== '10') {
    //'2c' or similar
    //console.log(cardValue + 'before2')
    cardValue = cardValue.charAt(0)
    //console.log(cardValue + 'after')
  }


  let cardsOfSameValueArr = [cardValue + 's', cardValue + 'd',cardValue + 'h',cardValue + 'c'];
  let remainingCardsOfSameValue = []

  remainingCardsOfSameValue = cardsOfSameValueArr.filter(card => {
    return !inputCardArr.includes(card);
  })

  //console.log(remainingCardsOfSameValue);
  return remainingCardsOfSameValue;
}

function removeDuplicates(inputArr) {
  let unique = {};
  inputArr.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
}

function moveElement(index, fromArray, toArray) {
  toArray.push(fromArray[index]);
  fromArray.splice(index, 1);
}

module.exports = {
  moveElement: moveElement,
  isFlushDraw: isFlushDraw,
  removeDuplicates: removeDuplicates,
  decideConversionScheme: decideConversionScheme,
  isFlush: isFlush,
  hasDuplicates: hasDuplicates,
  getRemainingCardsOfSameSuit: getRemainingCardsOfSameSuit,
  getRemainingCardsOfSameValue: getRemainingCardsOfSameValue,
  getFlushDrawSuit: getFlushDrawSuit
};


//getSuitsNotInCardArray(['Ac', '6c', '6d']);
//getRemainingCardsOfSameSuit('c',['Ac', '3c', '4c', '5d']);
// getRemainingCardsOfSameValue('A', ['Ac', 'Ad', '2c', '5c']);
// getRemainingCardsOfSameValue('Ad', ['Ac', 'Ad', '2c', '5c']);
// getRemainingCardsOfSameValue('10c', ['10d', 'Ad', '2c', '5c']);
// getRemainingCardsOfSameValue('10', ['10c', 'Ac', 'Ad', '2c', '5c']);
// 
// console.log(getFlushDrawSuit(['Ah', '3h', '5h', '6c', '2h']));