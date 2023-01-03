

canvas = document.getElementById("graph_view");
var ctx = canvas.getContext("2d");
var cwidth = canvas.width;
var cheight = canvas.height;
const maxDelta = 300;


window.shake_p = 1;
window.nowDelta = maxDelta;
window.failShakeCnt = 0;

var zero_time = Date.now();
const dt = 20;
var shake_time = 1;
var rounds = 0;
var lastTime;
var on_pause = false;

// Graph View State:
// N = 0;
graph = [[1, 2],[0],[0]];
vertex = [{
            "text": "1",
            "pos": [10, 10]
        },
        {
            "text": "2",
            "pos": [100, 300]
        },
        {
            "text": "3",
            "pos": [250, 110]
        }];
// Normalized vertexes:
vertex_n = [];





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





function getPercent() {
    var maxd = maxDelta;
    var nowd = nowDelta + 1;
    return Math.min(100, Math.floor(100 * (1 - (Math.log(nowd + 1) - 1) / Math.log(maxd + 2)) + 1));
}





function main_cycle() {
    var now = Date.now();
    var nowr = Math.floor((now - zero_time) / dt);

    for (var i = rounds; i < nowr; i++) {
        // update();
        //if (!on_pause) {
        // .log((1000 / 60) / (shake_time + 0.001));
        // for (var j = 0; j < (1000 / 60) / (shake_time + 0.001); j++) {
        for (var j = 0; j < 4 + (1000 / 60) / (shake_time + 0.001); j++) {
            shakeGraph();
        }
        normalizeGraph();
        getPercent();
        render();
        //}

        rounds = nowr;
    }
    
    rounds = nowr;

    if (!on_pause) {
        requestAnimFrame(main_cycle);
    }
}





function main() {
    window.nowDelta = maxDelta;
    window.failShakeCnt = 0;
    zero_time = Date.now();
    shakeGraph();shakeGraph();shakeGraph();shakeGraph();shakeGraph();shakeGraph();shakeGraph();shakeGraph();shakeGraph();shakeGraph();
    shake_time = (Date.now() - zero_time) / 10;
    console.log("main");
    on_pause = false;
    main_cycle();
};





function init() {
    document.getElementById("input_n").value = "6";
    document.getElementById("input_graph").value = "0 2\n0 4\n0 5\n1 4\n1 5\n2 3\n2 4\n4 5";
    inputGraph();
    console.log("init");
    // terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    // document.getElementById('play-again').addEventListener('click', function() {
    //     reset();
    // });

    // reset();
    // lastTime = Date.now();
    main();
}





// Draw everything
function render() {
    renderProgress();
    ctx.fillStyle = "black";
    /*if (rounds % 20 < 10) {
        ctx.fillStyle = "black";
        //console.log("A");
    } else {
        ctx.fillStyle = "yellow";
        //console.log("B");
    }*/
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var u = 0; u < graph.length; u++) {
        for (var j = 0; j < graph[u].length; j++) {
            renderEdge(u, graph[u][j]);
        }
    }

    for (var i = 0; i < vertex.length; i++) {
        renderVertex(i);
    }

    // ctx.fillStyle = terrainPattern;
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    /*if (!isGameOver) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);*/
};





function renderProgress() {
    var progress = getPercent();
    var wh_bar = document.getElementById("white_bar");
    wh_bar.style.width = progress + "%";
    // var text_progress = document.getElementById("percents");
    // text_progress.innerHTML = "<b>" + progress + "</b>%";
}





function renderVertex(i) {
    var v = vertex_n[i];
    var nx = v.pos[0];
    var ny = v.pos[1];
    var nowk = Math.floor(Math.sqrt(vertex.length));
    var rad = Math.floor(45 / nowk);
    ctx.beginPath();
    ctx.moveTo(nx + rad, ny);
    ctx.lineWidth = Math.floor(12 / nowk);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.arc(nx, ny, rad, 0, Math.PI * 2, true); // Outer circle
    ctx.stroke();
    ctx.fill();

    ctx.font = Math.floor(55 / nowk) + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(v.text, nx, ny + Math.floor(rad * 2 / 4));
    /*ctx.moveTo(110, 75);
    ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye*/
}





