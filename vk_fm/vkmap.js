
window.radius = 10;
window.points = [];

window.series = -1;
window.lseries = -1;
root = -1;

cur_id = -1;


function getFriends(vk_id) {
    var elem = document.getElementById("loading_req_text");
    elem.style.visibility = "visible";
    elem.style.opacity = "1";
    if (cur_id != vk_id) {
        cur_id = vk_id;
    }
    getFriendsCycle(vk_id);
}





async function getFriendsCycle(vk_id) {
    if (vk_id != cur_id) {
        return -1;
    }
    var friends = await(get_friends(vk_id));
    if (friends.hasOwnProperty("status")) {
        if (friends.status == "ok") {
            window.friends = friends;
            var elem = document.getElementById("loading_req_text");
            elem.style.visibility = "hidden";
            elem.style.opacity = "0";
            showFriends();
            return;
        }
        //if (friends.status == "failed") {
        if (friends.hasOwnProperty("error") && friends.error == -1) {
            setTimeout(getFriendsCycle, 1000, vk_id);
            return;
        }
        if (friends.hasOwnProperty("error") && friends.error == 15) {
            alert("Ошибка: закрытый профиль");
        } else {
            alert("Ошибка: некорректный id");
        }
        //}
        var elem = document.getElementById("loading_req_text");
        elem.style.visibility = "hidden";
        elem.style.opacity = "0";
        return;
    }
    setTimeout(getFriendsCycle, 1000, vk_id);
    return;
}





function clearMap() {
    if (window.series != -1) {
        window.series.dispose();
        window.points = [];
    }

    if (window.lseries != -1) {
        window.lseries.dispose();
    }

    var bubbleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {})
    );

    window.lseries = bubbleSeries;

    // var pointSeries = chart.series.push(
    //   am5map.MapPointSeries.new(root, {
    //     // ...
    //   })
    // );

    var pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        valueField: "value",
        calculateAggregates: true,
        polygonIdField: "id"
      })
    );

    window.series = pointSeries;

    

    var circleTemplate = am5.Template.new({});

    pointSeries.bullets.push(function(root, series, dataItem) {
        // console.log(dataItem);
        var circle = am5.Circle.new(root, {
            my_key: dataItem.key,
            radius: dataItem.rad,
            text: "{value.formatNumber('#.')}",
            fillOpacity: 0.7,
            fill: am5.color(0xff0000),
            // fill: am5.color(0xde4f2f),
            cursorOverStyle: "pointer",
            tooltipText: `{name}[/]`
        }, circleTemplate);

        circle.events.on("click", function(ev) {
            // alert("Clicked on " + ev.target.dataItem.dataContext.name);
            // alert("Clicked on " + ev.target.dataItem);
            console.log(ev.target.dataItem._settings.key);
            showFriendListByKey(ev.target.dataItem._settings.key);
        });

        return am5.Bullet.new(root, {
            sprite: circle
        });
    });

    pointSeries.bullets.push(function(root, series, dataItem) {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: "{value.formatNumber('#.')}",
          fill: am5.color(0xffffff),
          fontSize: dataItem.rad / 1.3,
          populateText: true,
          centerX: am5.p50,
          centerY: am5.p50,
          textAlign: "center"
        }),
        dynamic: true
      });
    });

    pointSeries.set("heatRules", [
    {
        target: circleTemplate,
        dataField: "rad",
        min: 7,
        max: 50,
        minValue: 0,
        maxValue: 100,
        key: "radius"
      }
    ]);

    // Create series for labels
    // var labelSeries = chart.series.push(
    //   am5map.MapPointSeries.new(root, {
    //     polygonIdField: "polygonId"
    //   })
    // );

    // labelSeries.bullets.push(function() {
    //   return am5.Bullet.new(root, {
    //     sprite: am5.Label.new(root, {
    //       fontSize: 10,
    //       centerX: am5.p50,
    //       centerY: am5.p50,
    //       text: "{name}",
    //       populateText: true
    //     })
    //   });
    // });

    

    var circleTemplate2 = am5.Template.new({});

    bubbleSeries.bullets.push(function(root, series, dataItem) {
      var container = am5.Container.new(root, {});

      var circle = container.children.push(
        am5.Circle.new(root, {
          radius: 5,
          fillOpacity: 0.7,
          fill: am5.color(0x222222),
          cursorOverStyle: "pointer",
          tooltipText: `{name}`
        }, circleTemplate2)
      );

      var countryLabel = container.children.push(
        am5.Label.new(root, {
          text: "{name}",
          paddingLeft: 7,
          fill: am5.color(0xffffff),
          populateText: true,
          fontWeight: "bold",
          fontSize: 7,
          centerY: am5.p50
        })
      );

      // circle.on("radius", function(radius) {
      //   countryLabel.set("x", radius);
      // })

      return am5.Bullet.new(root, {
        sprite: container// ,
        // dynamic: true
      });
    });
}

