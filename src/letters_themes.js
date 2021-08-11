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

function setTheme(theme_array) {
    // console.log(theme_array);
    var root = document.querySelector(':root');
    for (a in theme_array) {
        var now_name = theme_array[a][0];
        var now_color = theme_array[a][1];
        // console.log('--'+now_name+' = ' + now_color);
        root.style.setProperty('--'+now_name, now_color);
    }
}

var themes;
var isthemeloaded = -1;
var theme_n = 1;


async function reload_theme() {
    var now_theme = parseInt(getCookie('color_theme'));
    // console.log(now_theme);
    if (now_theme == null || now_theme == NaN) {
        now_theme = 2;
    }
    now_theme--;

    if (isthemeloaded == -1) {
        try {
            var themes_json = await (await fetch("https://raw.githubusercontent.com/SilverFoxxxy/SilverFoxxxy.github.io/main/src/color_themes.json")).json();
            // console.log(themes_json);
            themes = themes_json["themes"];
            if (themes.length != 0) {
                isthemeloaded = true;
            }
            // console.log(themes[0]);
            // console.log(now_theme);

            var max_themes_n = themes.length;
            if (!(now_theme >= 0 && now_theme < themes.length)) {
                // console.log(now_theme);
                now_theme = theme_n;
                setCookie('color_theme', now_theme + 1, 30);
                setTheme(themes[now_theme]);
            } else {
                if (now_theme >= 0 && now_theme < themes.length) {
                    setTheme(themes[now_theme]);
                }
                theme_n = now_theme;
                setCookie('color_theme', now_theme + 1, 30);
            }
        }
        catch{}
    } else {
        var max_themes_n = themes.length;
        if (!(now_theme >= 0 && now_theme < themes.length)) {
            // console.log(now_theme);
            now_theme = theme_n;
            setCookie('color_theme', now_theme + 1, 30);
            setTheme(themes[now_theme]);
        } else {
            if (now_theme >= 0 && now_theme < themes.length) {
                setTheme(themes[now_theme]);
            }
            theme_n = now_theme;
            setCookie('color_theme', now_theme + 1, 30);
        }
    }
}

reload_theme();

document.getElementById("color_theme_button").onclick = function()
{
  theme_n = 1 - theme_n;
  // console.log(theme_n);
  if (theme_n == 1 || theme_n == 0) {
    setCookie('color_theme', theme_n + 1, 30);
  }
  reload_theme();
}