function renderRandomGraph(n, p) {
    vertex = []
    graph = new Array(n);
    for (var i = 0; i < n; i++) {
        graph[i] = [];
        vertex.push({"text": String(i), "pos": [10, 10]});
    }
    for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
            if (Math.random() <= p) {
                graph[i].push(j);
                graph[j].push(i);
            }
        }
    }
}





function renderEdge(u, v) {
    nx1 = vertex_n[u].pos[0];
    ny1 = vertex_n[u].pos[1];
    nx2 = vertex_n[v].pos[0];
    ny2 = vertex_n[v].pos[1];

    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    ctx.moveTo(nx1, ny1);
    ctx.lineTo(nx2, ny2);
    ctx.stroke();

    ctx.beginPath();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";

    ctx.moveTo(nx1, ny1);
    ctx.lineTo(nx2, ny2);
    ctx.stroke();
    
}






/*
+ sqrt(dist(i, j))
+ 1 / (dist(i, j) ** 2)

E(u, v): 
+ dist(u, v)

E(u, v), i:
+ 1 / (dist(e, i) ** 2)

if e1 cross e2:
+ n ** 3



*/
function graphRate() {
    var Edges = [];
    var rate = 0;
    var big = 1000000000;
    var n = vertex.length;
    if (n == 0) {
        return 1;
    }
    if (n == 1) {
        return 1;
    }
    /*mindist = distanceSquare(vertex[0].pos, vertex[1].pos);
    for (var i = 0; i < vertex.length; i++) {
        for (var j = i + 1; j < vertex.length; j++) {
            mindist = Math.min(mindist, distanceSquare(vertex[i].pos, vertex[j].pos));
        }
    }
    if (mindist == 0) {
        return 1000000000000000000;
    }*/
    var base = 300;
    var base_sq = base * base;
    for (var i = 0; i < vertex.length; i++) {
        for (var j = i + 1; j < vertex.length; j++) {
            var nowds = distanceSquare(vertex[i].pos, vertex[j].pos) / base_sq;
            rate += Math.sqrt(Math.sqrt(nowds));
            rate += 1 / (nowds + 0.00000001);
        }
    }
    // console.log(graph);
    for (var i = 0; i < graph.length; i++) {
        // console.log(graph[i]);
        for (var j = 0; j < graph[i].length; j++) {
            var v = graph[i][j];
            if (i < v) {
                Edges.push([i, v]);
            }
            var nowds = distanceSquare(vertex[i].pos, vertex[v].pos) / base_sq;
            rate += Math.sqrt(nowds);
        }
    }

    for (var i = 0; i < vertex.length; i++) {
        for (var j = 0; j < Edges.length; j++) {
            var u = Edges[j][0];
            var v = Edges[j][1];
            if (u == i || v == i) {
                continue;
            }
            var nowdist = distancePointToLineSquared(vertex[i].pos[0], vertex[i].pos[1], vertex[u].pos[0], vertex[u].pos[1], vertex[v].pos[0], vertex[v].pos[1]);
            rate += base_sq / (nowdist + 0.00000000001);
            // console.log(nowdist);
        }
    }

    for (var i = 0; i < Edges.length; i++) {
        for (var j = i + 1; j < Edges.length; j++) {
            nowis = [];
            nowis.push(Edges[i][0]);
            nowis.push(Edges[i][1]);
            nowis.push(Edges[j][0]);
            nowis.push(Edges[j][1]);
            var flag = false;
            for (var k = 0; k < 4; k++) {
                for (var l = k + 1; l < 4; l++) {
                    if (nowis[k] == nowis[l]) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag) {
                continue;
            }
            nowps = [];
            for (var k = 0; k < 4; k++) {
                nowps[k] = vertex[nowis[k]].pos;
            }
            if (CrossingCheck(nowps[0], nowps[1], nowps[2], nowps[3])) {
                rate += n * n * n;
                // rate += big;
            }
        }
    }

    /*if (n >= 2) {
        var mindist = 1000000000000;
        var maxdist = -1;
        for (var i = 0; i < vertex.length; i++) {
            for (var j = i + 1; j < vertex.length; j++) {
                var nowd = distanceSquare(vertex[i].pos, vertex[j].pos);
                mindist = Math.min(nowd, mindist);
                maxdist = Math.max(nowd, maxdist);
            }
        }
        rate += big / 100 * maxdist / (mindist + 1);
    }*/

    console.log("Rate = " + rate);
    return rate;
}





function countPhysics() {

}





function genTest(k = 3) {
    var n = k * k;
    vertex = new Array(n);
    graph = new Array(n);
    for (var i = 0; i < n; i++) {
        vertex[i] = {"text": String(i), "pos": [10,10]};
        graph[i] = [];
    }
    for (var i = 0; i < n; i++) {
        if (i % k != k - 1) {
            graph[i].push(i + 1);
            graph[i + 1].push(i);
        }
        if (i < n - k) {
            graph[i].push(i + k);
            graph[i + k].push(i);
        }
    }
}





function normalizeGraph() {
    var zero_x = 0;
    var zero_y = 0;

    var n = vertex.length;
    if (n == 0) {
        return;
    }

    vertex_n = new Array(n);
    for (var i = 0; i < vertex.length; i++) {
        vertex_n[i] = vertex[i];
    }
    var minx = vertex_n[0].pos[0];
    var maxx = vertex_n[0].pos[0];
    var miny = vertex_n[0].pos[1];
    var maxy = vertex_n[0].pos[1];
    for (var i = 0; i < vertex.length; i++) {
        minx = Math.min(minx, vertex_n[i].pos[0]);
        maxx = Math.max(maxx, vertex_n[i].pos[0]);
        miny = Math.min(miny, vertex_n[i].pos[1]);
        maxy = Math.max(maxy, vertex_n[i].pos[1]);
    }

    var ltx = minx - 30;
    var lty = miny - 30;
    var rbx = maxx + 30;
    var rby = maxy + 30;

    zero_x = Math.floor((ltx + rbx) / 2);
    zero_y = Math.floor((lty + rby) / 2);
    var coeff = 1;
    if (cwidth < (maxx - minx + 100)) {
        coeff = cwidth / (maxx - minx + 100);
    }
    if (cheight < (maxy - miny + 100)) {
        coeff = Math.min(coeff, cheight / (maxy - miny + 100));
    }

    for (var i = 0; i < vertex_n.length; i++) {
        vertex_n[i].pos[0] -= zero_x;
        vertex_n[i].pos[0] *= coeff;
        vertex_n[i].pos[0] = Math.floor(vertex_n[i].pos[0] + cwidth / 2);
        vertex_n[i].pos[1] -= zero_y;
        vertex_n[i].pos[1] *= coeff;
        vertex_n[i].pos[1] = Math.floor(vertex_n[i].pos[1] + cheight / 2);
    }
}





function shakeGraph() {
    if (nowDelta > 0) {
        // console.log(nowDelta, failShakeCnt);
        var n = vertex.length;
        var nowRate = graphRate();
        let deltax = new Array(n)
        deltax = deltax.fill(0);
        let deltay = new Array(n);
        deltay = deltay.fill(0);
        for (var i = 0; i < vertex.length; i++) {
            if (Math.random() <= shake_p) {
                deltax[i] = Math.floor((Math.random() - 0.5) * 2 * nowDelta / shake_p);
                deltay[i] = Math.floor((Math.random() - 0.5) * 2 * nowDelta / shake_p);
                vertex[i].pos[0] += deltax[i];
                vertex[i].pos[1] += deltay[i];
            }
        }
        var newRate = graphRate();
        if (newRate >= nowRate) {
            for (var i = 0; i < vertex.length; i++) {
                vertex[i].pos[0] -= deltax[i];
                vertex[i].pos[1] -= deltay[i];
            }
            failShakeCnt++;
        }
        if (failShakeCnt >= (20) / shake_p) {
            if (shake_p * n * 0.6 >= 3) {
                shake_p *= 0.6;
                failShakeCnt = 0;
            } else {
                shake_p = 1;
                nowDelta *= 0.95;
                nowDelta = Math.floor(nowDelta);
                if (nowDelta == 0) {
                    on_pause = true;
                }
                failShakeCnt = 0;
            }
        }
    }
}





function distanceSquare(pos1, pos2) {
    return Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2);
}