window.map_height = 100;
function pushToSeries(series, value, data) {
    data.rad = window.map_height / 60 * (1 + Math.min(Math.floor(Math.sqrt(value + 1)) / 4, 2));
    // console.log(window.map_height, value);
    // console.log(data.rad, data.value);
    //window.radius = 
    var cur = series.pushDataItem(data);
    // cur.
    window.points.push(cur);
    return;
}

am5.ready(function() {

    var root = am5.Root.new("chartdiv");
    window.root = root;
    // root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5map.MapChart.new(root, {homeZoomLevel: 1, wheelY: "none"}));

    window.chart = chart;

    // var chart = root.container.children.push(
    //   am5map.MapChart.new(root, {
    //     wheelY: "none"
    //   })
    // );
    // var chart = root.container.children.push(
    //   am5map.MapChart.new(root, {
    //     panX: "rotateX",
    //     wheelY: "zoom",
    //     wheelSensitivity: 0.7
    //   })
    // );
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    chart.set("zoomStep", 1.7);
    chart.on("zoomLevel", function(zoom, target) {
        // console.log(zoom, target);
        recalcZoom(zoom);
    });

    var pointSeries2 = chart.series.push(
      am5map.MapPointSeries.new(root, {})
    );

    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    }));

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true
    });

    var colors = am5.ColorSet.new(root, {});

    // polygonSeriesUS.mapPolygons.template.set("fill", colors.getIndex(3));

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    // Add state labels
    // polygonSeries.events.on("datavalidated", function(ev) {
    //   var series = ev.target;
    //   var labelData = [];
    //   series.mapPolygons.each(function(polygon) {
    //     var id = polygon.dataItem.get("id");
    //     labelData.push({
    //       polygonId: id,
    //       name: id.split("-").pop()
    //     })
    //   })
    //   labelSeries.data.setAll(labelData);
    // });

    // polygonSeries.mapPolygons.template.setAll({
    //   // tooltipText: "{name}",
    //   // toggleKey: "active",
    //   interactive: true
    // });

    // polygonSeries.mapPolygons.template.states.create("hover", {
    //   fill: root.interfaceColors.get("primaryButtonHover")
    // });

    // polygonSeries.mapPolygons.template.states.create("active", {
    //   fill: root.interfaceColors.get("primaryButtonHover")
    // });




    var polygonSeriesUA = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_ukraineLow,
      include: ["UA-65", "UA-09", "UA-14", "UA-23", "UA-43", "UA-40"]
    }));

    polygonSeriesUA.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true
    });

    var colors = am5.ColorSet.new(root, {});

    // polygonSeriesUS.mapPolygons.template.set("fill", colors.getIndex(3));

    polygonSeriesUA.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    polygonSeriesUA.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });




    clearMap();

    init();

    recalcZoom(1);
});





var root_css = document.querySelector(':root');

var myMap;
let citiesDB = -1;
let citiesVec = -1;


var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();



function print(a) {
    console.log(a);
}





async function getJSON() {
    const response = await fetch("citiesDB.json");
    const json = await response.json();
    console.log(json);
    return json;
}





const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};





