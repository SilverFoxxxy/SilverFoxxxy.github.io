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

var themes = [
        [
            ["block-width", "95vw"],
            ["def-fontsz", "3.5vw"],
            ["small-fontsz", "2.5vw"],
            ["button-width", "11vw"],
            ["bbutton-width", "25vw"],
            ["border-rad", "0.55vw"]
        ],
        [
            ["block-width", "35rem"],
            ["def-fontsz", "1.5rem"],
            ["small-fontsz", "1rem"],
            ["button-width", "4rem"],
            ["bbutton-width", "9rem"],
            ["border-rad", "0.2rem"]
        ]
    ];

// var isthemeloaded = -1;
var isthemeloaded = 1;
var theme_n = 1;

var view_icons = [["src/icons/width_light.png",
                  "src/icons/width_dark.png"],
                  ["src/icons/default_light.png",
                  "src/icons/default_dark.png"]];
function setIcon() {
    var root = document.querySelector(':root');
    var cth = window.color_theme;
    var vth = window.view_theme;
    // console.log(String(cth) + String(vth));
    // console.log(view_icons[vth][cth]);
    var nowimg = document.getElementById("view_icon");
    nowimg.src = view_icons[vth][cth];
}

function setTheme(theme_array) {
    // console.log("theme");
    // console.log(theme_array);
    var root = document.querySelector(':root');
    for (a in theme_array) {
        var now_name = theme_array[a][0];
        var now_view = theme_array[a][1];
        // console.log('--'+now_name+' = ' + now_view);
        root.style.setProperty('--'+now_name, now_view);
    }

    setIcon();
}

async function reload_view() {
    var now_theme = parseInt(getCookie('view_theme'));
    
    if (!(0 < now_theme && now_theme <= 2)) {
        now_theme = theme_n + 1;
    }
    now_theme--;
    window.view_theme = now_theme;

    window.font_sz = fontsz_a[window.view_theme];
    document.querySelector(':root').style.setProperty('--msg-fontsz', window.font_sz[window.msg_font_n]);

    // console.log(now_theme);

    if (isthemeloaded == -1) {
        try {
            var themes_json = await (await fetch("https://raw.githubusercontent.com/SilverFoxxxy/SilverFoxxxy.github.io/main/src/view_themes.json")).json();
            themes = themes_json["themes"];
            if (themes.length != 0) {
                isthemeloaded = true;
            }
        }
        catch(err) {
            console.log(err);
        }
    }
    var max_themes_n = themes.length;
    if ((now_theme >= 0 && now_theme < themes.length)) {
        setTheme(themes[now_theme]);
        theme_n = now_theme;
        window.view_theme = theme_n;
    }
}

reload_view();

document.getElementById("view_theme_button").onclick = function()
{
  theme_n = 1 - theme_n;
  // console.log(theme_n);
  if (theme_n == 1 || theme_n == 0) {
    setCookie('view_theme', theme_n + 1, 30);
    var root = document.querySelector(':root');
    window.view_theme = theme_n;
    reload_view();
  }
}

