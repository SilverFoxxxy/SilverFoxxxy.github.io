// const server = 'http://localhost:8080/'
// const server = 'https://45.143.93.51/';
// const server = 'http://45.143.93.51/';
// const server = 'localhost:8080/';
const server = 'https://letters-reader2.tk/query/';

async function send_req(req_json) {
    console.log(JSON.stringify(req_json));

    var url = server;

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(req_json)
    });

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
      // получаем тело ответа (см. про этот метод ниже)
      let res_json = await response.json();
      return res_json;
      // var data = JSON.stringify(json);
      // console.log(json);
      // document.getElementById('res').innerHTML = data;
    } else {
        return {status: "failed", error: "connection"};
        // return {"error": "1"};
        // alert("Ошибка HTTP: " + response.status);
        console.log("Ошибка HTTP: " + response.status);
        // alert("Ошибка при подключении к серверу");
    }
}

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

function calc_hash(str) {
    /*jshint bitwise:false */
    let n = str.length;
    let salt = "my_magic_salt_4_great_soup";
    // let t = salt.length;
    // // str.charCodeAt(i);
    // var i, l;
    // let hval = 0;
    // for (i = 0; i < n; i++) {
    //     let nown = str.charCodeAt(i) * str.charCodeAt((i + t + 2) % n);
    //     hval += hval * 31 + nown;
    //     hval %= 1000000007;
    //     // hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    // }
    // console.log(hval.toString(16));
    // if( asString ){
    //     // Convert to 8 digit hex string
    //     return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    // }
    // return hval >>> 0;
    // return hval.toString(16);
    return digestMessage(str + salt);
}

// function calc_hash(pswd) {
//     let nowhash = 0;
//     let salt = "my_magic_salt_4_great_soup";
//     let nowstr = pswd + salt;
//     for (let i in nowstr) {
//         let nowchar = int(nowstr[i]);
//         nowhash = nowhash * 31 + nowchar;
//         nowhash %= 1000000007;
//     }
// }

async function request_add_story(token, info, text) {
    let req_json = {
        type: 'add_story',
        token: token,
        info: info,
        text: text
    }
    let req_res = send_req(req_json);
    return req_res;
}

async function request_registr(mail, name, pswd) {
    // calc_hash(pswd);
    let pswd_h = await calc_hash(pswd);
    let reg_json = {
        type: 'reg',
        mail: mail,
        name: name,
        pswd: pswd_h
    }
    let reg_res = send_req(reg_json);
    return reg_res;
}

async function request_login(name, pswd) {
    let pswd_h = await calc_hash(pswd);
    let req_json = {
        type: 'login',
        name_mail: name,
        pswd: pswd_h
    }
    // пробрасываем промис без await
    let login_res = send_req(req_json);
    return login_res;
}

async function get_text(title) {
    let req_json = {
        type: 'get_text',
        title: title
    }
    let login_res = send_req(req_json);
    return login_res;
}

async function get_text_info(title) {
    let req_json = {
        type: 'get_text_info',
        title: title,
        token: window.token
    }
    let login_res = send_req(req_json);
    return login_res;
}

async function request_rating(num, title) {
    if (getToken() == false) {
        return "bad_token";
    }
    let req_json = {
        type: 'rate',
        title: title,
        rate: num,
        token: window.token
    }
    let login_res = send_req(req_json);
    return login_res;
}

async function add_fav(title) {
    if (getToken() == false) {
        return "bad_token";
    }
    let req_json = {
        type: 'add_fav',
        title: title,
        token: window.token
    }
    let login_res = send_req(req_json);
    return login_res;
}

async function del_fav(title) {
    if (getToken() == false) {
        return "bad_token";
    }
    let req_json = {
        type: 'del_fav',
        title: title,
        token: window.token
    }
    let login_res = send_req(req_json);
    return login_res;
}

async function get_favs() {
    if (getToken() == false) {
        return "bad_token";
    }
    let req_json = {
        type: 'get_favs',
        token: window.token
    }
    let login_res = send_req(req_json);
    return login_res;
}

async function get_top() {
    // if (!window.token) {
    //     return "bad_token";
    // }
    let req_json = {
        type: 'get_top',
        token: window.token
    }
    let login_res = send_req(req_json);
    return login_res;
}

async function get_text__() {
    // var text = "the code to run";
    // var bad = "EVAL "  + JSON.stringify(text) + " 0\r\n";
    // // var x = new XMLHttpRequest();
    // // x.open("POST", "http://localhost:8080");
    // // x.send(bad);
    // const Http = new XMLHttpRequest();
    // const url = server;
    // Http.open("GET", url);
    // console.log(bad);
    // Http.setRequestHeader('Access-Control-Allow-Origin', '*');
    // Http.send(bad);

    // Http.onreadystatechange = (e) => {
    //   console.log(Http.responseText)
    // }
    // const axios = require('axios')

    // axios.post('http://localhost:8080', {
    //   todo: 'Buy the milk'
    // })

    // nowjson = {};

    // var xhr = new XMLHttpRequest();
    // var url = server;
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.onreadystatechange = function () {
    //     // if (xhr.readyState === 4 && xhr.status === 200) {
    //     //     var json = JSON.parse(xhr.responseText);
    //     //     console.log(json.email + ", " + json.password);
    //     // }
    //     console.log(xhr.responseText);
    //     // document.getElementById('res').innerHTML = xhr.responseText;
    // };
    // var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"}); // "ahhaha";
    // document.getElementById('res').innerHTML = data;
    // xhr.send(data);

    var url = server;

    let req = {
      type: 'get_text',
      story_name: 'nezhnost_barbyus'
    };

    // GET:
    // let response = await fetch(url);

    // POST:
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(req)
    });

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
      // получаем тело ответа (см. про этот метод ниже)
      let json = await response.json();
      var data = JSON.stringify(json);
      console.log(json);
      document.getElementById('res').innerHTML = data;
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
}