function getCoords(city, country) {
    if (citiesVec == -1) {
        return -1;
    }
    let l_i = lowerBound(city, country);
    let r_i = upperBound(city, country);
    console.log(l_i, r_i);
    if (l_i < r_i && citiesVec[l_i][0] == city && citiesVec[l_i][1] == country) {
        let max_i = l_i;
        let max_pop = 0;
        for (let i = l_i; i < r_i; i++) {
            if (citiesVec[i][6] > max_pop) {
                max_i = i;
                max_pop = citiesVec[i][6];
            }
        }
        return [citiesVec[max_i][2], citiesVec[max_i][3]];
    } else {
        let now_i = find_closest(city, country);
        if (now_i == -1) {
            return -1;
        }
        return [citiesVec[now_i][2], citiesVec[now_i][3]];
    }
}





function fastGetCoords(city, country) {
    if (citiesVec == -1) {
        return -1;
    }
    let l_i = lowerBound(city, country);
    let r_i = upperBound(city, country);
    // console.log(l_i, r_i);
    if (l_i < r_i && citiesVec[l_i][0] == city && citiesVec[l_i][1] == country) {
        let max_i = l_i;
        let max_pop = 0;
        for (let i = l_i; i < r_i; i++) {
            if (citiesVec[i][6] > max_pop) {
                max_i = i;
                max_pop = citiesVec[i][6];
            }
        }
        return [citiesVec[max_i][2], citiesVec[max_i][3]];
    } else {
        return -1;
    }
}





async function init() {

    let DBurl = "https://silverfoxxxy.github.io/vk_fm/res/citiesDB_sorted.json";
    let respDB = await fetch(DBurl);

    citiesDB = await respDB.json();
    citiesVec = citiesDB.cities;

    var mindir = Math.min(window.innerWidth * 0.7, window.innerHeight * 0.9);

    var mwidth = String(Math.floor(mindir * 0.9)) + "px";
    var mheight = String(Math.floor(mindir * 0.9)) + "px";

    let test_res = await (get_test());

    console.log(test_res);

}





function lowerBound(city, country) {
    let l = 0;
    let r = citiesVec.length;
    while (l < r - 1) {
        let m = (l + r - (l + r) % 2) / 2;
        now_city = citiesVec[m][0];
        now_country = citiesVec[m][1];
        if (now_city < city || (now_city == city && now_country < country)) {
            l = m;
        } else {
            r = m;
        }
    }
    return r;
}





function upperBound(city, country) {
    let l = 0;
    let r = citiesVec.length;
    while (l < r - 1) {
        let m = (l + r - (l + r) % 2) / 2;
        now_city = citiesVec[m][0];
        now_country = citiesVec[m][1];
        if (now_city > city || (now_city == city && now_country > country)) {
            r = m;
        } else {
            l = m;
        }
    }
    return r;
}





function find_closest(city, country) {
    minLev = Math.floor(city.length / 5) + 1;
    min_i = -1;
    max_pop = 0;
    for (let i = 0; i < citiesVec.length; i++) {
        if (country != citiesVec[i][1]) {
            continue;
        }
        if (Math.abs(city.length - citiesVec[i][0].length) > 3) {
            continue;
        }
        if (city[0] != citiesVec[i][0][0]) {
            continue;
        }
        nowd = levenshteinDistance(city.slice(1), citiesVec[i][0].slice(1));
        if (nowd == minLev) {
            if (max_pop < citiesVec[i][6]) {
                max_pop = citiesVec[i][6];
                min_i = i;
            }
        }
        if (nowd < minLev) {
            min_i = i;
            min_Lev = nowd;
            max_pop = citiesVec[i][6];
        }
    }
    return min_i;
}






window.progress_percent = 0;

window.reload_cnt = 0;

window.reload_bar_run = false;

function reload_bar() {
    window.reload_cnt++;
    var progress_bar = document.getElementById("progress_bar");
    progress_bar.style.width = window.progress_percent + "%";
}

var cur_i = 0;
var currentId = 0;
var n = 0;

