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

// function copyToClipboard(elementId) {
//     if (elementId == "text_") {
//         const temp = document.createElement("input");
//         const text = document.getElementById("text_").value;
//         temp.setAttribute("value", text);
//         document.body.appendChild(temp);
//         temp.select();
//         document.execCommand("copy");
//         document.body.removeChild(temp);
//     }
//     if (elementId == "text111") {
//         const temp = document.createElement("input");
//         const text = JSON.stringify(letters, null, '\t');
//         temp.setAttribute("value", text);
//         document.body.appendChild(temp);
//         temp.select();
//         document.execCommand("copy");
//         document.body.removeChild(temp);
//     }
// }

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function parse(text) {
    localStorage.setItem('text_edit', text);
    let letters = text_to_json(text);
    // let both_ = parse_header_parts(text);
    // let header = both_[0];
    // let parts = both_[1];

    // let parsed_header = parse_header([["header", 0,  header]]);
    // let parsed_parts = parse_parts([["parts", 0, parts]]);

    // clear_array(parsed_header);
    // console.log(parsed_header);

    // clear_array(parsed_parts);
    // console.log(parsed_parts);

    // jheader = header2json(parsed_header);

    // jparts = parts2json(parsed_parts);

    // letters = {};
    // letters['header'] = jheader;
    // letters['parts'] = jparts;

    var JSONString=JSON.stringify(letters);

    let myString = JSON.stringify(letters, null, '\t');

    document.getElementById("text1").innerHTML = syntaxHighlight(myString);

    console.log(letters);

    // localStorage.setItem("json_edit__", myString);

    localStorage.setItem('json_edit', myString);
    localStorage.setItem('text_edit', text);

    // setCookie("json_edit", btoa(unescape(encodeURIComponent(myString))), 1000);
    // setCookie("text_edit", btoa(unescape(encodeURIComponent(text))), 1000);

}

// parse("header=    font= 5title= Скажешь мне..?description= Короткое стихотворение-диалог двух близких людейperson=    name=ааа    side=left    aka=1person=name=bbb    side=right   aka=2part=partname=page=    1= Cкaжeшь мнe 'дa'?        2= Дa.            0= <img src='src/textes/skazhesh_mne/fire_1.jpg' style='max-width: 100%; max-height: 100%;'>            0= <img src='src/textes/skazhesh_mne/fire_2.jpg' style='max-width: 100%; max-height: 100%;'>");

document.getElementById("convert_button").onclick = function()
{
  var texttt = document.getElementById("text_").value;
  // console.log(texttt);
  parse(texttt);
  document.getElementById('text_collapse').innerHTML = jsonToCollapsible(JSON.parse(localStorage.getItem('json_edit')));
  updCollapsible();
}

document.getElementById('text_').addEventListener('keydown', function(e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    this.value = this.value.substring(0, start) +
      "\t" + this.value.substring(end);

    // put caret at right position again
    this.selectionStart =
      this.selectionEnd = start + 1;
  }
});

let default_text =  "header=\n\ttitle= Переписка\n\tdescription= Это переписка для примера\n\tperson=\n\t\tname= Ваня\n\t\tside= left\n\tperson=\n\t\tname= Настя\n\t\tside= right\npart=\n\tpage=\n\t\tВаня=\nДоброе утро)\n\t\tНастя=\nДоброе!\nСделал домашку на сегодня?";
// let default_text = "header=\n    font= 5\n    title= Скажешь мне..?\n    description= Короткое стихотворение-диалог двух близких людей\n    person=\n        name=ааа\n        side=left\n        aka=1\n    person=\n        name=bbb\n        side=right\n        aka=2\npart=part\nname=page=\n    1= Cкaжeшь мнe 'дa'?\n        2= Дa.\n            0= <img src='src/textes/skazhesh_mne/fire_1.jpg' style='max-width: 100%; max-height: 100%;'>\n            0= <img src='src/textes/skazhesh_mne/fire_2.jpg' style='max-width: 100%; max-height: 100%;'>";
let now_text_edit = localStorage.getItem('text_edit');
if (typeof now_text_edit === 'string') {
    if (now_text_edit.length > 10) {
        document.getElementById("text_").value = now_text_edit;
        parse(document.getElementById("text_").value);
        document.getElementById('text_collapse').innerHTML = jsonToCollapsible(JSON.parse(localStorage.getItem('json_edit')));
        updCollapsible();
    } else {
        document.getElementById("text_").value = default_text;
        parse(default_text);
        document.getElementById('text_collapse').innerHTML = jsonToCollapsible(JSON.parse(localStorage.getItem('json_edit')));
        updCollapsible();
    }
} else {
    showdef();
}

function showdef() {
    document.getElementById("text_").value = default_text;
    parse(default_text);
    document.getElementById('text_collapse').innerHTML = jsonToCollapsible(JSON.parse(localStorage.getItem('json_edit')));
    updCollapsible();
}

