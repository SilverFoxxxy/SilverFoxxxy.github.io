


var person_side = {};

function get_person_sides(data) {
    if (data != null) {
        for (a in data['header']['person']) {
            var now_person = data['header']['person'][a];
            // console.log(now_person['name'] + ' ' + now_person['side']);
            person_side[now_person['name']] = now_person['side'];
        }
    }
}

function jsonTextToColl(txt) {
    let nowtxt = "";
    var from = txt[0];
    if (from == '0') {
        from = 'author';
    }
    // console.log(from);
    // var now_side = person_side[from];
    nowtxt += "<div><u><b>" + from + "</b></u></div>";
    // console.log(now_side);
    // var pref = '';
    // var suf = '';
    // if (now_side == 'author') {
    //     pref = '<div class="author_block"><div class="author_msg">';
    //     suf = '</div></div>';
    // }
    // if (now_side == 'left') {
    //     pref = '<div class="left_block"><div class="left_msg">';
    //     suf = '</div></div>';
    // }
    // if (now_side == 'right') {
    //     pref = '<div class="right_block"><div class="right_msg">';
    //     suf = '</div></div>';
    // }
    // if (now_side == 'center') {
    //     // console.log("center_msg");
    //     pref = '<div class="center_block"><div class="center_msg">';
    //     suf = '</div></div>';
    // }
    // console.log(txt);
    // return (pref + "<pre>" + txt[1] + "</pre>" + suf);
    return (nowtxt + "<div>" + txt[1] + "</div>");
}

function jsonPageToColl(nowpage) {
    // return "some+page";
    // html = '<table>';
    html = '';
    for (txt in nowpage) {
        // console.log(nowpage[txt]);
        nowtxt = jsonTextToColl(nowpage[txt]);
        html = html + '<div>' + nowtxt + '</div>';
        // html = html + '<tr><td>' + nowtxt + '</td></tr>';
        html += '<br>';
        // html += '<tr><td><div class="left_block"><br></div></td></tr>';
    }
    // html = html + '</table>';
    return html;
}

function jsonPartToColl(nowpart) {
    let nowcoll = "";
    for (i in nowpart['pages']) {
        let nowpage = nowpart['pages'][i];
        // console.log(nowpart['pages'][i]);
        nowcoll += "<button type='button' class='collapsible'><span>&#9660</span>"+" Стр_" + String(parseInt(i) + 1) + "</button><div class='content'>";
        nowcoll += jsonPageToColl(nowpage);
        nowcoll += "</div>";
    }
    return nowcoll;
}

function jsonHeadToColl(nowheader) {
    let nowcoll = "";
    nowcoll += "<div><b>Title:</b> " + nowheader['title'] + "</div>";
    nowcoll += "<div><b>Описание:</b> " + nowheader['description'] + "</div>";
    nowcoll += "<div><b>Шрифт(1-5):</b> " + nowheader['font'] + "</div>";
    nowcoll += "<div><u><b>Персонажи:</b></u> " + "</div>";
    let persons = nowheader['person'];
    for (let i = 0; i < persons.length; i++) {
        let nowp = persons[i];
        nowcoll += "<div><b>" + nowp["name"] + ":</b> " + nowp["side"] + "</div>";
    }
    return nowcoll;
}

function jsonToCollapsible(nowjson) {
    // var nowjson = JSON.parse(localStorage.getItem('json_edit'));
    get_person_sides(nowjson);
    let nowcoll = "";
    nowcoll += "<button type='button' class='collapsible'><span>&#9660</span> Основная информация</button><div class='content'>";
    nowcoll += jsonHeadToColl(nowjson['header']);
    nowcoll += "</div>";
    for (i in nowjson['parts']) {
        let nowpart = nowjson['parts'][i];
        // console.log("part2coll");
        // let nowpart = nowjson['parts'][i];
        nowcoll += "<button type='button' class='collapsible'><span>&#9660</span>"+" Глава_" + String(parseInt(i) + 1) + "</button><div class='content'>";
        nowcoll += jsonPartToColl(nowpart);
        nowcoll += "</div>";
    }
    return nowcoll;
}

function updCollapsible() {
    let coll = document.getElementsByClassName("collapsible");
    let i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            this.children[0].innerHTML = "&#9660";
            content.style.display = "none";
        } else {
            this.children[0].innerHTML = "&#9650";
            content.style.display = "block";
        }
      });
    }
}


















// function jsonTextToText(txt) {
//     let nowtxt = "";
//     var from = txt[0];
//     if (from == '0') {
//         from = 'author';
//     }
//     // console.log(from);
//     // var now_side = person_side[from];
//     nowtxt += "<div><u><b>" + from + "</b></u></div>";
//     // console.log(now_side);
//     // var pref = '';
//     // var suf = '';
//     // if (now_side == 'author') {
//     //     pref = '<div class="author_block"><div class="author_msg">';
//     //     suf = '</div></div>';
//     // }
//     // if (now_side == 'left') {
//     //     pref = '<div class="left_block"><div class="left_msg">';
//     //     suf = '</div></div>';
//     // }
//     // if (now_side == 'right') {
//     //     pref = '<div class="right_block"><div class="right_msg">';
//     //     suf = '</div></div>';
//     // }
//     // if (now_side == 'center') {
//     //     // console.log("center_msg");
//     //     pref = '<div class="center_block"><div class="center_msg">';
//     //     suf = '</div></div>';
//     // }
//     // console.log(txt);
//     // return (pref + "<pre>" + txt[1] + "</pre>" + suf);
//     return (nowtxt + "<div>" + txt[1] + "</div>");
// }