function pause_view() {
    var pause_bttn = document.getElementById("pause_bttn");
    on_pause = !on_pause;
    
    if (on_pause) {
        pause_bttn.innerHTML = "play";
    }
    else {
        pause_bttn.innerHTML = "stop";
        main();
    }
}






function render_view() {
    inputGraph();
    main();
}





function render_random_view() {
    n = parseInt(document.getElementById("input_rand_n").value);
    p = parseFloat(document.getElementById("input_rand_p").value);
    renderRandomGraph(n, p);
    main();
}





function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch(code) {
    case 32:
        key = 'SPACE';
        if (!document.getElementById('input_graph').hasFocus) {
            pause_view();
        }
        break;
    case 13:
        key = 'ENTER';
        // render_view();
    default:
        // Convert ASCII codes to letters
        // key = String.fromCharCode(code);
    }

    // pressedKeys[key] = status;
}





function inputGraph() {
    console.log("on Input");
    var ntxt = document.getElementById("input_n").value;
    var nowtxt = document.getElementById("input_graph").value;
    var lines = nowtxt.split("\n");
    var n = parseInt(ntxt);
    var Edges = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(" ");
        if (line.length >= 2) {
            var u = parseInt(line[0]);
            var v = parseInt(line[1]);
            Edges.push([u, v]);
        }
    }
    console.log(Edges.length);
    console.log(Edges);
    vertex = new Array(n);
    graph = new Array(n);
    console.log(graph);
    for (var i = 0; i < n; i++) {
        vertex[i] = {
            "text": String(i),
            "pos": [10, 10]
        }
        graph[i] = [];
    }

    for (var i = 0; i < Edges.length; i++) {
        var u = Edges[i][0];
        var v = Edges[i][1];
        graph[u].push(v);
        graph[v].push(u);
        console.log(graph);
    }
    console.log(graph);
}





