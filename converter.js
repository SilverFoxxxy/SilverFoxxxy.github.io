
var x1 = 0;
var x2 = 3900;
var y1 = -1000;
var y2 = 4130

// AtCoder grid
var A =       [0,         400,       800,       1200,      1600,      2000,      2400,      2800,    3500];
ACcolor = ["#808080", "#804000", "#008000", "#00C0C0", "#0000FF", "#C0C000", "#FF8000", "#FF0000"];
// CodeForces grid
var B = [500, 1200, 1400, 1600, 1900, 2100, 2300, 2600, 3000, 3500]
var CFcolor = ["#CCCCCC", "#7CFD7E", "#7BDCBB", "#AAACFC", "#FD8CFD", "#FDBA5E", "#FD787A", "#FC363B", "#A8050E"]

function convertAC2CFrating(a) {
  var res = ((x2 * (a - y1)) + (x1 * (y2 - a))) / (y2 - y1);
  return res | 0;
}

function convertCF2ACrating(a) {
  var res = ((y2 * (a - x1)) + (y1 * (x2 - a))) / (x2 - x1);
  return res | 0;
}



// var AC_CF_Ratings = []
// var CF_AC_Ratings = []
// var fs = require("fs");
// var text = fs.readFileSync("./ratings.txt");
// var textByLine = text.split("\n"); // get pairs
// var n = parseInt(textByLine[0]);

// for (var i = 1; i <= n; i++) {
//   var nowp = textByLine[i].split(" ");
//   AC_CF_Ratings.add([parseInt(nowp[0]), parseInt(nowp[1])]);
// }

// for (var i = n + 1; i <= 2 * n; i++) {
//   var nowp = textByLine[i].split(" ");
//   CF_AC_Ratings.add([parseInt(nowp[0]), parseInt(nowp[1])]);
// }

var input1 = document.getElementById("AC_input");

input1.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("AC2CFbutton").click();
  }
});

document.getElementById("AC2CFbutton").onclick = function()
{
  var inputVal = document.getElementById("AC_input").value;
  var a = parseInt(inputVal);
  var res = convertAC2CFrating(a);
  var txt_ = res.toString() + " - your expected rating on CodeForces";
  document.getElementById("AC2CFrating").innerHTML = txt_;
}

var input2 = document.getElementById("CF_input");

input2.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("CF2ACbutton").click();
  }
});

document.getElementById("CF2ACbutton").onclick = function()
{
  var inputVal = document.getElementById("CF_input").value;
  var a = parseInt(inputVal);
  var res = convertCF2ACrating(a);
  var txt_ = res.toString() + " - your expected rating on AtCoder";
  document.getElementById("CF2ACrating").innerHTML = txt_;
}


