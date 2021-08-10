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

const DEBUG = true;

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

const font_sz = ["0.75rem", "1rem", "1.25rem", "1.5rem", "2rem"];
var global_fontsz = "1rem";

function parse_txt(txt) {
	var from = txt[0];
	var pref = '';
	var suf = '';
	if (from == '0' || from == 'автор'  || from == 'author') {
		pref = '<div class="center_block"><div class="center_msg">';
		suf = '</div></div>';
	}
	if (from == 1) {
		pref = '<div class="left_block"><div class="left_msg">';
		suf = '</div></div>';
	}
	if (from == 2) {
		pref = '<div class="right_block"><div class="right_msg">';
		suf = '</div></div>';
	}
	console.log(txt);
	return (pref + txt[1] + suf);
}

function parse_page(partjs) {
	console.log(partjs);
	html = '<table>';
	for (txt in partjs) {
		console.log(txt);
		nowtxt = parse_txt(partjs[txt]);
		html = html + '<tr><td style="font-size:' + global_fontsz + '">' + nowtxt + '</td></tr>';
		html += '<tr><td><div class="left_block"><br></div></td></tr>';
	}
	html = html + '</table>';
	return html;
}

function createPageSelect(page_, max_page_) {
	html = "";
	for (var i = 0; i < max_page_; i++) {
		// <option value="1" selected>Saab</option>
		html += '<option';// value="' + (i + 1) + '"';
		if (i == page_) {
			html += ' selected';
		}
		html +=  '>' + (i + 1) + '</option>';
	}
	console.log(html);
	return html;
}

async function reload_page() {
	// document.getElementById("title").innerHTML = title;
	if (ispartloaded == -1) {
		// if (name == null) {
		// 	name = "letters_example";
		// }
		if (DEBUG) {
			data = await (await fetch("https://raw.githubusercontent.com/SilverFoxxxy/SilverFoxxxy.github.io/main/src/textes/" + name + ".json")).json();
			// data = await(JSON.parse(datastr));
		} else {
			data = await (await fetch("https://raw.githubusercontent.com/SilverFoxxxy/SilverFoxxxy.github.io/main/src/textes/" + name + ".json")).json();
			// url = "https://github.com/SilverFoxxxy/SilverFoxxxy.github.io";
			// name = "letters_example";
			// data = await fetch(url + name + ".json");
		}
	}
	var font_n = parseInt(data["header"]["font"]);
	font_n--;
	if (font_n == -1) {
		font_n = 0;
	}
	if (font_n == font_sz.length) {
		font_n = font_sz.length - 1;
	}
	if (!(font_n >= 0 && font_n < font_sz.length)) {
		font_n = 2;
	}
	
	console.log(font_n);
	
	global_fontsz = font_sz[font_n];
	document.getElementById("title").style = ("font-size:" + global_fontsz);
	// document.getElementById("prev_page_button").style = ("font-size:" + global_fontsz);
	// document.getElementById("next_page_button").style = ("font-size:" + global_fontsz);

	nowpart = part_n;
	nowpage = page_n;
	if (nowpart == null || nowpart < 0) {
		nowpart = 0;
		part_n = 0;
	}
	if (nowpart >= data["parts"].length) {
		nowpart = data["parts"].length - 1;
		part_n = data["parts"].length - 1;
	}
	if (!(nowpart >= 0 && nowpart < data["parts"].length)) {
		nowpart = 0;
		part_n = 0;
	}
	if (nowpage == null || nowpage < 0) {
		nowpage = 0;
		page_n = 0;
	}
	var max_page_n = data["parts"][nowpart]["pages"].length;
	if (nowpage >= max_page_n) {
		nowpage = max_page_n - 1;
		page_n = max_page_n - 1;
	}

	if (!(nowpage >= 0 && nowpage < max_page_n)) {
		nowpage = 0;
		page_n = 0;
	}
 	title = data["header"]["title"];
	document.getElementById("title").innerHTML = title;
	// document.getElementById("page_n").innerHTML = (page_n + 1);
	document.getElementById("max_page_n").innerHTML = data["parts"][nowpart]["pages"].length;
	document.getElementById("pages").innerHTML = createPageSelect(page_n, max_page_n);
	// TODO: название главы
	// TODO: тома (несколько глав)
	var nowpage = parse_page(data["parts"][nowpart]["pages"][nowpage]);

	// console.log(nowpage);

	document.getElementById("messages_block").innerHTML = nowpage;

	window.scrollTo(0, 0);
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

document.getElementById("prev_page_button1").onclick = function()
{
  page_n--;
  reload_page();
}

document.getElementById("next_page_button1").onclick = function()
{
  page_n++;
  reload_page();
}

var activities = document.getElementById("pages");

// activities.addEventListener("click", function() {
//     var options = activities.querySelectorAll("option");
//     var count = options.length;
//     if(typeof(count) === "undefined" || count < 2)
//     {
//         addActivityItem();
//     }
// });

activities.addEventListener("change", function() {
    page_n = parseInt(activities.value) - 1;
    reload_page();
});

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