var friend_list = [];
var city_clusters = {};
var problem_cities = "";
var friends_slow = [];
var cur_clusters = {};

var city_dict = {};
var city_arr = [];





function clearAllData() {
    cur_i = 0;
    currentId = 0;
    n = 0;

    friend_list = [];
    city_clusters = {};
    problem_cities = "";
    friends_slow = [];
    cur_clusters = {};

    city_dict = {};
    city_arr = [];
}





function element2user(element, cf /* ru element */) {
    user = {};
    user.id = element.id;
    user.name = "";
    if (element.hasOwnProperty("first_name")) {
        if (cf.hasOwnProperty("first_name")) {
            user.name += cf.first_name;
        } else {
            user.name += element.first_name;
        }
        user.name1 = element.first_name;
    }
    if (element.hasOwnProperty("last_name")) {
        if (cf.hasOwnProperty("last_name")) {
            user.name += " " + cf.last_name;
        } else {
            user.name += " " + element.last_name;
        }
        user.name2 = element.last_name;
    }
    if (!element.hasOwnProperty("city")) { return -1; }
    user.city = element.city.title;
    if (!element.hasOwnProperty("country")) { return -1; }
    user.country = element.country.title;
    user.photo_url = "res/default.png";
    if (element.hasOwnProperty("photo_50")) {
        user.photo_url = element.photo_50;
    }

    user.city_ru = user.city;
    user.country_ru = user.country;
    // if (cf.hasOwnProperty("first_name")) {user.first_name = cf.first_name;}
    // if (cf.hasOwnProperty("last_name")) {user.last_name = cf.last_name;}
    if (cf.hasOwnProperty("city")) {user.city_ru = cf.city.title;}
    if (cf.hasOwnProperty("country")) {user.country_ru = cf.country.title;}
    return user;
}





function user2text(user) {
    var cur_hint = "<div class='user_info'><a href='" + "https://vk.com/id" + String(user.id) + "' target='_blank'><div class='hint_wrapper'>";
    name = user.name;
    city = user.city;
    country = user.country;
    if (user.hasOwnProperty("city_ru")) {
        city = user.city_ru;
    }
    if (user.hasOwnProperty("country_ru")) {
        country = user.country_ru;
    }
    if (country == "Russia" || country == "Ukraine") {
        country = -1;
    }
    if (user.hasOwnProperty("photo_url")) {
        cur_hint += "<div class='img_container'><img class='avatar_img' src='" + user.photo_url + "'></div>";
    } else {
        cur_hint += "<div class='img_container'><img class='avatar_img' src='" + "res/default.png" + "'></div>";
    }
    cur_hint += "<div style='width:10px;'></div><div class='hint_text'>" + name + "<br><span class='location_text'>" + city + ((country != -1 && country != "") ? ",<br>" + country : "") + "</span></div></div></a></div>";
    return cur_hint;
}




