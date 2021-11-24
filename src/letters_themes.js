function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var view_icons = [[/*"src/icons/width_light.png",
                  "src/icons/width_dark.png",
                  "src/icons/width_light.png",*/
                  "src/icons/width_dark.png",
                  "src/icons/width_light.png"],
                  [/*"src/icons/default_light.png",
                  "src/icons/default_dark.png",
                  "src/icons/default_light.png",*/
                  "src/icons/default_dark.png",
                  "src/icons/default_light.png"]];
var theme_icons = [/*"src/icons/light_sun.png",
                   "src/icons/dark_moon.png",
                   "src/icons/half.jpg",*/
                   "src/icons/dark_moon.png",
                   "src/icons/light_sun.png"];
function setIcon() {
    var root = document.querySelector(':root');
    var cth = window.color_theme;
    var vth = window.view_theme;
    // console.log(String(cth) + String(vth));
    console.log(view_icons[vth][cth]);
    var nowimg = document.getElementById("view_icon");
    nowimg.src = view_icons[vth][cth];
    nowimg = document.getElementById("theme_icon");
    nowimg.src = theme_icons[cth];
}

function setTheme(theme_array) {
    // console.log("theme");
    // console.log(theme_array);
    var root = document.querySelector(':root');
    for (a in theme_array) {
        var now_name = theme_array[a][0];
        var now_color = theme_array[a][1];
        // console.log('--'+now_name+' = ' + now_color);
        root.style.setProperty('--'+now_name, now_color);
    }

    setIcon();
}

var color_themes = [
/*
        [
            // ["main-bg", "#F1F1F1"],
            //["main-bg", "#FFFFFF"],
            ["bg-bg", "#FFFFFF"],// B9BBC7// AFB4D7//9E9DC7
            ["main-bg", "#FFFFFF"],
            ["main-color", "#000000"],
            ["block-bg", "#8ACBF6"],//!74B5E0
            //["block-bg", "#CFD7EE"],//%%DDECF7//DEF1FD//50A19A // C4F4FF
            ["right-bg", "#CFEEFF"],//C2DDFF"],//DDECF7//%%C4D6EF//E2E6FF C2E7FF//B0DFFF //DEF1FD //94D4FF //A1D9FF //BAD9FF
            ["left-bg", "#FDFDFD"],//
            ["author-bg", "#D5D5E5"],//DADEE9//#D1D1F1 // CADEE9
            ["center-bg", "#DBF1FF"],
            ["outline-color", "#ffffff00"],
            ["font-fam", "Georgia"],
            ["msg-font-fam", "Tahoma"],
            ["border-radc", "1"],
            ["from-color", "#888888"]
        ],
        [
            ["bg-bg", "#221E2A"],
            ["main-bg", "#221E2A"],
            ["main-color", "#D1CAE0"],
            ["block-bg", "#191520"],
            ["right-bg", "#463865"],
            ["left-bg", "#322C3B"],
            ["author-bg", "#555565"],
            ["center-bg", "#555565"],
            ["outline-color", "#ffffff00"],
            ["font-fam", "Georgia"],
            ["msg-font-fam", "Tahoma"],
            ["border-radc", "1"],
            ["from-color", "#A895DD"]
        ],
        [
            // ["main-bg", "#F1F1F1"],
            //["main-bg", "#FFFFFF"],
            ["bg-bg", "#A1AAB5"],// B9BBC7// AFB4D7//9E9DC7
            ["main-bg", "#A1AAB5"],
            ["main-color", "#000000"],
            ["block-bg", "#747A82"],//!74B5E0 //8ACBF6
            //["block-bg", "#CFD7EE"],//%%DDECF7//DEF1FD//50A19A // C4F4FF
            ["right-bg", "#D1F2F6"],//CFEEFF//C2DDFF"],//DDECF7//%%C4D6EF//E2E6FF C2E7FF//B0DFFF //DEF1FD //94D4FF //A1D9FF //BAD9FF
            ["left-bg", "#E7E8EF"],//FDFDFD
            ["author-bg", "#D5D5E5"],//DADEE9//#D1D1F1 // CADEE9
            ["center-bg", "#DBF1FF"],
            ["outline-color", "#ffffff00"],
            ["font-fam", "Georgia"],
            ["msg-font-fam", "Tahoma"],
            ["border-radc", "1"],
            ["from-color", "#555555"]
        ],
*/

        

        /*[
            // ["main-bg", "#F1F1F1"],
            //["main-bg", "#FFFFFF"],
            ["bg-bg", "#dddddd"],// B9BBC7// AFB4D7//9E9DC7
            ["main-bg", "#dddddd"],
            ["main-color", "#000000"],
            ["block-bg", "#dddddd"],//!74B5E0 //8ACBF6
            //["block-bg", "#CFD7EE"],//%%DDECF7//DEF1FD//50A19A // C4F4FF
            ["right-bg", "#dddddd"],//CFEEFF//C2DDFF"],//DDECF7//%%C4D6EF//E2E6FF C2E7FF//B0DFFF //DEF1FD //94D4FF //A1D9FF //BAD9FF
            ["left-bg", "#dddddd"],//FDFDFD
            ["author-bg", "#dddddd"],//DADEE9//#D1D1F1 // CADEE9
            ["center-bg", "#dddddd"],
            ["outline-color", "#000000"],
            ["font-fam", "Elementa"],
            ["msg-font-fam", "Tahoma"],
            ["border-radc", "0"],
            ["from-color", "#885555"]
        ],
        [
            // ["main-bg", "#F1F1F1"],
            //["main-bg", "#FFFFFF"],
            ["bg-bg", "#000000"],// B9BBC7// AFB4D7//9E9DC7
            ["main-bg", "#000000"],
            ["main-color", "#dddddd"],
            ["block-bg", "#000000"],//!74B5E0 //8ACBF6
            //["block-bg", "#CFD7EE"],//%%DDECF7//DEF1FD//50A19A // C4F4FF
            ["right-bg", "#000000"],//CFEEFF//C2DDFF"],//DDECF7//%%C4D6EF//E2E6FF C2E7FF//B0DFFF //DEF1FD //94D4FF //A1D9FF //BAD9FF
            ["left-bg", "#000000"],//FDFDFD
            ["author-bg", "#000000"],//DADEE9//#D1D1F1 // CADEE9
            ["center-bg", "#000000"],
            ["outline-color", "#dddddd"],
            ["font-fam", "Elementa"],
            ["msg-font-fam", "Tahoma"],
            ["border-radc", "0"],
            ["from-color", "#DDAAAA"]
        ],*/
        [
            // ["main-bg", "#F1F1F1"],
            //["main-bg", "#FFFFFF"],
            ["bg-bg", "#2C2D2F"],// B9BBC7// AFB4D7//9E9DC7
            ["main-bg", "#2C2D2F"],
            ["main-color", "#EAEBED"],
            ["author-color", "#AAAAAA"],
            ["block-bg", "#191919"],//!74B5E0 //8ACBF6
            //["block-bg", "#CFD7EE"],//%%DDECF7//DEF1FD//50A19A // C4F4FF
            ["right-bg", "#454648"],//CFEEFF//C2DDFF"],//DDECF7//%%C4D6EF//E2E6FF C2E7FF//B0DFFF //DEF1FD //94D4FF //A1D9FF //BAD9FF
            ["left-bg", "#2C2D2F"],//FDFDFD
            ["author-bg", "#D5D5E5"],//DADEE9//#D1D1F1 // CADEE9
            ["center-bg", "#393A3B"],
            ["outline-color", "#ffffff00"],
            ["font-fam", "Georgia"],
            ["msg-font-fam", "Tahoma"],
            ["border-radc", "1"],
            ["from-color", "#FF9999"]
        ],
        [
            // ["main-bg", "#F1F1F1"],
            //["main-bg", "#FFFFFF"],
            ["bg-bg", "#DFE9F4"],// B9BBC7// AFB4D7//9E9DC7
            ["main-bg", "#DFE9F4"],
            ["main-color", "#000000"],
            ["author-color", "#555555"],
            ["block-bg", "#ffffff"],//!74B5E0
            //["block-bg", "#CFD7EE"],//%%DDECF7//DEF1FD//50A19A // C4F4FF
            ["right-bg", "#CDE5FE"],//C2DDFF"],//DDECF7//%%C4D6EF//E2E6FF C2E7FF//B0DFFF //DEF1FD //94D4FF //A1D9FF //BAD9FF
            ["left-bg", "#ECEDF1"],//
            ["author-bg", "#D5D5E5"],//DADEE9//#D1D1F1 // CADEE9
            ["center-bg", "#ECEDF1"],
            ["outline-color", "#ffffff00"],
            ["font-fam", "Georgia"],
            ["msg-font-fam", "Tahoma"],
            ["border-radc", "1"],
            ["from-color", "#4E87C6"]//#2C5984
        ]

    ];
