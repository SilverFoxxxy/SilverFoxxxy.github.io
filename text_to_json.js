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

// filename = "skazhesh_mne"
// f = open("textes/" + filename + ".txt", "r")
var text = "EXAMPLE!";// f.read()
// print(text)

// TODO: persons = {} instead of []

var h_keywords = [
    [1, ["header", "легенда"]],
    [2,   ["font", "шрифт"]],
    [2,   ["title", "название"]],
    [2,   ["description", "описание"]],
    [2,   ["shownm"]],
    [2,   ["person", "персонаж"]],
    [3,     ["name", "имя"]],
    [3,     ["color", "цвет"]],
    [3,     ["side", "сторона"]],
    [3,     ["aka", "ака"]]
];

var p_keywords = [
    [1, ["part", "глава"]],
    [2,   ["partname", "название"]],
    [2,   ["page", "страница", "стр"]],
    [2,   ["path"]]
];

// Идея парсера - хранить массив массивов {keyword : priority : text}
// Потом парсить каждый элемент массива по новому ключевому слову
// Вторую часть распасченного text кидать в новые части массива
// Затем распарсить это в json

function parse_header_parts(text) {
    let pref = "part=";
    let ind = text.search(pref, 0, text.length);
    return [text.slice(0, ind), text.slice(ind, -1)];
}

function parse_header(header) {
    let now_header = [];
    for (let i of header) {
        now_header.push(i);
    }
    for (let div_block of h_keywords) {
        let nowdiv = div_block[1][0];
        for (let divstr_ of (div_block[1])) {
            let divstr = divstr_ + '=';
            let new_header = [];
            let nowsplit = '';
            for (let part of now_header) {
                // let part = now_header[part_i];
                let nowsplit = part[2].split(divstr);
                new_header.push([part[0], part[1], nowsplit[0]])
                for (let i = 1; i < nowsplit.length; i++) {
                    new_header.push([nowdiv, div_block[0], nowsplit[i]]);
                }
                now_header = new_header;
            }
        }
    }
    return now_header;
}

function parse_parts(parts) {
    let now_parts = [];
    for (let i of parts) {
        now_parts.push(i);
    }
    for (let i of p_keywords) {
        let div_block = i;
        let nowdiv = div_block[1][0];
        for (let j of (div_block[1])) {
            // divstr_ = (div_block[1])[j];
            let divstr = j + '=';
            let new_parts = [];
            let nowsplit = '';
            for (let part of now_parts) {
                // let part = now_parts[k];
                let nowsplit = part[2].split(divstr);
                new_parts.push([part[0], part[1], nowsplit[0]]);
                for (let i = 1; i < nowsplit.length; i++) {
                    new_parts.push([nowdiv, div_block[0], nowsplit[i]]);
                }
                now_parts = new_parts;
            }
        }
    }
    return now_parts;
}

function clear_str(s) {
    return s.trimLeft(' \n\t').trimRight(' \n\t');//.strip(' \n\t');
}

function clear_array(array) {
    for (let i in array) {
        array[i][2] = clear_str(array[i][2]);
    }
}

let left_side = ['left', 'l', 'л', 'лево', 'слева'];
let right_side = ['right', 'r', 'п', 'право', 'справа'];
let center_side = ['center', 'c', 'ц', 'центр'];

