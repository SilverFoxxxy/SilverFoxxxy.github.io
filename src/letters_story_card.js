
async function story_list_to_cards(story_list) {
    let text = '<table>';
    for (let i = 0; i < story_list.length; i++) {
        text += '<tr><td><div style="font-size: 1em;"><br><br><br></div></td></tr>';
        let now_story = story_list[i];
        let story_nm = now_story['story_nm'];
        let story_fullnm = now_story['story_fullnm'];
        let story_description = now_story['story_description'];
        let rating = now_story['rating'];
        let favs_cnt = now_story['favs_cnt'];
        text += '<tr><td><div class="link_block link_msg_v1"><div class="link_msg link_msg_v2"><a href="letters_page.html?name=' + story_nm + '" style="text-decoration: none;">';
        text += '<big>' + story_fullnm + '</big></a>';
        if ((typeof story_description) == "string" && story_description.length > 2) {
            text += '<hr><div style="font-style: italic; font-size: calc(var(--def-fontsz) * 0.7);">' + story_description + '</a></div>';
        }
        text += '<hr><center><table style="width: 90%;"><tr>';
        text += '<td style="width: 60%; font-size: calc(var(--def-fontsz) * 0.8);"><center><span style="color: var(--from-color); font-size: calc(var(--def-fontsz) * 0.7);">рейтинг:&nbsp;&nbsp;</span>';
        let rate_str = '';
        if (rating == "null" || rating == null) {
            rating = 0;
        }
        if (parseInt(rating) >= 0) {
            rate_str = '+' + String(rating);
        } else {
            rate_str += rating;
        }
        text += rate_str + '</center></td>';

        text += '<td style="width: 40%;"><center>';
        text += '<span id="show_fav" style="display: block; width: 2em; font-size: calc(var(--def-fontsz)); font-family: Arial sans-serif; font-weight: normal; font-style: normal; color: transparent; position: relative;">';
        text += '&#9825;';
        text += '<span id="not_fav" style="display: block; width: 2em; color: var(--main-color); font-family: Arial sans-serif; font-weight: normal; font-style: normal; position: absolute; top: 0; left: -2em;">';
        text += '&#9825;';
        text += '</span><span id="is_fav1" style="display: block; width: 2em; color: var(--block-bg); font-family: Arial sans-serif; font-weight: normal; font-style: normal; position: absolute; top: 0; left: -2em;">&#9829;</span><span id="is_fav2" style="display: block; width: 2em; color: var(--from-color); font-family: Arial sans-serif; font-weight: normal; font-style: normal; position: absolute; top: 0; left: -2em;">&#9825;</span>';
        text += '<span style="position: absolute; left: 0em; color: var(--main-color);">';
        text += favs_cnt;
        text += '</span></span></center></td></tr></table></center></div></div></td></tr>';
    }
    text += '<tr><td><div style="font-size: 1em;"><br><br><br><br><br></div></td></tr>';
    text += '</table>';
    return text;
}

