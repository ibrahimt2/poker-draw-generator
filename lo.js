depopulateAvailableNumArrUsingZoneArr(holeZonesArr, availableNumberArr) {
    while (holeZonesArr.length > 1) {
        let pickedZoneArr = holeZonesArr.splice(
          Math.floor(Math.random() * holeZonesArr.length),
          1
        ); //Apparently this returned a double nested array instead of a single array, hence the 0 below being necessary
        let pickedZoneArrNum =
          pickedZoneArr[0][
            Math.floor(Math.random() * pickedZoneArr.length)
          ]; //The necessity of the 0 here is quite interesting
        availableNumberArr.splice(
          availableNumberArr.indexOf(pickedZoneArrNum),
          1
        );
      }
}