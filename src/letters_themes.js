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

var view_icons = [["src/icons/width_light.png",
                  "src/icons/width_dark.png"],
                  ["src/icons/default_light.png",
                  "src/icons/default_dark.png"]];
var theme_icons = ["src/icons/light_sun.png",
                   "src/icons/dark_moon.png"];
function setIcon() {
    var root = document.querySelector(':root');
    var cth = window.color_theme;
    var vth = window.view_theme;
    // console.log(String(cth) + String(vth));
    // console.log(view_icons[vth][cth]);
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
        [
            ["main-bg", "#F1F1F1"],
            ["main-color", "#000000"],
            ["block-bg", "#74B5E0"],
            ["right-bg", "#DEF1FD"],
            ["left-bg", "#FDFDFD"],
            ["author-bg", "#F1F1F1"]
        ],
        [
            ["main-bg", "#221E2A"],
            ["main-color", "#D1CAE0"],
            ["block-bg", "#191520"],
            ["right-bg", "#463865"],
            ["left-bg", "#322C3B"],
            ["author-bg", "#555565"]
        ]
    ];
// var is_color_theme_loaded = -1;
var is_color_theme_loaded = 1;
var color_theme_n = 1;
var color_theme_not_set = 1;

async function reload_theme() {
    var now_theme = parseInt(getCookie('color_theme'));
    
    if (!(0 < now_theme && now_theme <= 2)) {
        if (color_theme_not_set == 1) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // dark mode
                color_theme_n = 1;
            } else {
                color_theme_n = 0;
            }
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
  color_theme_n = 1 - color_theme_n;
  // console.log(theme_n);
  if (color_theme_n == 1 || color_theme_n == 0) {
    setCookie('color_theme', color_theme_n + 1, 15);
    var root = document.querySelector(':root');
    window.color_theme = color_theme_n;
    reload_theme();
  }
}

