
var urlParams = new URLSearchParams(window.location.search);

async function showTextInfo() {
    window.rate_num = 0;
    window.is_fav = false;
    let title = urlParams.get('name');
    let text_info = await get_text_info(title);
    // console.log(text_info);

    if (!text_info.hasOwnProperty('story_fullnm')) {
        document.getElementById('story_nm').innerHTML = "404 Not Found";
        return;
    }

    let author_nm = text_info.author_nm;
    let editor_nm = text_info.editor_nm;
    let story_description = text_info.story_description;
    // rating = text_info.rating;
    let story_fullnm = text_info.story_fullnm;

    document.getElementById('now_title').innerHTML = story_fullnm;

    document.getElementById('now_author').innerHTML = author_nm;

    document.getElementById('now_description').innerHTML = story_description;
    if (!story_description || story_description.length < 2) {
        document.getElementById('description').innerHTML = "";
        // document.getElementById("description_block").style.display = "none";
    }

}

async function edit_story() {
    let now_token = getToken();
    if (!now_token) {
        // login needed
        alert('Необходимо залогиниться');
        return;
    }

    let ch_title = document.getElementById('change_title');
    let ch_author = document.getElementById('change_author');
    let ch_description = document.getElementById('change_description');
    let ch_text = document.getElementById('change_text');

    let alert_msg = 'Ошибка:\n';
    let alert_flag = false;

    let new_title = document.getElementById('new_title').value;
    let new_author = document.getElementById('new_author').value;
    let new_description = document.getElementById('new_description').value;
    let new_text = document.getElementById('story_text').value;

    let now_text_info = {};

    let story_nm = urlParams.get('name');

    now_text_info["story_nm"] = story_nm;

    if (ch_title.checked) {
        if (new_title.length < 2) {
            alert_msg += 'Введите название\n';
            alert_flag = true;
        }
        if (new_title.length > 150) {
            alert_msg += 'Название слишком длинное\n';
            alert_flag = true;
        }
        now_text_info["ch_title"] = "true";
        now_text_info["new_title"] = new_title;
    }

    if (ch_author.checked) {
        if (new_author.length > 50) {
            alert_msg += 'Имя автора слишком длинное\n';
            alert_flag = true;
        }
        now_text_info["ch_author"] = "true";
        now_text_info["new_author"] = new_author;
    }

    if (ch_description.checked) {
        if (new_description.length > 200) {
            alert_msg += 'Описание слишком длинное\n';
            alert_flag = true;
        }
        now_text_info["ch_description"] = "true";
        now_text_info["new_description"] = new_description;
    }

    if (ch_text.checked) {
        if (new_text.length > 1000000) {
            alert_msg += 'Текст слишком длинный - обратитесь к админу, чтобы получить возможность загрузить его на сайт\n';
            alert_flag = true;
        }
        now_text_info["ch_text"] = "true";
        let new_text_json = JSON.stringify(text_to_json(new_text), null, '\t');
        // TODO: verify json
        now_text_info["new_text"] = new_text_json;
    }

    if (alert_flag) {
        alert(alert_msg);
        return;
    }

    let resp = await request_edit_story(now_token, now_text_info);
}

function show_text() {
    let story_text = document.getElementById("story_text").value;
    let now_json = text_to_json(story_text);
    document.getElementById('text_collapse').innerHTML = jsonToCollapsible(now_json);
    updCollapsible();
}

showTextInfo();
