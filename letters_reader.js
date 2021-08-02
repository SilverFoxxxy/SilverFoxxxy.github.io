// TODO: dark-theme

// function setCookie(name,value,days) {
//     var expires = "";
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days*24*60*60*1000));
//         expires = "; expires=" + date.toUTCString();
//     }
//     document.cookie = name + "=" + (value || "")  + expires + "; path=/";
// }
// function getCookie(name) {
//     var nameEQ = name + "=";
//     var ca = document.cookie.split(';');
//     for(var i=0;i < ca.length;i++) {
//         var c = ca[i];
//         while (c.charAt(0)==' ') c = c.substring(1,c.length);
//         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
//     }
//     return null;
// }

var urlParams = new URLSearchParams(window.location.search);
// console.log(window.location.search);

var name = urlParams.get('name');

var part_n = urlParams.get('part');

// if (part_n == null) {
// 	console.log("default - null");
// }

var page_n = urlParams.get('page');

var ispartloaded = -1;

// const fs = require('fs');

// fs.readFile('./letters_example.json', 'utf8', (err, jsonString) => {
//   if (err) {
//     console.log("File read failed:", err)
//     return 
//   }
//   console.log('File data:', jsonString)
// })

var data;
data = $.getJSON("letters_example.json", function() {
 console.log( "success" );
});

console.log(JSON.stringify(data));

// $.ajax({
//   url: "http://cors.io/?https://github.com/SilverFoxxxy/SilverFoxxxy.github.io/letters_example.json",
//   dataType: "json",
//   success: function(response) {
//     $.each(response.Users, function(item) {
//       informationArray.push(item);
//     });
//     informationArray.push("success");
//   }
// });

// function load() {
// 	if (name != null && part_n != null && page_n != null) {
// 		if (ispartloaded == part_n) { // warning
// 			return;
// 		} else {}
// 	}
// }

