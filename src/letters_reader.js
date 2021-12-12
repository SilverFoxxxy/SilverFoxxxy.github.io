
function GetZoomFactor () {
    var factor = 1;
    if (document.body.getBoundingClientRect) {
            // rect is only in physical pixel size in IE before version 8 
        var rect = document.body.getBoundingClientRect ();
        var physicalW = rect.right - rect.left;
        var logicalW = document.body.offsetWidth;

            // the zoom level is always an integer percent value
        factor = Math.round ((physicalW / logicalW) * 100) / 100;
    }
    return factor;
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/**
 * http://stackoverflow.com/a/10997390/11236
 */
function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

const DEBUG = true;

var urlParams = new URLSearchParams(window.location.search);
// console.log(window.location.search);

var name = urlParams.get('name');

var part_n = urlParams.get('part');

var shownm = false;

// if (part_n == null) {
// 	console.log("default - null");
// }

var data;

var story_fullnm;

var person_side = {};

function get_person_sides() {
	if (data != null) {
		for (a in data['header']['person']) {
			var now_person = data['header']['person'][a];
			// console.log(now_person['name'] + ' ' + now_person['side']);
			person_side[now_person['name']] = now_person['side'];
		}
	}
}

datastr='{"title": "Alice", "parts": [[{"text": "Завидев Алису, Кот только улыбнулся. Вид у него был добродушный, но когти длинные, а зубов так много, что Алиса сразу поняла, что с ним шутки плохи.", "from": 1}, {"text": "Котик! Чешик! ", "from": 2}, {"text": "робко начала Алиса. Она не знала, понравится ли ему это имя, но он только шире улыбнулся в ответ.", "from": 1}, {"text": "Ничего", "from": 2}, {"text": "подумала Алиса, – кажется, доволен. Вслух же она спросила:", "from": 1}, {"text": "Скажите, пожалуйста, куда мне отсюда идти?", "from": 2}, {"text": "А куда ты хочешь попасть?", "from": 3}, {"text": "ответил Кот", "from": 1}, {"text": "Мне все равно…", "from": 2}, {"text": "Тогда все равно, куда и идти", "from": 3}, {"text": "… только бы попасть куда-нибудь", "from": 2}, {"text": "Куда-нибудь ты обязательно попадешь, нужно только достаточно долго идти", "from": 3}, {"text": "С этим нельзя было не согласиться. Алиса решила переменить тему.", "from": 1}], [{"text": "А что здесь за люди живут?", "from": 2}, {"text": "Вон там живет Болванщик. А там Мартовский заяц. Все равно, к кому ты пойдешь. Оба не в своем уме", "from": 3}, {"text": "На что мне безумцы?", "from": 2}, {"text": "Ничего не поделаешь, все мы здесь не в своем уме – и ты, и я", "from": 3}]]}';

var page_n = urlParams.get('page');
var max_page = 1;

var ispartloaded = -1;
var lastname = -1;

var title = null;

var EDIT_MODE = false;
var edit_msg_num = -1;

var textes;

// window.fontsz_coef = [0.6, 0.75, 1, 1.3, 1.7];
window.fontsz_a = [
    ["2.5vw", "3vw", "3.4vw", "3.7vw", "4.1vw"],
    ["0.9rem", "1.1rem", "1.25rem", "1.35rem", "1.5rem"]
]
window.font_sz = fontsz_a[window.view_theme];
window.msg_font_n = 2;
document.querySelector(':root').style.setProperty('--msg-fontsz', window.font_sz[window.msg_font_n]);

function parse_txt(txt) {
	var from = txt[0];
	// console.log(from);
	var now_side = person_side[from];
	// console.log(now_side);
	var pref = '';
	var suf = '';
	if (now_side == 'author') {
		pref = '<div class="author_block"><div class="author_msg">';
		suf = '</div></div>';
	}
	if (now_side == 'left') {
		pref = '<div class="left_block"><div class="left_msg">';
		suf = '</div></div>';
	}
	if (now_side == 'right') {
		pref = '<div class="right_block"><div class="right_msg">';
		suf = '</div></div>';
	}
	if (now_side == 'center') {
		// console.log("center_msg");
		pref = '<div class="center_block"><div class="center_msg">';
		suf = '</div></div>';
	}
	// console.log(txt);
	// return (pref + "<pre>" + txt[1] + "</pre>" + suf);
	var nowname = "";
	if (shownm && from != "0") {
		nowname = "<div class='msg_from'>" + from + "</div>";
	}
	// return (pref + nowname + "<pre>" + txt[1] + "</pre>" + suf);
	return (pref + nowname + txt[1] + suf);
}

function parse_page(partjs) {
	// console.log(partjs);
	html = '<table>' + '<tr><td><div class="left_block"><br></div></td></tr>';
	for (txt in partjs) {
		// console.log(txt);
		nowtxt = parse_txt(partjs[txt]);
		// html = html + '<tr><td style="font-size:' + global_fontsz + '">' + nowtxt + '</td></tr>';
		html = html + '<tr><td>' + nowtxt + '</td></tr>';
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
	// console.log(html);
	return html;
}

async function reload_page() {
	// var urlParams = new URLSearchParams(window.location.search);
	// console.log(window.location.search);

	// document.getElementById("title").innerHTML = title;
	EDIT_MODE = false;
	if (ispartloaded == -1 || lastname != name || name == "test" || name == "edit") {
		if (name == "edit") {
			EDIT_MODE = true;
			// data = localStorage.getItem("json_edit__");
			data = JSON.parse(localStorage.getItem('json_edit_ui'));
			get_person_sides();
		}

		if (name == "test") {
			// data = localStorage.getItem("json_edit__");
			data = JSON.parse(localStorage.getItem('json_edit'));
			get_person_sides();
		} else {
		// if (name == null) {
		// 	name = "letters_example";
		// }
			try {
				/// if (DEBUG) {
					//// data = await (await fetch("https://raw.githubusercontent.com/SilverFoxxxy/SilverFoxxxy.github.io/main/src/textes/" + name + ".json")).json();
					// get_person_sides();
					// data = await(JSON.parse(datastr));
				/// } else {
					//// data = await (await fetch("https://raw.githubusercontent.com/SilverFoxxxy/SilverFoxxxy.github.io/main/src/textes/" + name + ".json")).json();
					let now_text_info = await get_text(name);
					if (now_text_info.hasOwnProperty("story_fullnm")) {
						document.getElementById("title_link").href = "letters_page.html?name=" + name; 
						document.getElementById("title").innerHTML = now_text_info["story_fullnm"];
						story_fullnm = now_text_info["story_fullnm"];
					}
					if (now_text_info.hasOwnProperty("story")) {
						data = JSON.parse(now_text_info["story"]);
					} else {
						console.log("failed json");
						document.getElementById("title").innerHTML = "<big>404 Not Found</big>";
						return;
					}
					// url = "https://github.com/SilverFoxxxy/SilverFoxxxy.github.io";
					// name = "letters_example";
					// data = await fetch(url + name + ".json");
				/// }
			}
			catch {
				console.log("failed json");
				document.getElementById("title").innerHTML = "<big>404 Not Found</big>";
				return;
			}
			get_person_sides();
		}
	}

	// if (!("header" in data)) {
	// 	console.log("no header");
	// 	document.getElementById("title").innerHTML = "<big>404 Not Found</big>";
	// 	return;
	// }

	if (data["parts"].length != 0) {
		lastname = name;
		ispartloaded = true;
	}

	var font_n = parseInt(data["header"]["font"]);
	font_n--;
	if (font_n == -1) {
		font_n = 0;
	}

	if (font_n == window.font_sz.length) {
		font_n = window.font_sz.length - 1;
	}

	if (!(font_n >= 0 && font_n < font_sz.length)) {
		font_n = 2;
	}

	if (data["header"]["shownm"] == "true") {
		shownm = true;
	}

	// console.log(font_n);

	window.msg_font_n = font_n;
	document.querySelector(':root').style.setProperty('--msg-fontsz', window.font_sz[window.msg_font_n]);
	// document.getElementById("title").style = ("font-size:" + global_fontsz);
	// document.getElementById("prev_page_button").style = ("font-size:" + global_fontsz);
	// document.getElementById("next_page_button").style = ("font-size:" + global_fontsz);

	name = urlParams.get('name');
	part_n = urlParams.get('part');
	page_n = urlParams.get('page');

	if (!part_n) {
		part_n = 0;
	}

	if (!page_n) {
		page_n = 0;
	}

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

	updParams();

 	title = data["header"]["title"];

	// document.getElementById("title").innerHTML = title;
	// document.getElementById("page_n").innerHTML = (page_n + 1);
	document.getElementById("max_page_n").innerHTML = data["parts"][nowpart]["pages"].length;
	document.getElementById("pages").innerHTML = createPageSelect(page_n, max_page_n);
	// TODO: название главы
	// TODO: тома (несколько глав)
	var nowpage = parse_page(data["parts"][nowpart]["pages"][nowpage]);

	// console.log(nowpage);

	document.getElementById("messages_block").innerHTML = nowpage;

	// TODO: scrollToTop
	// (now is "won't fix" problem for browsers)
	document.body.scrollTop = 0; // For Safari
  	document.documentElement.scrollTop = 0;
  	setTimeout(function() {window.scroll({ top: 0, behavior: 'smooth' });},1);
	window.scrollTo({ top: 0, behavior: 'smooth' });
	// .then(function() {
 //        window.scrollBy({ top: -1000, behavior: 'smooth' });
 //    });
	// window.scrollTo({ top: 0, behavior: 'smooth' });
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

function updParams() {
	urlParams.set('name', name);
	urlParams.set('part', part_n);
	urlParams.set('page', page_n);
	history.replaceState(null, null, window.location.pathname + '?' + urlParams.toString());
	// var currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname + urlParams.toString();
	// window.history.pushState({ path: currentURL }, '', currentURL);
}

function goNextPage() {
	page_n++;
	updParams();
	reload_page();
}

function goPrevPage() {
	page_n--;
	updParams();
	reload_page();
}

// document.getElementById("prev_page_button").onclick = function() {goPrevPage();}

// document.getElementById("next_page_button").onclick = function() {goNextPage();}

// document.getElementById("prev_page_button1").onclick = function() {goPrevPage();}

// document.getElementById("next_page_button1").onclick = function() {goNextPage();}

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
    updParams();
    reload_page();
});

// document.getElementById("color_theme_button").onclick = function()
// {
//   theme_n = 1 - theme_n;
//   console.log(theme_n);
//   if (theme_n == 1 || theme_n == 0) {
//   	setCookie('color_theme', theme_n + 1, 30);
//   }
//   reload_page();
// }

// setCookie("user_email","bobthegreat@gmail.com",30); //set "user_email" cookie, expires in 30 days
// var userEmail=getCookie("user_email");//"bobthegreat@gmail.com"


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