// function jsonPageToText(nowpage) {
//     // return "some+page";
//     // html = '<table>';
//     html = '';
//     for (txt in nowpage) {
//         // console.log(nowpage[txt]);
//         nowtxt = jsonTextToColl(nowpage[txt]);
//         html = html + '<div>' + nowtxt + '</div>';
//         // html = html + '<tr><td>' + nowtxt + '</td></tr>';
//         html += '<br>';
//         // html += '<tr><td><div class="left_block"><br></div></td></tr>';
//     }
//     // html = html + '</table>';
//     return html;
// }

// function jsonPartToText(nowpart) {
//     let nowcoll = "";
//     for (i in nowpart['pages']) {
//         let nowpage = nowpart['pages'][i];
//         // console.log(nowpart['pages'][i]);
//         nowcoll += "<button type='button' class='collapsible'><span>&#9660</span>"+" Стр_" + String(parseInt(i) + 1) + "</button><div class='content'>";
//         nowcoll += jsonPageToColl(nowpage);
//         nowcoll += "</div>";
//     }
//     return nowcoll;
// }

// function jsonHeadToText(nowheader) {
//     let nowcoll = "";
//     nowcoll += "<div><b>Title:</b> " + nowheader['title'] + "</div>";
//     nowcoll += "<div><b>Описание:</b> " + nowheader['description'] + "</div>";
//     nowcoll += "<div><b>Шрифт(1-5):</b> " + nowheader['font'] + "</div>";
//     nowcoll += "<div><u><b>Персонажи:</b></u> " + "</div>";
//     let persons = nowheader['person'];
//     for (let i = 0; i < persons.length; i++) {
//         let nowp = persons[i];
//         nowcoll += "<div><b>" + nowp["name"] + ":</b> " + nowp["side"] + "</div>";
//     }
//     return nowcoll;
// }

// function jsonToText(nowjson) {
//     // var nowjson = JSON.parse(localStorage.getItem('json_edit'));
//     // get_person_sides(nowjson);
//     let nowcoll = "";
//     // nowcoll += "<button type='button' class='collapsible'><span>&#9660</span> Основная информация</button><div class='content'>";
//     nowcoll += jsonHeadToText(nowjson['header']);
//     // nowcoll += "</div>";
//     for (i in nowjson['parts']) {
//         let nowpart = nowjson['parts'][i];
//         // console.log("part2coll");
//         // let nowpart = nowjson['parts'][i];
//         nowcoll += "part=";
//         nowcoll += jsonPartToColl(nowpart);
//     }
//     return nowcoll;
// }


















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
    let ind1 = text.search("глава=", 0, text.length);
    // console.log(ind + ' ' + ind1);
    if ((ind1 != -1 && ind1 < ind) || ind == -1) {
        ind = ind1;
    }
    if (!text.includes(pref) && !text.includes("глава=")) {
        return [text, ""];
    }
    return [text.slice(0, ind), text.slice(ind, text.length)];
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

function clear_msg_str(s) {
    nows = s.trimRight(' \n\t');//.strip(' \n\t');
    let endl_cnt = 0;
    while (endl_cnt < nows.length & nows[endl_cnt] == '\n') {
        endl_cnt++;
    }
    return nows.substring(endl_cnt);//.strip(' \n\t');
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
    h['shownm'] = 'false';
    for (let a of header) {
        a[0] = clear_str(a[0]);
        a[2] = clear_str(a[2]);
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
            console.log(a[2]);
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
            let nowaka = a[2].split(',');
            let aka = [];
            // aka.push(h['person'][h['person'].length-1]['name']);
            for (let i in nowaka) {
                nowaka[i] = clear_str(nowaka[i]);
                if (nowaka[i].length != 0) {
                    aka.push(nowaka[i]);
                }
            }
            // console.log(aka);
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
        // console.log(i['name']);
        if ('aka' in i) {
            for (let j of i['aka']) {
                // let j = i['aka'][j_];
                names.push(j);
            }
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
        // console.log("befor: '" + i[1] + "'\n");
        i[1] = clear_msg_str(i[1]);
        // console.log("after: '" + i[1] + "'\n");
    }
    return now_letters.slice(1, now_letters.length);
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

function text_to_json(text) {
    let both_ = parse_header_parts(text);
    let header = both_[0];
    let parts = both_[1];

    let parsed_header = parse_header([["header", 0,  header]]);
    let parsed_parts = parse_parts([["parts", 0, parts]]);

    clear_array(parsed_header);
    // console.log(parsed_header);

    clear_array(parsed_parts);
    // console.log(parsed_parts);

    jheader = header2json(parsed_header);

    jparts = parts2json(parsed_parts);

    letters = {};
    letters['header'] = jheader;
    letters['parts'] = jparts;

    // var JSONString=JSON.stringify(letters);

    // let myString = JSON.stringify(letters, null, '\t');
    // return myString;
    return letters;
}
