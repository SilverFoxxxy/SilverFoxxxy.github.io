VPN_URL = "https://belkovanya.site/atcoder/users/"

var x1 = 0;
var x2 = 3900;
var y1 = -1000 + 60;
var y2 = 4130 + 85;

var username = "UserName";

const FAIL = -10000;

// AtCoder grid
var A =       [0,         400,       800,       1200,      1600,      2000,      2400,      2800];
ACcolor =     ["#808080", "#804000", "#008000", "#00C0C0", "#0000FF", "#C0C000", "#FF8000", "#FF0000"];
// CodeForces grid
var B =       [0,         1200,      1400,      1600,      1900,      2100,      2400,      2600,      3000];
var CFcolor = ["#808080", "#0F7F12", "#1BA89E", "#0B24FB", "#A917A8", "#FD8C25", "#FC0D1B", "#FC0D1B", "#FC0D1B", "#000000"];
// var CFcolor = ["#CCCCCC", "#7CFD7E", "#7BDCBB", "#AAACFC", "#FD8CFD", "#FDBA5E", "#FD787A", "#FC363B", "#A8050E"];

function convertAC2CFrating(a) {
  var res = ((x2 * (a - y1)) + (x1 * (y2 - a))) / (y2 - y1);
  return res | 0;
}

function convertCF2ACrating(a) {
  var res = ((y2 * (a - x1)) + (y1 * (x2 - a))) / (x2 - x1);
  return res | 0;
}

async function getACrating(ACname) {
  // return FAIL;
  try {
    // var url = "https://atcoder.jp/users/" + ACname + "?graph=rating";
    // var url = "https://atcoder.jp/";
    // var url = "https://176.119.156.91/vpn/atcoder?user=" + ACname;
    var url = VPN_URL + ACname;
    var html = (await (await fetch(url, {mode: 'cors', credentials: 'omit'})).text());

    if (html == null) {
      return FAIL;
    }

    // console.log(html);

    var pref = "Rating</th><td>";

    var i = html.split(pref)[1];

    // console.log(i);

    var ress = (i.split('>'))[1].split('<')[0];
    var res = parseInt(ress);
    return res;
  }
  catch(err) {
    console.log(err);
    return FAIL;
  }
}

async function getCFrating(CFname) {
  try {
    var url = ("https://codeforces.com/api/user.info?handles=" + CFname);
    // console.log(url);
    var html = (await (await fetch(url)).text());
    if (html == null) {
      return FAIL;
    }
    // console.log(html);
    // console.log(html.split('"rating":')[0]);
    var res = parseInt(html.split('"rating":')[1].split(",")[0]);
    return res;
  }
  catch(err) {
    console.log(err);
    return FAIL;
  }
}

async function getCFrating_bymagic(CFname) {
  try {
    var url = ("https://codeforces.com/api/user.rating?handle=" + CFname);
    // console.log(url);
    var html = (await (await fetch(url)).text());
    if (html == null) {
      return FAIL;
    }
    // console.log(html);
    // console.log(html.split('"rating":')[0]);
    var spl = html.split('"newRating":')
    var res = parseInt(spl[spl.length - 1].split("}")[0]);
    return res;
  }
  catch(err) {
    console.log(err);
    return FAIL;
  }
}

function colorACrating(rating, ACname_id, ACname, ACrating_id) {
  if (rating < 0) {
    document.getElementById(ACname_id).innerHTML = ACname;
    document.getElementById(ACname_id).style.color = "#000000";
    document.getElementById(ACrating_id).innerHTML = rating.toString();
    document.getElementById(ACrating_id).style.color = "#FF0000";
    return;
  }

  var colorind = 0;
  for (var i = 0; i < A.length; i++) {
    if (rating >= A[i]) {
      colorind = i;
    }
  }
  document.getElementById(ACname_id).innerHTML = ACname;
  document.getElementById(ACname_id).style.color = ACcolor[colorind];
  document.getElementById(ACrating_id).innerHTML = rating.toString();
  document.getElementById(ACrating_id).style.color = ACcolor[colorind];
}