window.lastZoom = 1;
function recalcZoom(zoom_, init=false) {
    console.log("recalcZoom!");
    if (!init) {
        var z_ = 1;
        for (var i = 1; i < 63; i *= 2) {
            if (zoom_ < i * 2) {
                z_ = i;
                break;
            }
        }
        if (z_ == window.lastZoom) {
            return;
        } else {
            window.lastZoom = z_;
        }
    }
    var zoom = window.lastZoom;
    console.log("recalcZoom: " + String(zoom));
    // window.lastZoom = Math.floor(zoom);
    new_clusters = clusterizeByZoom(window.city_clusters, zoom);
    console.log(new_clusters);
    // console.log(new_clusters);
    new_cities = clusterizeCitiesByZoom(zoom);
    window.cur_clusters = new_clusters;
    clearMap();
    window.map_height = document.getElementById("chartdiv").offsetHeight;

    for (var i = 0; i < new_cities.length; i++) {
        city = new_cities[i];

        pushToSeries(window.lseries, 1, city);
    }

    for (const [key, cl] of Object.entries(new_clusters)) {
        console.log("wow, new cluster");
        pop = cl.pop;
        coords = cl.coords;
        keys = cl.keys;
        cur_text = "";
        var pop_cities = [];
        for (var i = 0; i < keys.length; i++) {
            pop_cities.push([keys[i], city_clusters[keys[i]].pop]);
            // cur_text += keys[i] + "\n";
        }
        pop_cities = pop_cities.sort(function(a, b) {
            return b[1] - a[1];
        });

        print_cnt = Math.min(3, keys.length);
        if (keys.length == 4) {
            print_cnt = 4;
        }

        for (var i = 0; i < print_cnt; i++) {
            city_ru = window.city_clusters[keys[i]].city_ru;
            country_ru = window.city_clusters[keys[i]].country_ru;
            cur_text += city_ru + " " + country_ru + "\n";
        }
        var cnt = keys.length - print_cnt;
        if (cnt > 0) {
            cit_txt = "";
            // 1 город
            // 2, 3, 4 города
            // 5 - 9; 10 - 20 городов
            if ((10 <= cnt && cnt <= 20) || cnt % 10 == 0 || (5 <= cnt % 10 && cnt % 10 <= 9)) {
                cit_txt = "других городов";
            } else if (cnt % 10 == 1) {
                cit_txt = "другой город";
            } else {
                cit_txt = "других города";
            }
            cur_text += "+ " + cnt + "  " + cit_txt + "\n";
        }

        fr_txt = "";
        // 1 город
        // 2, 3, 4 города
        // 5 - 9; 10 - 20 городов
        if ((10 <= pop && pop <= 20) || pop % 10 == 0 || (5 <= (pop % 10) && (pop % 10) <= 9)) {
            fr_txt = "друзей";
        } else if (pop % 10 == 1) {
            fr_txt = "друг";
        } else {
            fr_txt = "друга";
        }

        cur_text += "\n " + pop + " " + fr_txt;

        xc = coords[0];
        yc = coords[1];
        // if (pop == 1) {
        //     pop = '.';
        // }

        data = {
            latitude: xc,
            longitude: yc,
            key: key,
            name: cur_text,
            value: pop
        };

        // console.log(data);

        pushToSeries(window.series, pop, data);
    }
}





function clusterizeByZoom(city_clusters, zoom_) {
    // console.log(city_clusters);
    zoom = Math.floor(zoom_);
    for (var i = 1; i < 63; i *= 2) {
        if (zoom < i * 2) {
            zoom = i;
            break;
        }
    }
    stepx = 90 / zoom / 5;
    stepy = 180 / zoom / 5;
    new_clusters = {};
    new_coords = {};
    for (const [key, city_cl] of Object.entries(city_clusters)) {
        // console.log(key, city_cl);
        coords = city_cl.coords;
        if (city_cl.coords == -1) {
            continue;
        }
        cx = coords[0];
        cy = coords[1];
        cellx = Math.floor(cx / stepx);
        celly = Math.floor(cy / stepy);
        newkey = cellx + '#' + celly;

        newx = cellx * stepx + stepx * 0.5;
        newy = celly * stepy + stepy * 0.5;
        if (!new_clusters.hasOwnProperty(newkey)) {
            new_clusters[newkey] = {
                coords: [newx, newy],
                keys: new Array(),
                pop: 0
            };
            new_coords[newkey] = [0, 0, 0];
        }
        coords_k = 0.5;
        cur_pop = city_cl.users.length;
        new_clusters[newkey].keys.push(key);
        new_clusters[newkey].pop += cur_pop;
        new_coords[newkey][0] += (cx + newx * coords_k) * cur_pop;
        new_coords[newkey][1] += (cy + newy * coords_k) * cur_pop;
        new_coords[newkey][2] += cur_pop * (1 + coords_k);
    }
    for (const [key, new_cl] of Object.entries(new_clusters)) {
        xc = new_coords[key][0] / new_coords[key][2];
        yc = new_coords[key][1] / new_coords[key][2];
        new_clusters[key].coords = [xc, yc];
        // new_xy = [xc, yc];
    }
    // console.log(new_clusters);
    return new_clusters;
}





