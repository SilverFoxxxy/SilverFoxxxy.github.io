
var urlParams = new URLSearchParams(window.location.search);

async function showTextInfo() {
    let title = urlParams.get('name');
    let text_info = await get_text_info(title);
    console.log(text_info);

    document.getElementById("read").href=('letters_reader.html?name=' + title);

    if (!text_info.hasOwnProperty('story_fullnm')) {
        document.getElementById('story_nm').innerHTML = "404 Not Found";
        return;
    }

    author_nm = text_info.author_nm;
    editor_nm = text_info.editor_nm;
    story_description = text_info.story_description;
    rating = text_info.rating;
    story_fullnm = text_info.story_fullnm;

    document.getElementById('story_nm').innerHTML = story_fullnm;
    document.getElementById('description').innerHTML = story_description;
    if (!story_description || story_description.length < 2) {
        document.getElementById('description').innerHTML = "Нет описания(";
        document.getElementById("description_block").style.display = "none";
    }

    if ((author_nm) && author_nm.length > 2) {
        document.getElementById('author_nm').innerHTML = author_nm;
    }
    document.getElementById('editor_nm').innerHTML = editor_nm;

    if (rating >= 0) {
        document.getElementById('plus_rating').innerHTML = '+' + String(rating);
    } else {
        document.getElementById('plus_rating').innerHTML = String(rating);
    }

    document.getElementById('is_fav1').style.display = 'none';
    document.getElementById('is_fav2').style.display = 'none';
    document.getElementById('not_fav').style.display = 'block';
    document.getElementById('favs_text').innerHTML = 'в избранное';

    if (text_info.hasOwnProperty('is_fav')) {
        if (text_info['is_fav'] == true) {
            document.getElementById('is_fav1').style.display = 'block';
            document.getElementById('is_fav2').style.display = 'block';
            document.getElementById('not_fav').style.display = 'none';
            document.getElementById('favs_text').innerHTML = 'уже в избранном';
        }
    }

    document.getElementById('plus_rate_button_inside2').style.display = 'none';
    document.getElementById('plus_rate_button_inside1').style.display = 'block';
    document.getElementById('minus_rate_button_inside2').style.display = 'none';
    document.getElementById('minus_rate_button_inside1').style.display = 'block';

    if (text_info.hasOwnProperty('user_rating')) {
        let rate = text_info['user_rating'];
        if (rate == -1 || rate == 1) {
            let ename = 'plus_rate_button_inside';
            if (rate == -1) {
                ename = 'minus_rate_button_inside';
            }
            document.getElementById(ename + '1').style.display = 'none';
            document.getElementById(ename + '2').style.display = 'block';
        }
    }
}

async function change_rating(num) {
    if (num == -1 || num == 1) {
        let resp = await request_rating(num, urlParams.get('name'));
        showTextInfo();
    } else {
        return;
    }
}

async function add_fav_title() {
    let title = urlParams.get('name');
    await add_fav(title);
    showTextInfo();
}

async function reload_page_usr_info() {
    showTextInfo();
}

showTextInfo();