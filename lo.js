let hole1ZonesArr = [[1,2], [4,5], [9], [10,11]];

    //Filters out zone arrays who's elements were already removed by the round of removals on hole1ZoneArrays
    hole1ZonesArr = hole1ZonesArr.filter(zoneArray => {
        return zoneArray.length > 1
    });

    console.log(hole1ZonesArr);