function clusterizeCitiesByZoom(zoom_) {
    // citiesVec;
    cellCities = {};
    zoom = Math.floor(zoom_);
    for (var i = 1; i < 63; i *= 2) {
        if (zoom < i * 2) {
            zoom = i;
            break;
        }
    }

    if (zoom > 2) {
        zoom = 2;
    }

    stepx = 90 / zoom / 2.5;
    stepy = 180 / zoom / 2.5;

    for (var i = 0; i < citiesVec.length; i++) {
        city = citiesVec[i];
        // console.log(key, city_cl);
        title = city[0];

        cx = city[2];
        cy = city[3];

        coords = [cx, cy];

        cellx = Math.floor(cx / stepx);
        celly = Math.floor(cy / stepy);

        newkey = cellx + '#' + celly;

        // newx = cellx * stepx + stepx * 0.5;
        // newy = celly * stepy + stepy * 0.5;

        cpop = city[6];
        if (cpop == '') {
            continue;
        }

        if (!cellCities.hasOwnProperty(newkey)) {
            cellCities[newkey] = {
                coords: coords,
                name: title,
                pop: cpop
            };
        } else {
            if (cpop > cellCities[newkey].pop) {
                cellCities[newkey] = {
                    coords: coords,
                    name: title,
                    pop: cpop
                };
            }
        }
    }

    cellCitiesArr = [];

    for (const [key, city] of Object.entries(cellCities)) {
        cellCitiesArr.push({
            latitude: city.coords[0],
            longitude: city.coords[1],
            name: city.name,
            value: 1// city.pop
        });
    }

    // console.log(cellCitiesArr);
    return cellCitiesArr;
}





function updCollapsibles() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    // &#8743; &#8744;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "grid") {
          content.style.display = "none";
          this.firstElementChild.lastElementChild.innerHTML = "&#8744;";
        } else {
          content.style.display = "grid";
          this.firstElementChild.lastElementChild.innerHTML = "&#8743;";
        }
      });
    }
}





function showFriendListByKey(key) {
    html_text = "";
    cur_keys = cur_clusters[key].keys;
    cur_keys = cur_keys.sort(function (a, b) {
        return city_clusters[b].users.length - city_clusters[a].users.length;
    });
    // small_city_ids = [];
    for (var i = 0; i < cur_keys.length; i++) {
        cur_key = cur_keys[i];

        users = city_clusters[cur_key].users;
        users = users.sort(function (a, b) {
            if (a.name2 > b.name2) {return 1;}
            if (b.name2 > a.name2) {return -1;}
            return 0;
        });

        cur_id = "city_list_" + i;

        // if (users.length < 3) { small_city_ids.push(cur_id); }

        bttn_text = "<button type='button' class='collapsible' " + "id='" + cur_id + "'><div class='collapse_button_wrapper'><div>"
                    + city_clusters[cur_key].city_ru + " "
                    + city_clusters[cur_key].country_ru + ": "
                    + users.length
                    + "</div><span class='collapsible_arrow'>&#8744;</span>"
                    + "</div></button><div class='content'>";
        users_list = "";
        for (var j = 0; j < users.length; j++) {
            users_list += user2text(users[j]);
        }

        html_text2 = "</div>";
        if (users.length <= 2) {
            html_text += users_list;
        } else {
            html_text += bttn_text + users_list + html_text2;
        }
    }
    document.getElementById("friends_list").innerHTML = html_text;
    updCollapsibles();

    // for (var i = 0; i < small_city_ids.length; i++) {
    //     document.getElementById(small_city_ids[i]).click();
    // }
}





