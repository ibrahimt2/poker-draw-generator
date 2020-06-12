function populateLeftBranchArr(hole1Converted, hole2Converted, leftBranchArr) {
    for(let i = hole1Converted - 1, j = 0; j < 4 - (hole2Converted - hole1Converted); j++, i--) {
      if(i > 0) {
        leftBranchArr.push(i);
      }

      console.log("i: " + i + " j:" + j);
    } 

    console.log(leftBranchArr);
}

function populateRightBranchArr(hole1Converted, hole2Converted, rightBranchArr) {
    for(let i = hole2Converted + 1, j = 0; j < 4 - (hole2Converted - hole1Converted); j++, i++) {
      if(i < 14) {
        rightBranchArr.push(i);
        console.log("i: " + i + " j:" + j);
      }
    }
    console.log(rightBranchArr);
  }

let rightBranchArr = [];
let leftBranchArr = [];



populateLeftBranchArr(4, 6, leftBranchArr);
populateRightBranchArr(4, 6, rightBranchArr);



buildOpenFlopArr(hole1Converted, hole2Converted, flopinternalArr, rightBranchArr, leftBranchArr) {

  if(hole2Converted - hole1Converted == 3) {
    console.log("Cards seperation: 2")
    //Inserts element from internalArr into flopArr
    this.moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );

    //Inserts element from internalArr into flopArr
    this.moveElement(
      Math.floor(Math.random() * internalArr.length),
      internalArr,
      flopArr
    );

  //Enter this if hole cards seperated by 1 card
  } else if (hole2Converted - hole1Converted == 2) {

  //Inserts element from internalArr into flopArr
  this.moveElement(
    Math.floor(Math.random() * internalArr.length),
    internalArr,
    flopArr
  );

  //Randomly insert an element adjacent to hole card from either leftBranch or rightBranch
  if(Math.random() < 0.5 && leftBranchArr.length != 0) {
    flopArr.push(leftBranchArr[0])
  } else if (rightBranchArr != 0) {
    flopArr.push(rightBranchArr[0]);
  } else {
    //Ensures something gets added if rightBranch is empty
    flopArr.push(leftBranchArr[0])
  }

  } else if (hole2Converted - hole1Converted == 1) {
    if(Math.random() < 0.5 && leftBranchArr.length != 0) {
      flopArr.push(leftBranchArr[0]);
      if(Math.random() < 0.5 && leftBranchArr.length > 1) {
        flopArr.push(leftBranchArr[1]);
      } else if (rightBranchArr.length != 0) {
        flopArr.push(rightBranchArr[0]);
      } else {
        flopArr.push(leftBranchArr[1]);
      }
    } else if (rightBranchArr.length != 0) {
      flopArr.push(rightBranchArr[0]);
      if(Math.random() < 0.5 && rightBranchArr.length > 1) {
        flopArr.push(rightBranchArr[1]);
      } else if (leftBranchArr.length != 0) {
        flopArr.push(leftBranchArr[0]);
      } else {
        flopArr.push(rightBranchArr[1]);
      }
    } else {
      flopArr.push(leftBranchArr[0]);
      if(Math.random() < 0.5 && leftBranchArr.length > 1) {
        flopArr.push(leftBranchArr[1]);
      } else if (rightBranchArr.length != 0) {
        flopArr.push(rightBranchArr[0]);
      } else {
        flopArr.push(leftBranchArr[1]);
      }
    }
  }
    
  
  }
}