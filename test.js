var compactObject = function (obj) {
  let finalObj = null;

  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    finalObj = {};

    for (let ele in obj) {
      let result = compactObject(obj[ele]);
      if (result) {
        finalObj[ele] = result;
      }
    }
    return finalObj
  } else if(Array.isArray(obj)){
    finalObj = [];
    for (let ele of obj) {
      console.log("ele in array ", ele);

      let result = compactObject(ele);
      if (result) {
        finalObj.push(result);
      }
    }
    return finalObj
  }else {
    return Boolean(obj)?obj:false;
  }


  console.log(finalObj);
};

function recursion(ele, finalObj) {


  
  
  
  if (typeof ele === "object" && ele !== null && !Array.isArray(ele)) {
    let tempObj = {};
    for (let item in ele) {
      // a, b
      let result = recursion(ele[item], finalObj);


      if (result) {
        // [1]
        if (item in tempObj) tempObj[item].push(result);
        else tempObj[item] = result;
      }
    }
    return tempObj;
  } else if (Array.isArray(ele)) {
    // check if array
    let tempArr = [];
    for (let item of ele) {
      // false, 1
      let result = recursion(item, finalObj);

      console.log('result ?????', result, 'item IS >>>>', item);
      
      if (result) {
        tempArr.push(result);
      }
    }
    return tempArr;
  } else {
    return Boolean(ele)?ele:false;
  }
}

// case 1 - [null, 0, false, 1]
// case 2 - {"a": null, "b": [false, 1]}

// case 3 - [null, 0, 5, [0], [false, 16]]

let res = compactObject([0,1,0,[[[null, 0], false], false], false]);


console.log(res);
