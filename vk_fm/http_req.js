// const server = 'http://localhost:8080/'
// const server = 'https://45.143.93.51/';
// const server = 'http://45.143.93.51/';
// const server = 'http://localhost:8090/';
const server = 'http://194.87.99.149/vk_map/';

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

async function calc_hash(str) {
    /*jshint bitwise:false */
    let n = str.length;
    let salt = "my_magic_salt_4_great_soup";
    return await digestMessage(str + salt);
}

async function get_test() {
    console.log("aaa")
    let req_json = {
        type: 'test_node'
    }
    let res = send_req(req_json);
    return res;
}

async function get_friends(vk_id) {
    let req_json = {
        type: 'get_friends',
        vk_id: vk_id
    }
    let res = send_req(req_json);
    return res;
}

async function get_text(title) {
    let req_json = {
        type: 'get_text',
        title: title
    }
    let res = send_req(req_json);
    return res;
}
