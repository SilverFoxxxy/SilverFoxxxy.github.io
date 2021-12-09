
// async function showTop() {
//     console.log('showTop');
//     let res = await get_top();
//     console.log(res);
//     if (!res.hasOwnProperty('story_list')) {
//         return;
//     }
//     let story_list = res['story_list'];
//     document.getElementById('main_tab').innerHTML = await story_list_to_cards(story_list);
// }

// showTop();

// async function showEdits() {
//     if (getToken() == false) {
//         return;
//     }
//     // console.log('showTop');
//     let res = await get_edits();
//     console.log(res);
//     if (!res.hasOwnProperty('story_list')) {
//         return;
//     }
//     let story_list = res['story_list'];
//     if (story_list.length > 0) {
//         document.getElementById('edit_table').innerHTML = await story_list_to_cards(story_list);
//     }
// }

// showEdits();

