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

function detectFlushDraw(flopAndHoleCardArr) {
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
