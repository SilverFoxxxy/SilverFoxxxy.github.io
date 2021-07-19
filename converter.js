
function convertAC2CFrating(a) {
  return a + 1;
}

function convertCF2ACrating(a) {
  return a - 1;
}

var input = document.getElementById("AC_input");

input.addEventListener("keyup", function(event) {
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

var input = document.getElementById("CF_input");

input.addEventListener("keyup", function(event) {
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
