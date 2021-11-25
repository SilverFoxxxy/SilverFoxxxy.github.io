
function check_symbols(str) {
    let symbols = '!"#$%&' +
                    "'()*+,-./:;<=>?@[\\]^_`{|}~" +
                    "0123456789" +
                    "abcdefghijklmnopqrstuvwxyz" +
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // console.log(symbols);
    for (let i = 0, l = str.length; i < l; i++) {
        if (!symbols.includes(str[i])) {
            return false;
        }
    }
    return true;
}

function is_valid_email (emailAdress) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
        return true; 
    } else {
        return false; 
    }
}

async function tryReg() {
    let mail = document.getElementById("user_mail1").value;
    let name = document.getElementById("user_nm1").value;
    let pswd = document.getElementById("user_passwd2").value;
    let pswd2 = document.getElementById("user_passwd3").value;
    let error_msg = "";
    let now_error = false;

    if (is_valid_email(name)) {
        error_msg += "Имя не должно быть в формате почты<br>";
        now_error = true;
    }

    if (!is_valid_email(mail)) {
        error_msg += "Почта в некорректном формате<br>";
        now_error = true;
    }

    if (pswd != pswd2) {
        error_msg += "Пароли не совпадают<br>";
        now_error = true;
        // return;
    }

    if (name.length < 3) {
        error_msg += "Логин слишком короткий<br>";
        now_error = true;
    }

    if (name.length > 40) {
        error_msg += "Логин слишком длинный (более 40 символов)<br>";
        now_error = true;
    }

    if (mail.length > 40) {
        error_msg += "Почта слишком длинная (более 40 символов)<br>";
        now_error = true;
    }

    if (pswd.length > 40) {
        error_msg += "Пароль слишком длинный (более 40 символов)<br>";
        now_error = true;
    }

    if (pswd.length < 4) {
        error_msg += "Пароль слишком короткий (пароль должен состоять хотя бы из 4-х символов)<br>";
        now_error = true;
    }

    if (!check_symbols(pswd)) {
        error_msg += "В пароле есть недопустимые символы<br>";
        now_error = true;
        // return;
    }

    if (!check_symbols(name)) {
        error_msg += "В логине есть недопустимые символы<br>";
        now_error = true;
        // return;
    }

    if (!check_symbols(pswd) || !check_symbols(name)) {
        error_msg += "Логин и пароль должны состоять из:<br> - символов латинского алфавита a-z, A-Z<br> - цифр 0-9 <br>- специальных символов:<br>" + '!"#$%&' +
                    "'()*+,-./:;<=>?@[\\]^_`{|}~";
        now_error = true;
    }

    if (now_error) {
        document.getElementById("reg_errors").innerHTML = error_msg;
        return;
    }

    if (!now_error)
    {
        document.getElementById("reg_errors").innerHTML = error_msg;
        resp = await request_registr(mail, name, pswd);
        console.log(resp);
        if (resp.hasOwnProperty('user_added') && resp['user_added'] == 'true') {
            document.getElementById("reg_errors").innerHTML = "Попробуйте залогиниться";
        } else {
            if (resp.hasOwnProperty('status') && resp['status'] == "failed") {
                if (resp['error'] == 'name') {
                    document.getElementById("reg_errors").innerHTML = "Пользователь с таким именем уже существует";
                } else {
                    if (resp['error'] == 'mail') {
                        document.getElementById("reg_errors").innerHTML = "Пользователь с такой почтой уже существует";
                    } else {
                        document.getElementById("reg_errors").innerHTML = "Что-то пошло не так. Поменяйте параметры или попробуйте позже";
                    }
                }
            } else {
                document.getElementById("reg_errors").innerHTML = "Что-то пошло не так. Поменяйте параметры или попробуйте позже";
            }
        }
    }
}