document.addEventListener('keydown', function(e) {
    setKey(e, true);
});





function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}





function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}





function distancePointToLineSquared(x, y, x1, y1, x2, y2)
{
    A = x - x1;
    B = y - y1;
    C = x2 - x1;
    D = y2 - y1;
 
    dot = A * C + B * D;
    len_sq = C * C + D * D;
    param = -1;
    if (len_sq != 0) {
        param = dot / len_sq;
    }
    xx = yy = 0;
 
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
  
    dx = x - xx;
    dy = y - yy;
    
    // console.log(Math.sqrt(dx * dx + dy * dy));
    return dx * dx + dy * dy;
}





function VEK(ax,ay,bx,by)//векторное произведение
{
    return ax*by-bx*ay;
}
 
function CrossingCheck(t1,t2,t3,t4) //проверка пересечения
{
    var v1,v2,v3,v4;

    v1=VEK(t4[0] - t3[0], t4[1] - t3[1], t1[0] - t3[0], t1[1] - t3[1]);

    v2=VEK(t4[0] - t3[0], t4[1] - t3[1], t2[0] - t3[0], t2[1] - t3[1]);

    v3=VEK(t2[0] - t1[0], t2[1] - t1[1], t3[0] - t1[0], t3[1] - t1[1]);

    v4=VEK(t2[0] - t1[0], t2[1] - t1[1], t4[0] - t1[0], t4[1] - t1[1]);

    // console.log(v1, v2, v3, v4);
    if(v1*v2<=0 && v3*v4<=0) return true;
    else return false;
}





function print_random_view() {
    nowtxt = "";
    nowtxt += String(vertex.length);
    for (var i = 0; i < vertex.length; i++) {
        for (var j = 0; j < graph[i].length; j++) {
            var v = graph[i][j];
            if (i < v) {
                nowtxt += "\n" + String(i) + " " + String(v);
            }
        }
    }
    document.getElementById("random_graph").innerHTML = nowtxt;
}





//console.log(CrossingCheck([0,0],[100,100],[100,0],[0,100]));
//console.log(distancePointToLine(0, 0, 100, 0, 0, 100));




init();


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



