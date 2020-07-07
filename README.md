# poker-draw-generator
Poker Draw Generator is a Javascript library that allows you to randomly generate variations of specific types of [poker draws](https://en.wikipedia.org/wiki/Draw_(poker)).  

## Description

The algorithms are designed to allow the greatest variation possible whilst limiting generated hands to specific types of draws or there variations. This is to mimic the great number of variation observed in real poker games.

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
	 * Flush, No overcards
	 * Flush, 1 overcard
	 * Flush, 2 overcards
5. Flush Draw Variations
	 * No overcards
	 * 1 overcard
	 * 2 overcards
6. Pocket Pair To Trips
7. Two Overcards To Overpair
8. One Overcard To Overpair
9. No pair to pair

## Installation
poker-draw-generator has yet to be published as an npm package, stay tuned for updates

## Usage

Each 'generate' method generates a draw and returns an object containing information about the generated draw in the format given below.

```
{
  outCards: [ '8s', '8h' ],
  outs: 2,
  holeCards: [ '8c', '8d' ],
  flopCards: [ '3h', '3s', 'Kh' ],
  name: 'Pocket pair to trips'
}
```


## License 
[CC BY-NC-SA 2.0](https://creativecommons.org/licenses/by-nc-sa/2.0) with an option to pay for a commercial license.



