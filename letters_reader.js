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

const DEBUG = false;

var urlParams = new URLSearchParams(window.location.search);
// console.log(window.location.search);

var name = urlParams.get('name');

var part_n = urlParams.get('part');

// if (part_n == null) {
// 	console.log("default - null");
// }

datastr='{"title": "Alice", "parts": [[{"text": "Завидев Алису, Кот только улыбнулся. Вид у него был добродушный, но когти длинные, а зубов так много, что Алиса сразу поняла, что с ним шутки плохи.", "from": 1}, {"text": "Котик! Чешик! ", "from": 2}, {"text": "робко начала Алиса. Она не знала, понравится ли ему это имя, но он только шире улыбнулся в ответ.", "from": 1}, {"text": "Ничего", "from": 2}, {"text": "подумала Алиса, – кажется, доволен. Вслух же она спросила:", "from": 1}, {"text": "Скажите, пожалуйста, куда мне отсюда идти?", "from": 2}, {"text": "А куда ты хочешь попасть?", "from": 3}, {"text": "ответил Кот", "from": 1}, {"text": "Мне все равно…", "from": 2}, {"text": "Тогда все равно, куда и идти", "from": 3}, {"text": "… только бы попасть куда-нибудь", "from": 2}, {"text": "Куда-нибудь ты обязательно попадешь, нужно только достаточно долго идти", "from": 3}, {"text": "С этим нельзя было не согласиться. Алиса решила переменить тему.", "from": 1}], [{"text": "А что здесь за люди живут?", "from": 2}, {"text": "Вон там живет Болванщик. А там Мартовский заяц. Все равно, к кому ты пойдешь. Оба не в своем уме", "from": 3}, {"text": "На что мне безумцы?", "from": 2}, {"text": "Ничего не поделаешь, все мы здесь не в своем уме – и ты, и я", "from": 3}]]}';

var page_n = urlParams.get('page');
var max_page = 1;

var ispartloaded = -1;

var data;

var title = null;

var textes;

function parse_txt(txt) {
	var from = txt["from"];
	var pref = '';
	var suf = '';
	if (from == 1) {
		pref = '<div class="center_block"><div class="center_msg">';
		suf = '</div></div>';
	}
	if (from == 2) {
		pref = '<div class="left_block"><div class="left_msg">';
		suf = '</div></div>';
	}
	if (from == 3) {
		pref = '<div class="right_block"><div class="right_msg">';
		suf = '</div></div>';
	}
	console.log(txt);
	return (pref + txt["text"] + suf);
}

function parse_page(partjs) {
	console.log(partjs);
	html = '<table>';
	for (txt in partjs) {
		console.log(txt);
		nowtxt = parse_txt(partjs[txt])
		html = html + '<tr><td>' + nowtxt + '</td></tr>';
		html += '<tr><td><div class="left_block"><br></div></td></tr>';
	}
	html = html + '</table>';
	return html;
}

async function reload_page() {
	// document.getElementById("title").innerHTML = title;
	if (ispartloaded == -1) {
		if (DEBUG) {
			data = await(JSON.parse(datastr));
		} else {
			name = "letters_example";
			data = await fetch(name + ".json");
		}
	}
	if (part_n == null) {
		part_n = 0;
	}
	if (page_n == null || page_n < 0) {
		page_n = 0;
	}
	if (page_n >= data["parts"].length) {
		page_n = data["parts"].length - 1;
	}
	title = data["title"];
	document.getElementById("title").innerHTML = title;
	// TODO: название главы
	// TODO: тома (несколько глав)
	var nowpage = parse_page(data["parts"][page_n]);

	// console.log(nowpage);

	document.getElementById("messages_block").innerHTML = nowpage;
	// html = json2page(data);
	// title = json2title(data);
}

// TODO: fetch.await
// data = $.getJSON(name + ".json", function(test) {
// 	console.log( "success" );
//  	data = test;
//  	console.log(JSON.stringify(test));
//  	$.each(data, function (key, val) {
//  		if (key == 'title') {
//  			title = val.data;
//  		}
//  		// items.push('<li id="' + key + '">' + val.data + ' ' + val.type + '</li>');
//  	});
//   	reload_page();
// });

reload_page();

document.getElementById("prev_page_button").onclick = function()
{
  page_n--;
  reload_page();
}

document.getElementById("next_page_button").onclick = function()
{
  page_n++;
  reload_page();
}

// console.log(JSON.stringify(data));

// const fs = require('fs');

// fs.readFile('./letters_example.json', 'utf8', (err, jsonString) => {
//   if (err) {
//     console.log("File read failed:", err)
//     return 
//   }
//   console.log('File data:', jsonString)
// })

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