function colorCFrating(rating, CFname_id, CFprename_id, CFname, CFrating_id) {
  if (rating < 0) {
    document.getElementById(CFprename_id).innerHTML = "";
    document.getElementById(CFname_id).innerHTML = CFname;
    document.getElementById(CFname_id).style.color = "#000000";
    document.getElementById(CFrating_id).innerHTML = rating.toString();
    document.getElementById(CFrating_id).style.color = "#FC0D1B";
    return;
  }
  var colorind = 0;
  for (var i = 0; i < B.length; i++) {
    if (rating >= B[i]) {
      colorind = i;
    }
  }
  if (colorind == B.length - 1) {
    document.getElementById(CFprename_id).innerHTML = CFname.slice(0, 1);
    document.getElementById(CFprename_id).style.color = CFcolor[colorind + 1];
    document.getElementById(CFname_id).innerHTML = CFname.slice(1, CFname.length);
    document.getElementById(CFname_id).style.color = CFcolor[colorind];
  } else {
    document.getElementById(CFprename_id).innerHTML = "";
    document.getElementById(CFname_id).innerHTML = CFname;
    document.getElementById(CFname_id).style.color = CFcolor[colorind];
  }
  document.getElementById(CFrating_id).innerHTML = rating.toString();
  document.getElementById(CFrating_id).style.color = CFcolor[colorind];
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
  // var txt_ = res.toString() + " - your expected rating on CodeForces";
  // document.getElementById("AC2CFrating").innerHTML = txt_;
  colorACrating(a, "ACname", username, "ACrating");
  document.getElementById("AC->").innerHTML = " -> ";
  colorCFrating(res, "CFname1", "CFprename1",  username, "CFrating1");
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
  colorACrating(res, "ACname1", username, "ACrating1");
  document.getElementById("CF->").innerHTML = " -> ";
  colorCFrating(a, "CFname", "CFprename",  username, "CFrating");
  // var txt_ = res.toString() + " - your expected rating on AtCoder";
  // document.getElementById("CF2ACrating").innerHTML = txt_;
}





var input3 = document.getElementById("ACname_input");

input3.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("ACname2CFbutton").click();
  }
});

document.getElementById("ACname2CFbutton").onclick = function()
{
  var inputVal = document.getElementById("ACname_input").value;
  // document.getElementById("CF->").innerHTML = inputVal;
  var nowname = inputVal;
  (async () => {
  var a = await getACrating(nowname);
  if (a == FAIL) {
    alert("User " + nowname + " not found");
    var s = "Sometimes there are problems<br>with getting info from AtCoder";
    document.getElementById("ACproblem1").innerHTML=s;
    return;
  } else {
    document.getElementById("ACproblem1").innerHTML="";
  }
  var res = convertAC2CFrating(a);
  colorACrating(a, "ACname", nowname, "ACrating");
  document.getElementById("AC->").innerHTML = " -> ";
  colorCFrating(res, "CFname1", "CFprename1",  nowname, "CFrating1");
  })()
}



var input4 = document.getElementById("CFname_input");

input4.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("CFname2ACbutton").click();
  }
});

document.getElementById("CFname2ACbutton").onclick = function()
{
  var inputVal = document.getElementById("CFname_input").value;
  // document.getElementById("CF->").innerHTML = inputVal;
  var nowname = inputVal;
  (async () => {
  var a = await getCFrating(nowname);
  if (a == FAIL) {
    a = await getCFrating_bymagic(nowname);
  }
  if (a == FAIL) {
    alert("User " + nowname + " not found");
    return;
  }
  var res = convertCF2ACrating(a);
  colorACrating(res, "ACname1", nowname, "ACrating1");
  document.getElementById("CF->").innerHTML = " -> ";
  colorCFrating(a, "CFname", "CFprename",  nowname, "CFrating");
  
  })()
  
  // var txt_ = res.toString() + " - your expected rating on AtCoder";
  // document.getElementById("CF2ACrating").innerHTML = txt_;
}












/// test


var urlParams = new URLSearchParams(window.location.search);
// console.log(window.location.search);
var test = urlParams.get('test');

function set_test_true() {
  document.getElementById("testinfo").innerHTML = "test: ok";
  document.getElementById("testinfo").style.color = "grey";
}

function set_test_false() {
  document.getElementById("testinfo").innerHTML = "test: faled";
  document.getElementById("testinfo").style.color = "red";
}

async function checkGetAC() {
  var a = await getACrating("tourist");
  if (a == FAIL) {
    return FAIL;
  }
  return 1;
}

async function checkGetCF() {
  var a = await getCFrating("tourist");
  // console.log("ac:");
  // console.log(a);
  var b = await getCFrating_bymagic("tourist");
  if (a == FAIL || b == FAIL) {
    return FAIL;
  }
  return 1;
}

if (test == 'true') {
  // console.log("test\n");
  (async () => {
    var a = await checkGetAC();
    var b = await checkGetCF();
    // console.log(a);
    // console.log(b);
    if (a != 1 || b != 1) {
      set_test_false();
    } else {
      set_test_true();
    }
  })()
  
  // var c = checkMinus();
}