function header2json(header) {
    let h = {};
    h['person'] = [];
    h['person'].push({});
    h['person'][0]['name'] = '0';
    h['person'][0]['side'] = 'author';
    h['person'][0]['aka'] = [];
    h['person'][0]['aka'].push('автор');
    h['person'][0]['aka'].push('author');
    for (let a of header) {
        // let a = header[a_i];
        if (a[0] == 'font') {
            h['font'] = a[2];
        }
        if (a[0] == 'title') {
            h['title'] = a[2];
        }
        if (a[0] == 'description') {
            h['description'] = a[2];
        }
        if (a[0] == 'shownm') {
            h['shownm'] = a[2];
        }
        if (a[0] == 'person') {
            h['person'].push({});
        }
        if (a[0] == 'name') {
            h['person'][h['person'].length-1]['name'] = a[2];
        }
        if (a[0] == 'color') {
            h['person'][h['person'].length-1]['color'] = a[2];
        }
        if (a[0] == 'side') {
            h['person'][h['person'].length-1]['side'] = 'left';
            if (left_side.includes(a[2])) {
                h['person'][h['person'].length-1]['side'] = 'left';
            }
            if (right_side.includes(a[2])) {
                h['person'][h['person'].length-1]['side'] = 'right';
            }
            if (center_side.includes(a[2])) {
                h['person'][h['person'].length-1]['side'] = 'center';
            }
        }
        if (a[0] == 'aka') {
            let aka = a[2].split(',');
            for (let i in aka) {
                aka[i] = clear_str(aka[i]);
            }
            h['person'][h['person'].length-1]['aka'] = aka;
        }
    }
    return h;
}

function parse_page(page, persons) {
    let now_letters = [[0, page]]; // {from : text}
    for (let i of persons) {
        // let i = persons[i_];
        let names = [];
        names.push(i['name']);
        for (let j of i['aka']) {
            // let j = i['aka'][j_];
            names.push(j);
        }
        for (let j_ in names) {
            let nowdiv = names[j_] + '=';
            let new_letters = [];
            for (let l of now_letters) {
                //let l = now_letters[l_];
                let nowsplit = l[1].split(nowdiv);
                new_letters.push([l[0], nowsplit[0]]);
                for (let k = 1; k < nowsplit.length; k++) {
                    new_letters.push([i['name'], nowsplit[k]]);
                }
                now_letters = new_letters;
            }
        }
    }
    for (let i_ in now_letters) {
        let i = now_letters[i_];
        i[1] = clear_str(i[1]);
    }
    return now_letters.slice(1, -1);
}

function parts2json(parts) {
    let p = [];
    for (let a_i in parts) {
        let a = parts[a_i];
        if (a[0] == 'part') {
            p.push({});
            p[p.length-1]['pages'] = [];
        }
        if (a[0] == 'partname') {
            p[p.length-1]['partname'] = a[2];
        }
        if (a[0] == 'path') {
            console.log('not currently developed');
        }
        if (a[0] == 'page') {
            p[p.length-1]['pages'].push(parse_page(a[2], jheader['person']));
        }
    }
    return p;
}

// document.getElementById("text_").value = decodeURIComponent(escape(window.atob(getCookie("text_edit"))));

function parse(text) {
    let both_ = parse_header_parts(text);
    let header = both_[0];
    let parts = both_[1];

    let parsed_header = parse_header([["header", 0,  header]]);
    let parsed_parts = parse_parts([["parts", 0, parts]]);

    clear_array(parsed_header);
    console.log(parsed_header);

    clear_array(parsed_parts);
    console.log(parsed_parts);

    jheader = header2json(parsed_header);

    jparts = parts2json(parsed_parts);

    letters = {};
    letters['header'] = jheader;
    letters['parts'] = jparts;

    var JSONString=JSON.stringify(letters);

    let myString = JSON.stringify(letters, null, '\t');

    document.getElementById("text1").innerHTML = myString;

    console.log(letters);

    // localStorage.setItem("json_edit__", myString);

    setCookie("json_edit", btoa(unescape(encodeURIComponent(myString))), 1000);
    setCookie("text_edit", btoa(unescape(encodeURIComponent(text))), 1000);

}

parse("header=    font= 5title= Скажешь мне..?description= Короткое стихотворение-диалог двух близких людейperson=    name=ааа    side=left    aka=1person=name=bbb    side=right   aka=2part=partname=page=    1= Cкaжeшь мнe 'дa'?        2= Дa.            0= <img src='src/textes/skazhesh_mne/fire_1.jpg' style='max-width: 100%; max-height: 100%;'>            0= <img src='src/textes/skazhesh_mne/fire_2.jpg' style='max-width: 100%; max-height: 100%;'>");

document.getElementById("convert_button").onclick = function()
{
  var texttt = document.getElementById("text_").value;
  // console.log(texttt);
  parse(texttt);
}

