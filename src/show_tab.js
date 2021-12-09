
async function showTop() {
    console.log('showTop');
    let res = await get_top();
    // console.log(res);
    if (!res.hasOwnProperty('story_list')) {
        return;
    }
    let story_list = res['story_list'];
    document.getElementById('main_tab').innerHTML = await story_list_to_cards(story_list);
}

async function showEdits() {
    if (getToken() == false) {
        document.getElementById('edit_table').innerHTML = "";
        return;
    }
    console.log('showEdits');
    let res = await get_edits();
    // console.log(res);
    if (!res.hasOwnProperty('story_list')) {
        // document.getElementById('edit_pretab').style.display = "block";
        document.getElementById('edit_table').innerHTML = "";
        return;
    }
    // document.getElementById('edit_pretab').style.display = "none";
    let story_list = res['story_list'];
    if (story_list.length > 0) {
        document.getElementById('edit_table').innerHTML = await story_list_to_cards(story_list);
    }
}

async function showFavs() {
    // console.log('showTop');
    if (getToken() == false) {
        // document.getElementById('favs_1').innerHTML = "";
        document.getElementById('favs_pretab').style.display = "block";
        document.getElementById('favs_table').innerHTML = "";
        return;
    }
    let res = await get_favs();
    console.log(res);
    if (!res.hasOwnProperty('story_list') || res["story_list"].length == 0) {
        document.getElementById('favs_pretab').style.display = "block";
        document.getElementById('favs_table').innerHTML = "";
        return;
    }
    document.getElementById('favs_pretab').style.display = "none";
    let story_list = res['story_list'];
    if (story_list.length > 0) {
      document.getElementById('favs_table').innerHTML = await story_list_to_cards(story_list);
    }
}