async function showFriendsCycle() {
    var cp_time = Date.now();
    for (cur_i; cur_i < n; cur_i++) {
        try {
            var element = friend_list[cur_i];
            var now_w = Math.min(Math.floor((cur_i + 1) / n * 100 + 1), 100);
            window.progress_percent = now_w;
            
            if (!element.hasOwnProperty("city")) {
                continue;
            }
            var city = element.city;
            if (element.hasOwnProperty("country")) {
                var country = element.country;
            } else {
                continue;
            }
            var city_ru = element.city;
            var country_ru = element.country;
            if (element.hasOwnProperty("city_ru")) {city_ru = element.city_ru;}
            if (element.hasOwnProperty("country_ru")) {country_ru = element.country_ru;}
            if (country == "Russia" || country == "Ukraine") {
                country_ru = "";
                element.country_ru = "";
            }
            var nowkey = city + "#" + country;
            var coords = -1;
            if (nowkey in city_dict) {
                coords = city_dict[nowkey];
            } else {
                coords = getCoords(city, country);
                city_dict[nowkey] = coords;
            }
            if (coords == -1) {
                continue;
            }
            if (!city_clusters.hasOwnProperty(nowkey)) {
                city_clusters[nowkey] = {
                    coords: coords,
                    users: new Array(),
                    city_ru: city_ru,
                    country_ru: country_ru
                };
            }
            city_clusters[nowkey].users.push(element);
            var step_time = Date.now();
            if (step_time - cp_time > 1000 / 30) {
                cur_i++;
                break;
            }
        } catch(err) {
            console.log("I COUGHT in showFriendsCycle: " + err);
        }
    }

    reload_bar();
    if (cur_i < n) {
        requestAnimFrame(showFriendsCycle);
    } else {
        recalcZoom(1, true);
        console.log(city_clusters);
        city_arr = [];
        var loading_screen = document.getElementById("loading");
        loading_screen.style.visibility = "hidden";
        var loading_bar = document.getElementById("loading_bar");
        loading_bar.style.opacity = "0";
    }
}





async function tryShowFriends() {
    let vk_url = document.getElementById("vk_id").value;
    let vk_id = vk_url;
    if (vk_url.indexOf('vk') > -1) {
        vk_id = vk_url.slice(vk_url.indexOf('vk'));
        if (vk_id.indexOf('/') > -1) {
            vk_id = vk_id.split('/')[1];
            console.log(vk_id);
        }
    }
    getFriends(vk_id);
}





async function showFriends() {
    clearAllData();

    window.reload_bar_run = true;
    window.progress_percent = 0;
    reload_bar();

    last_time = Date.now();

    try {
        var loading_screen = document.getElementById("loading");
        loading_screen.style.visibility = "visible";
        var loading_bar = document.getElementById("loading_bar");
        loading_bar.style.opacity = "1";

        // let vk_id = document.getElementById("vk_id").value;
        var friends = window.friends;
        if (!friends.hasOwnProperty("status") || friends.status != "ok") {
            alert("Ошибка:??? TODO");
            return;
        }
        
        // frnds_ru = JSON.parse(friends["friends"].ru);

        // if (frnds_ru.hasOwnProperty("error")) {
        //     alert("Ошибка:\n\
        //             - Некорректный id\n\
        //             - Профиль закрытый\n\
        //             - Превышено количество запросов в секунду\n\
        //             Код ошибки: " + frnds_ru.error.error_code + "\n"
        //             + "Сообщение об ошибке: " + frnds_ru.error.error_msg);
        //     return;
        // }

        var fr_ru = friends.response[1][1].response.items.sort(function(a, b) {return a.id - b.id;});
        var fr_en = friends.response[2][1].response.items.sort(function(a, b) {return a.id - b.id;});

        var fr = [];

        console.log(fr_en);
        window.friend_list = [];
        fr_arr = fr_en;
        for (var i = 0; i < fr_arr.length; i++) {
            cur_user = element2user(fr_arr[i], fr_ru[i]);
            if (cur_user != -1) {
                window.friend_list.push(cur_user);
            }
        }
        console.log(friend_list);

        var currentId = 0;
        var nowi = 0;
        window.n = window.friend_list.length;

        showFriendsCycle();
    } catch(err) {
        console.log("I COUGHT: " + err);
        console.log(err.stack);
        // window.reload_bar_run = false;
    }
}

// citiesDB = https://silverfoxxxy.github.io/vk_fm/res/citiesDB_sorted.json
