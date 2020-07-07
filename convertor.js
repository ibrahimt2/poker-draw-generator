// An array into which you can input put position numbers of a card 1-52 and get the associated cards
let putPosNumGetCard = [
  "Ac",
  "2c",
  "3c",
  "4c",
  "5c",
  "6c",
  "7c",
  "8c",
  "9c",
  "10c",
  "Jc",
  "Qc",
  "Kc",
  "Ah",
  "2h",
  "3h",
  "4h",
  "5h",
  "6h",
  "7h",
  "8h",
  "9h",
  "10h",
  "Jh",
  "Qh",
  "Kh",
  "As",
  "2s",
  "3s",
  "4s",
  "5s",
  "6s",
  "7s",
  "8s",
  "9s",
  "10s",
  "Js",
  "Qs",
  "Ks",
  "Ad",
  "2d",
  "3d",
  "4d",
  "5d",
  "6d",
  "7d",
  "8d",
  "9d",
  "10d",
  "Jd",
  "Qd",
  "Kd",
];

/*

// An array into which you can input cards and get the associated deck-of-cards HTML5 numbers
export let putStrCardGetHTMLNumber = {
  Ac: "0",
  "2c": "1",
  "3c": "2",
  "4c": "3",
  "5c": "4",
  "6c": "5",
  "7c": "6",
  "8c": "7",
  "9c": "8",
  "10c": "9",
  Jc: "10",
  Qc: "11",
  Kc: "12",
  Ah: "13",
  "2h": "14",
  "3h": "15",
  "4h": "16",
  "5h": "17",
  "6h": "18",
  "7h": "19",
  "8h": "20",
  "9h": "21",
  "10h": "22",
  Jh: "23",
  Qh: "24",
  Kh: "25",
  As: "26",
  "2s": "27",
  "3s": "28",
  "4s": "29",
  "5s": "30",
  "6s": "31",
  "7s": "32",
  "8s": "33",
  "9s": "34",
  "10s": "35",
  Js: "36",
  Qs: "37",
  Ks: "38",
  Ad: "39",
  "2d": "40",
  "3d": "41",
  "4d": "42",
  "5d": "43",
  "6d": "44",
  "7d": "45",
  "8d": "46",
  "9d": "47",
  "10d": "48",
  Jd: "49",
  Qd: "50",
  Kd: "51",
};

// An array into which you can input deck-of-cards HTML5 numbers and get numeric value of cards (A=0, K=12, Q=11, J=10)
export let htmlnum2numval = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

// An array into which you can input card and get purely numeric value of cards (A=0, K=12, Q=11, J=10)
export let card2numval = {
  Ac: "0",
  "2c": "1",
  "3c": "2",
  "4c": "3",
  "5c": "4",
  "6c": "5",
  "7c": "6",
  "8c": "7",
  "9c": "8",
  "10c": "9",
  Jc: "10",
  Qc: "11",
  Kc: "12",
  Ah: "0",
  "2h": "14",
  "3h": "15",
  "4h": "16",
  "5h": "17",
  "6h": "18",
  "7h": "19",
  "8h": "20",
  "9h": "21",
  "10h": "22",
  Jh: "23",
  Qh: "24",
  Kh: "25",
  As: "26",
  "2s": "27",
  "3s": "28",
  "4s": "29",
  "5s": "30",
  "6s": "31",
  "7s": "32",
  "8s": "33",
  "9s": "34",
  "10s": "35",
  Js: "36",
  Qs: "37",
  Ks: "38",
  Ad: "39",
  "2d": "40",
  "3d": "41",
  "4d": "42",
  "5d": "43",
  "6d": "44",
  "7d": "45",
  "8d": "46",
  "9d": "47",
  "10d": "48",
  Jd: "49",
  Qd: "50",
  Kd: "51",
};

export let putStrCardGetNumCard = {
  Ac: "0",
  "2c": "1",
  "3c": "2",
  "4c": "3",
  "5c": "4",
  "6c": "5",
  "7c": "6",
  "8c": "7",
  "9c": "8",
  "10c": "9",
  Jc: "10",
  Qc: "11",
  Kc: "12",
  Ah: "13",
  "2h": "14",
  "3h": "15",
  "4h": "16",
  "5h": "17",
  "6h": "18",
  "7h": "19",
  "8h": "20",
  "9h": "21",
  "10h": "22",
  Jh: "23",
  Qh: "24",
  Kh: "25",
  As: "26",
  "2s": "27",
  "3s": "28",
  "4s": "29",
  "5s": "30",
  "6s": "31",
  "7s": "32",
  "8s": "33",
  "9s": "34",
  "10s": "35",
  Js: "36",
  Qs: "37",
  Ks: "38",
  Ad: "39",
  "2d": "40",
  "3d": "41",
  "4d": "42",
  "5d": "43",
  "6d": "44",
  "7d": "45",
  "8d": "46",
  "9d": "47",
  "10d": "48",
  Jd: "49",
  Qd: "50",
  Kd: "51",
};


*/

