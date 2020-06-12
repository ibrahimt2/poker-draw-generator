buildOpenFlopArr(hole1Converted, hole2Converted, internalArr, flopArr, leftBranchIsUncut, rightBranchIsUncut) {

    console.log("Building open flop arr...")
    let isCutIntoInsideStraight = false;

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

      //Detects if the branch limitations will cut the open straight into an inside straight
      if (!leftBranchIsUncut || !rightBranchIsUncut) {
        isCutIntoInsideStraight = true;
        console.log("Both branches uncut, simple open straight")
      }

    //Enter this if hole cards seperated by 1 card
    } else if (hole2Converted - hole1Converted == 2) {
      console.log("Cards seperation: 1")
      //Insert element from internalArr into flopArr
      this.moveElement(
        Math.floor(Math.random() * internalArr.length),
        internalArr,
        flopArr
      );

      //Randomly decides between selected card adjacent to either hole card
      if(leftBranchIsUncut && rightBranchIsUncut) {
        console.log("Both branches uncut, simple open straight")
        if(Math.random() < 0.5) {
          flopArr.push(hole1Converted - 1);
        } else {
          flopArr.push(hole2Converted + 1)
        }
      //Enters this else-if is left branch is uncut
      } else if (!leftBranchIsUncut) {
        console.log("Left branch not uncut...")
        if(hole1Converted - 1 > 0) {
          console.log("hole1Converted - 1 > 0")
          if(Math.random() < 0.5) {
            flopArr.push(hole1Converted - 1);
            //Remembers this configuration is an inside straight
            console.log("hole1Converted - 1 > 0, Inside Straight!")
            isCutIntoInsideStraight = true;
          } else {
            console.log("hole1Converted - 1 > 0, Open Straight!")
            flopArr.push(hole2Converted + 1)
          }
        } else {
          console.log("hole1Converted - 1 < 0")
          flopArr.push(hole2Converted + 1)
        }
      } else if (!rightBranchIsUncut) {
        console.log("Right branch not uncut...")
        if(hole2Converted + 1 < 14) {
          console.log("hole2Converted + 1 < 14")
          if(Math.random() < 0.5) {
            flopArr.push(hole1Converted - 1);
          } else {
            flopArr.push(hole2Converted + 1)
            //Remembers this configuration is an inside straight
            isCutIntoInsideStraight = true;
          }
        } else {
          console.log("hole2Converted + 1 > 14")
          flopArr.push(hole1Converted - 1)
        }

      }
    //Enter this if hole cards seperated by 0 cards
    } else if (hole2Converted - hole1Converted == 1) {

      console.log("Cards seperation: 0")

      if(rightBranchIsUncut && leftBranchIsUncut) {
        console.log("Both branches uncut, simple open straight")
        if(Math.random() < 0.5) {
          flopArr.push(hole1Converted - 1);
          flopArr.push(hole1Converted - 2);
        } else {
          flopArr.push(hole2Converted + 1);
          flopArr.push(hole2Converted + 2);
        }
      } else if (!leftBranchIsUncut) {
        console.log("Left branch not uncut...")
        if(hole2Converted - 2 > 0) {
          console.log("hole2Converted - 2 > 0")
          if(Math.random() < 0.5) {
            console.log("hole1Converted - 2 > 0, Inside Straight!")
            flopArr.push(hole1Converted - 1);
            flopArr.push(hole1Converted - 2);
            isCutIntoInsideStraight = true;
          } else {
            console.log("hole1Converted - 2 > 0, Open Straight!")
            flopArr.push(hole2Converted + 1);
            flopArr.push(hole2Converted + 2);
          }
        } else {
          console.log("hole1Converted - 2 < 0, Open Straight!")
          flopArr.push(hole2Converted + 1);
          flopArr.push(hole2Converted + 2);
        }
      } else if (!rightBranchIsUncut) {
        console.log("Right branch not uncut...")
        if(hole1Converted + 2 < 14) {
          console.log("hole1Converted - 2 > 0")
          if(Math.random() < 0.5) {
            console.log("hole1Converted + 2 < 14, Open Straight!")
            flopArr.push(hole1Converted - 1);
            flopArr.push(hole1Converted - 2);
          } else {
            console.log("hole1Converted + 2 < 14, Inside Straight!")
            flopArr.push(hole2Converted + 1);
            flopArr.push(hole2Converted + 2);
            isCutIntoInsideStraight = true;
          }
        } else {
          console.log("hole1Converted + 2 > 14")
          flopArr.push(hole1Converted - 1);
          flopArr.push(hole1Converted - 2);
        }
      }
    }

    return isCutIntoInsideStraight;
  }