
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

window.token = null;

function getToken() {
    let token = window.token;
    if (String(token).length < 10) {
        return false;
    } else {
        return token;
    }
}

function showLoginForm() {
    if (document.getElementById("login_block").style.display == "block") {
        document.getElementById("login_block").style.display = "none";
    } else {
        document.getElementById("login_block").style.display = "block";
    }
}

async function tryRelogin() {
    document.getElementById('username').style.display = 'none';
    let nowtoken = getCookie('user_token');
    if (!nowtoken) {
        return;
    }
    if (nowtoken.length > 5) {
        let nowname = getCookie('user_nm');
        document.getElementById('username').innerHTML = nowname;
        document.getElementById('username').style.display = 'block';
        window.token = nowtoken;
        reload_page_usr_info();
    }
}

async function tryLogin() {
    document.getElementById('username').style.display = 'none';
    document.getElementById('login_block').style.display = 'none';
    let name = document.getElementById("user_nm").value;
    let pswd = document.getElementById("user_pswd").value;
    let user_json = await request_login(name, pswd);
    console.log(user_json);
    if (user_json.hasOwnProperty('user_token') && user_json.hasOwnProperty('user') && String(user_json['user_token']).length > 10) {
        setCookie('user_token', user_json['user_token'], 15);
        setCookie('user_nm', user_json['user']['user_nm']);
        let nowname = user_json['user']['user_nm'];
        window.token = user_json['user_token'];

        document.getElementById('username').innerHTML = nowname;
        document.getElementById('username').style.display = 'block';
        document.getElementById('login_block').style.display = 'none';
        reload_page_usr_info();
        // document.getElementById('username').innerHTML = name;
    } else {
        document.getElementById('login_block').style.display = 'block';
        document.getElementById('login_errors').innerHTML = 'Не получилось залогиниться<br>Проверьте имя и пароль';
        // TO DO
    }
}

tryRelogin();

