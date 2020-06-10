let fiveCards = ['Ad', '10c', '2c', '10c', '5c'];

suitArray = [];

fiveCards.forEach(card => {
    suitArray.push(card[card.length - 1]);
})
    
console.log(suitArray)

var count = {};
suitArray.forEach(function(i) { count[i] = (count[i]||0) + 1;});
console.log(count);