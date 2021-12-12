
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
    if (!window.logged_in) {
        if (document.getElementById("login_block").style.display == "block") {
            document.getElementById("login_block").style.display = "none";
            document.getElementById('logged_in_block').style.display = 'none';
        } else {
            document.getElementById('logged_in_block').style.display = 'none';
            document.getElementById("login_block").style.display = "block";
        }
    } else {
        if (document.getElementById("logged_in_block").style.display == "block") {
            document.getElementById("login_block").style.display = "none";
            document.getElementById("logged_in_block").style.display = "none";
        } else {
            document.getElementById("login_block").style.display = "none";
            document.getElementById("logged_in_block").style.display = "block";
        }
    }
}

async function tryLogout() {
    window.logged_in = false;
    window.token = "";
    window.user_nm = "";
    setCookie('user_token', "", 15);
    setCookie('user_nm', "", 15);
    document.getElementById('username').style.display = 'none';
    document.getElementById('login_block').style.display = 'none';
    document.getElementById('logged_in_block').style.display = 'none';
    document.getElementById('login_errors').innerHTML = '';
    reload_page_usr_info();
}

async function doLogin(user_json, act_type) {
    console.log(user_json);
    if (user_json.hasOwnProperty('user_token') && user_json.hasOwnProperty('user') && String(user_json['user_token']).length > 10) {
        window.logged_in = true;

        setCookie('user_token', user_json['user_token'], 15);
        setCookie('user_nm', user_json['user']['user_nm'], 15);
        let nowname = user_json['user']['user_nm'];
        window.token = user_json['user_token'];
        window.user_nm = user_json['user']['user_nm'];

        document.getElementById('username').innerHTML = nowname;
        document.getElementById('username').style.display = 'block';
        document.getElementById('login_block').style.display = 'none';
        document.getElementById('login_errors').innerHTML = '';
        document.getElementById("user_nm").value = "";
        document.getElementById("user_pswd").value = "";
        reload_page_usr_info();
        // document.getElementById('username').innerHTML = name;
    } else {
        window.logged_in = false;
        window.token = "";
        window.user_nm = "";
        setCookie('user_token', "", 15);
        setCookie('user_nm', "", 15);

        if (act_type == "by_token") {
            // document.getElementById('username').style.display = 'none';
            document.getElementById('login_errors').innerHTML = '';
            // tryLogout();
        }

        if (act_type == "by_pswd") {
            document.getElementById('username').style.display = 'none';
            document.getElementById('login_block').style.display = 'block';
            document.getElementById('login_errors').innerHTML = 'Не получилось залогиниться<br>Проверьте имя и пароль';
            // TO DO
        }

        if (act_type == "by_vk") {
            document.getElementById('username').style.display = 'none';
            document.getElementById('login_errors').innerHTML = 'Не получилось залогиниться<br>Возможно, аккаунт не привязан к ВК';
        }
    }
}

async function tryLogin() {
    // document.getElementById('username').style.display = 'none';
    // document.getElementById('login_block').style.display = 'none';
    let name = document.getElementById("user_nm").value;
    let pswd = document.getElementById("user_pswd").value;

    let now_error = false;
    let error_msg = "";

    if (name.length > 40) {
        error_msg += "Почта слишком длинная (более 40 символов)\n";
        now_error = true;
    }

    if (pswd.length > 40) {
        error_msg += "Пароль слишком длинный (более 40 символов)\n";
        now_error = true;
    }

    if (now_error) {
        alert(error_msg);
        return;
    }
    let user_json = await request_login(name, pswd);
    doLogin(user_json, "by_pswd");
}

async function tryRelogin() {
    // // TODO: rewrite to try login by token
    // document.getElementById('username').style.display = 'none';
    // let nowtoken = getCookie('user_token');
    // if (!nowtoken) {
    //     return;
    // }
    // if (nowtoken.length > 5) {
    //     let nowname = getCookie('user_nm');
    //     document.getElementById('username').innerHTML = nowname;
    //     document.getElementById('username').style.display = 'block';
    //     window.token = nowtoken;
    //     reload_page_usr_info();
    // }
    // if (!getToken()) {
    //     return;
    // }
    let user_json = await request_token_login();
    doLogin(user_json, "by_token");
}

async function addVKData(data) {
    if (window.logged_in) {
        let res_json = await request_add_vk_data(data["uid"], data["hash"]);
        // console.log("here\n");
        console.log(res_json);
    }
}

async function tryVKData(data) {
    console.log(data);
    let user_json = await request_vk_login(data["uid"], data["hash"]);
    doLogin(user_json, "by_vk");
}

// async function tryVKAuth() {
//     VK.Auth.login(function(data) {
//       tryVKData(data);
//     });
// }

tryRelogin();

