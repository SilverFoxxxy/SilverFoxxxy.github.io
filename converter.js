
var x1 = 0;
var x2 = 3900;
var y1 = -1000;
var y2 = 4130

function convertAC2CFrating(a) {
  var res = ((x2 * (a - y1)) + (x1 * (y2 - a))) / (y2 - y1);
  return res | 0;
}

function convertCF2ACrating(a) {
  var res = ((y2 * (a - x1)) + (y1 * (x2 - a))) / (x2 - x1);
  if (res < 0) {
    return 0;
  }
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
  document.getElementById("AC2CFrating").innerHTML = res.toString();
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
  document.getElementById("CF2ACrating").innerHTML = res.toString();
}