let putCardGetNumAceLow = {
  Ac: 1,
  "2c": 2,
  "3c": 3,
  "4c": 4,
  "5c": 5,
  "6c": 6,
  "7c": 7,
  "8c": 8,
  "9c": 9,
  "10c": 10,
  Jc: 11,
  Qc: 12,
  Kc: 13,
  Ah: 1,
  "2h": 2,
  "3h": 3,
  "4h": 4,
  "5h": 5,
  "6h": 6,
  "7h": 7,
  "8h": 8,
  "9h": 9,
  "10h": 10,
  Jh: 11,
  Qh: 12,
  Kh: 13,
  As: 1,
  "2s": 2,
  "3s": 3,
  "4s": 4,
  "5s": 5,
  "6s": 6,
  "7s": 7,
  "8s": 8,
  "9s": 9,
  "10s": 10,
  Js: 11,
  Qs: 12,
  Ks: 13,
  Ad: 1,
  "2d": 2,
  "3d": 3,
  "4d": 4,
  "5d": 5,
  "6d": 6,
  "7d": 7,
  "8d": 8,
  "9d": 9,
  "10d": 10,
  Jd: 11,
  Qd: 12,
  Kd: 13,
};

let putCardGetNumAceHigh = {
  Ac: 13,
  "2c": 1,
  "3c": 2,
  "4c": 3,
  "5c": 4,
  "6c": 5,
  "7c": 6,
  "8c": 7,
  "9c": 8,
  "10c": 9,
  Jc: 10,
  Qc: 11,
  Kc: 12,
  Ah: 13,
  "2h": 1,
  "3h": 2,
  "4h": 3,
  "5h": 4,
  "6h": 5,
  "7h": 6,
  "8h": 7,
  "9h": 8,
  "10h": 9,
  Jh: 10,
  Qh: 11,
  Kh: 12,
  As: 13,
  "2s": 1,
  "3s": 2,
  "4s": 3,
  "5s": 4,
  "6s": 5,
  "7s": 6,
  "8s": 7,
  "9s": 8,
  "10s": 9,
  Js: 10,
  Qs: 11,
  Ks: 12,
  Ad: 13,
  "2d": 1,
  "3d": 2,
  "4d": 3,
  "5d": 4,
  "6d": 5,
  "7d": 6,
  "8d": 7,
  "9d": 8,
  "10d": 9,
  Jd: 10,
  Qd: 11,
  Kd: 12,
};

let putNumGetCardValueAceLow = {
  1: "A",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
};

let putNumGetCardValueAceHigh = {
  13: "A",
  1: "2",
  2: "3",
  3: "4",
  4: "5",
  5: "6",
  6: "7",
  7: "8",
  8: "9",
  9: "10",
  10: "J",
  11: "Q",
  12: "K",
};

module.exports = {
  putCardGetNumAceHigh: putCardGetNumAceHigh,
  putCardGetNumAceLow: putCardGetNumAceLow,
  putNumGetCardValueAceLow: putNumGetCardValueAceLow,
  putNumGetCardValueAceHigh: putNumGetCardValueAceHigh,
  putPosNumGetCard: putPosNumGetCard,
};
