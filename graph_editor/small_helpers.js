
function sync_checkboxes(a, b) {
  var checkbox1 = document.getElementById(a);
  var checkbox2 = document.getElementById(b);

  checkbox1.addEventListener('change', () => {
    checkbox2.checked = checkbox1.checked;
  });
  checkbox2.addEventListener('change', () => {
    checkbox1.checked = checkbox2.checked;
  });
}

sync_checkboxes('zero_index', 'zero_index_2');
sync_checkboxes('weighted', 'weighted_2');




function copy_to_clipboard(text_id) {
    /* Select text area by id*/
    var Text = document.getElementById(text_id);

    /* Select the text inside text area. */
    // Text.select();

    /* Copy selected text into clipboard */
    if (text_id == "random_graph") {
        navigator.clipboard.writeText(Text.innerHTML);
    } else {
        navigator.clipboard.writeText(Text.value);
    }
}

// test:
/*
6
0 2
0 4
0 5
1 4
1 5
2 3
2 4
4 5



15
0 1
0 2
0 3
0 8
0 14
1 2
1 5
1 7
1 13
2 5
2 10
2 12
3 5
3 7
4 6
4 8
4 14
5 6
5 11
6 10
6 12
7 8
7 10
7 12
7 14
9 11
10 11
10 14
11 12
11 14
13 14

*/



function openTab(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("init_tab_button").click(); 


function setTheme(evt, theme){
    localStorage.setItem('theme', theme);
    current_theme = theme;
    theme_buttons = document.getElementsByClassName("theme_button");
    for (i = 0; i < theme_buttons.length; i++) {
        theme_buttons[i].className = theme_buttons[i].className.replace(" active", "");
    }
    // document.getElementById(theme).style.display = "block";
    evt.currentTarget.className += " active";
    document.documentElement.className = theme;
    render();
}

var current_theme = localStorage.getItem('theme');
console.log(current_theme);
if (!current_theme) {
    current_theme = 'white';
}
document.getElementById(current_theme + "_theme_button").click(); 
