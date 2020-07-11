# poker-draw-generator
Poker Draw Generator is a Javascript library that allows you to randomly generate variations of specific types of [poker draws](https://en.wikipedia.org/wiki/Draw_(poker)).  

## Description

The algorithms are designed to allow the greatest variation possible whilst limiting generated hands to specific types of draws or there variations. This is to mimic the great number of variations observed in real poker games.

[A brief description of the theory behind the most mathematically interesting of these algorithms](https://drive.google.com/file/d/10G1ZALTM9XKD2JFWhi0d2VVbKApme3-k/view?usp=sharing)

Currently, the following scenarios can be generated

1. One Pair To Two Pair Or Trips
2. Two Pair To Fullhouse
3. Open Straight Draw Variations 
	 * Regular, No overcards
	 * Regular, 1 overcard
	 * Regular, 2 overcards
	 * Flush, No overcards
	 * Flush, 1 overcard
	 * Flush, 2 overcards
4. Inside Straight Draw Variations
	 * Regular, No overcards
	 * Regular, 1 overcard
	 * Regular, 2 overcards
	 * Regular, 1 overcard
	 * Regular, 2 overcards
	 * Flush, No overcards
	 * Flush, 1 overcard
	 * Flush, 2 overcards
5. Double Gutshot Straight Draw Variations
	 * Regular, No overcards
	 * Regular, 1 overcard
	 * Regular, 2 overcards
	 * Flush, No overcards
	 * Flush, 1 overcard
	 * Flush, 2 overcards
6. Flush Draw Variations
	 * No overcards
	 * 1 overcard
	 * 2 overcards
7. Pocket Pair To Trips
8. Two Overcards To Overpair
9. One Overcard To Overpair
10. No pair to pair
11. Trips To Fullhouse Or Quads

## Installation
Install the package by typing the following into your CLI

```
npm install poker-draw-generator
```

## Usage
There are 8 generate methods, each taking 2 string inputs, [card rank][card suit], with possible cards ranks of A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2 and possible card suits of a, d, c, s.

```
1. generateOnePairToTwoPairOrTrips(hole1, hole2)
```
```
2. generateTwoPairToFullhouse(hole1, hole2)
```
```
3. generateOpenStraightDraw(hole1, hole2) 
```
Generates open straight draws variations, including open straight draws at the corners of the card rank line, which are 	technically considered inside straight draws. hole1 and hole2 must be within 3 cards of each other.
```
4. generateInsideStraightDraw(hole1, hole2)
```
Generates inside straight draw variations, and occasionally double gutshot draws and open straight draws. hole1 and hole2 must be within 3 cards of each other.

```
5. generateFlushDraw(hole1, hole2)
```
```
6. generateNoHitsDraw(hole1, hole2)
```
Generates no hits of any kind on the flop. Generates pocket pair to trips, two overcards to overpair, one overcard to overpair and no pair to pair. 
```
7. generateTripsToFullhouse(hole1, hole2)
```
```
8. generateFlopScenario(insideStraightFreq, openStraightFreq, flushDrawFreq, noHitsFreq, tripsToFullhouseOrQuadsFreq, twoPairToFullhouseFreq, onePairToTwoPairOrTripsFreq)
	
```
Randomly runs one of the given 7 algorithms, with probability depending on the frequencies provided. 

Each generate method returns an object with the following format

```
{
  outCards: [ '8s', '8h' ],
  outs: 2,
  holeCards: [ '8c', '8d' ],
  flopCards: [ '3h', '3s', 'Kh' ],
  name: 'Pocket pair to trips'
}
```
The outs property is redundant and inaccurate. Instead use outCards.length. With time, the returned object will be modified to remove it.

## Sample Usage

```
let draw = generateFlushDraw('As', '4d')
console.log(draw)
```

CONSOLE
```
{
  outCards: [
    'Ad',  '2d', '3d',
    '5d',  '7d', '8d',
    '10d', 'Qd', 'Kd',
    '4s',  '4h', '4c'
  ],
  outs: 12,
  holeCards: [ 'As', '4d' ],
  flopCards: [ '6d', '9d', 'Jd' ],
  name: 'Flush Draw & One Overcards'
}
```




## License 
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) with an option to pay for a commercial license.



