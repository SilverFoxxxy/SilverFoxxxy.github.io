
function check_symbols_(story_nm) {
    for (let i = 0; i < story_nm.length; i++) {
        nowc = story_nm[i];
        if (nowc != '_' && (nowc < 'a' || nowc > 'z')) {
            return false;
        }
    }
    return true;
}

async function add_story() {
    let now_token = getToken();
    if (!now_token) {
        // login needed
        alert('Необходимо залогиниться');
        return;
    }
    let story_fullnm = document.getElementById("story_fullnm").value;
    let story_nm = document.getElementById("story_nm").value;
    let story_description = document.getElementById("story_description").value;
    let author_name = document.getElementById("author_name").value;
    let story_text = document.getElementById("story_text").value;
    console.log(story_text.length);

    let alert_msg = 'Ошибка:\n';
    let alert_flag = false;

    // story_fullnm
    if (story_fullnm.length < 2) {
        alert_msg += 'Введите название\n';
        alert_flag = true;
    }
    if (story_fullnm.length > 150) {
        alert_msg += 'Название слишком длинное\n';
        alert_flag = true;
    }

    // story_nm
    if (story_nm.length < 2) {
        alert_msg += 'Введите название для адресной строки\n';
        alert_flag = true;
    }
    if (story_nm.length > 50) {
        alert_msg += 'Название для адресной строки слишком длинное\n';
        alert_flag = true;
    }
    if (story_nm == "test" || story_nm == "edit") {
        alert_msg += 'Используйте другое название для адресной строки\n';
        alert_flag = true;
    }
    if (!check_symbols_(story_nm)) {
        alert_msg += 'Название для адресной строки содержит некорректные символы\n';
        alert_flag = true;
    }

    // story_description
    if (story_description.length > 200) {
        alert_msg += 'Описание слишком длинное\n';
        alert_flag = true;
    }

    // author_name
    if (author_name.length > 50) {
        alert_msg += 'Имя автора слишком длинное\n';
        alert_flag = true;
    }

    // story_text
    if (story_text.length < 2) {
        alert_msg += 'Введите текст в специальном формате\n';
        alert_flag = true;
    }
    if (story_text.length > 1000000) {
        alert_msg += 'Текст слишком длинный - обратитесь к админу, чтобы получить возможность загрузить его на сайт\n';
        alert_flag = true;
    }


    if (alert_flag) {
        alert(alert_msg);
        return;
    }

    let now_info = {
        story_fullnm: story_fullnm,
        story_nm: story_nm,
        story_description: story_description,
        author_name: author_name
    };

    if (!alert_flag) {
        let r = confirm("Вы проверили текст в предпросмотре?\nесли нет и хотите проверить - жмите 'Отмена'");
        if (r == true) {
            let r1 = confirm("Загружаем текст на сайт");
            if (r1 == true) {
                // console.log(story_text.length);
                let now_text = JSON.stringify(text_to_json(story_text), null, '\t');
                // TODO: verify json
                let resp = await request_add_story(now_token, now_info, now_text);
                if (resp.hasOwnProperty("status") && resp["status"] == "failed") {
                    if (resp.hasOwnProperty("error")) {
                        if (resp["error"] == "already_exist") {
                            alert("История с таким названием адресной строки (которое на латинском) уже существует");
                        }
                        if (resp["error"] == "already_exist_fullnm") {
                            alert("История с таким названием уже существует");
                        }
                    }
                } else {
                    alert("Проверьте, добавилась ли история на сайт");
                }
            } else {
                return;
            }
        } else {
            return;
        }
    }
}

function show_text() {
    let story_text = document.getElementById("story_text").value;
    let now_json = text_to_json(story_text);
    document.getElementById('text_collapse').innerHTML = jsonToCollapsible(now_json);
    updCollapsible();
}


