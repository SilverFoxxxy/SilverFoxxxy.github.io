
async function showTop() {
    console.log('showTop');
    let res = await get_top();
    console.log(res);
    if (!res.hasOwnProperty('story_list')) {
        return;
    }
    let story_list = res['story_list'];
    document.getElementById('top_tab').innerHTML = await story_list_to_cards(story_list);
}

showTop();
