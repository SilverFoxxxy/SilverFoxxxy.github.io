

async function showTop() {
    console.log('showTop');
    let res = await get_favs();
    console.log(res);
    if (!res.hasOwnProperty('story_list')) {
        return;
    }
    let story_list = res['story_list'];
    document.getElementById('favs_block').innerHTML = await story_list_to_cards(story_list);
}

showTop();

async function reload_page_usr_info() {
    showTop();
}