// var is_color_theme_loaded = -1;
var is_color_theme_loaded = 1;
var color_theme_n = 1;
var color_theme_not_set = 1;

async function reload_theme() {
    var now_theme = parseInt(getCookie('color_theme'));
    
    if (!(0 < now_theme && now_theme <= color_themes.length)) {
        if (color_theme_not_set == 1) {
            color_theme_n = 0;
            // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            //     // dark mode
            //     color_theme_n = 1;
            // } else {
            //     color_theme_n = 2;
            // }
            color_theme_not_set = -1;
        }
        now_theme = color_theme_n + 1;
    }
    now_theme--;

    // console.log(now_theme);

    if (is_color_theme_loaded == -1) {
        try {
            var themes_json = await (await fetch("https://raw.githubusercontent.com/SilverFoxxxy/SilverFoxxxy.github.io/main/src/color_themes.json")).json();
            color_themes = themes_json["themes"];
            if (color_themes.length != 0) {
                is_color_theme_loaded = 1;
            }
        }
        catch(err) {
            console.log(err);
        }
    }
    var max_themes_n = color_themes.length;
    if ((now_theme >= 0 && now_theme < color_themes.length)) {
        setTheme(color_themes[now_theme]);
        color_theme_n = now_theme;
        window.color_theme = color_theme_n;
    }
}

reload_theme();

document.getElementById("color_theme_button").onclick = function()
{
  color_theme_n = (color_theme_n + 1) % color_themes.length;
  // console.log(theme_n);
  if (color_theme_n >= 0 && color_theme_n < color_themes.length) {
    setCookie('color_theme', color_theme_n + 1, 1);
    var root = document.querySelector(':root');
    window.color_theme = color_theme_n;
    reload_theme();
  }
}

