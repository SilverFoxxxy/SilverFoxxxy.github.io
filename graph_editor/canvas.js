

canvas = document.getElementById("graph_view");
var ctx = canvas.getContext("2d");
var mindir = Math.min(window.innerWidth, window.innerHeight * 0.8);

var cur_i = -1;
var canvas_clicked = false;
// ctx.canvas.width = Math.floor(mindir * 0.9);
// ctx.canvas.height = Math.floor(mindir * 0.9);
ctx.canvas.width = 1000;
ctx.canvas.height = 1000;
canvas.style.width = String(Math.floor(mindir * 0.9)) + "px";
canvas.style.width = String(Math.floor(mindir * 0.9)) + "px";
var cwidth = canvas.width;
var cheight = canvas.height;
const maxDelta = 300;

window.lastScore = -1;
window.shake_p = 1;
window.nowDelta = maxDelta;
window.failShakeCnt = 0;
var base = 300;
var base_sq = base * base;

var zero_time = Date.now();
const dt = 20;
var shake_time = 1;
var rounds = 0;
var lastTime;
var on_pause = false;
var shake_finished = false;

// Graph View State:
// N = 0;
n = 3;
graph = [[1, 2],[0],[0]];
vertex = [[10, 10], [100, 300], [250, 110]];
vertex_text = [];
short_path = [];

is_vertex_changed = [];
vertex_orig = [];
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
    var nowd = nowDelta + 0.5;
    //console.log("percents");
    //console.log(Math.log(nowd + 1), Math.log(maxd + 2));
    //console.log((1 - (Math.log(nowd + 1)) / Math.log(maxd + 2)));
    return Math.min(100, Math.floor(100 * (1 - (Math.log(nowd + 0.1)) / Math.log(maxd + 2))) + 1);
}





function main_cycle() {
    if (!shake_finished) {
        document.getElementById("progress_bar").style.filter = "brightness(100%)";
    } else {
        document.getElementById("progress_bar").style.filter = "brightness(0%)";
        pause_view();
    }
    var step_time = Date.now();
    var nowr = Math.floor((step_time - zero_time) / dt);

    //for (var i = rounds; i < nowr; i++) {
        // if (shake_finished) {
        //     // for (var i = rounds; i < nowr; i++) {
        //     for (var j = 0; j < 50; j++) {
        //         // countPhysics();
        //     }
        //     normalizeGraph();
        //     // getPercent();
        //     render();
        // }
        // update();
        //if (!on_pause) {
        // .log((1000 / 60) / (shake_time + 0.001));
        // for (var j = 0; j < (1000 / 60) / (shake_time + 0.001); j++) {
        if (!shake_finished) {
            for (var j = 0; j < 1000; j++) {
                shakeGraph();
                var nowt = Date.now();
                if (nowt - step_time > 1000 / 60) {
                    break;
                } 
            }
            normalizeGraph();
            getPercent();
            render();
            //}

            rounds = nowr;
        }
    // }
    
    rounds = nowr;

    if (!on_pause) {
        requestAnimFrame(main_cycle);
    }
}





function start_cycle() {
    zero_time = Date.now();
    main_cycle();
}





function main() {
    print_graph();
    shake_finished = false;
    window.n = vertex.length;
    var m = 0;
    for (var i = 0; i < vertex.length; i++) {
        m += graph[i].length;
    }
    console.log(m);
    if (m > 250 || vertex.length > 100) {
        alert("Your graph is TOO BIG to show\nMAX Vertex number is 100\nMAX Edge number is 125\n\nRANDOM GRAPH WILL BE GENERATED");
        init();
    }
    calc_all_dist();
    window.nowDelta = maxDelta;
    window.failShakeCnt = 0;
    lastScore = -1;
    // for (var i = 0; i < 10; i++) {
    //     shakeGraph();
    // }
    // shake_time = (Date.now() - zero_time) / 10;
    console.log("main");
    on_pause = true;
    pause_view();
    start_cycle();
};





function init() {
    // document.getElementById("input_n").value = "6";
    // document.getElementById("input_graph").value = "0 2\n0 4\n0 5\n1 4\n1 5\n2 3\n2 4\n4 5";
    // inputGraph();
    var n0 = 10 + Math.floor(Math.random() * 6);
    var p0 = (0.2 + Math.random() * 0.25) * 10 / n0;
    renderRandomGraph(n0, p0);
    main();
    // console.log("init");
    // terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    // document.getElementById('play-again').addEventListener('click', function() {
    //     reset();
    // });

    // reset();
    // lastTime = Date.now();
    // main();
}





// Draw everything
function render(nowi = -1) {
    // console.log(nowi);
    // console.log("rerender");
    renderProgress();
    ctx.fillStyle = "black";
    flag = -1;
    if (nowi == -1) {
        flag = false;
    }
    /*if (rounds % 20 < 10) {
        ctx.fillStyle = "black";
        //console.log("A");
    } else {
        ctx.fillStyle = "yellow";
        //console.log("B");
    }*/
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    vertex_light = new Array(n);
    vertex_light = vertex_light.fill(false);

    if (nowi != -1) {
        vertex_light[nowi] = true;
        for (var i = 0; i < graph[nowi].length; i++) {
            vertex_light[graph[nowi][i]] = 1;
        }
    }

    var edge_light = [];
    for (var u = 0; u < graph.length; u++) {
        for (var j = 0; j < graph[u].length; j++) {
            if (u == nowi || graph[u][j] == nowi) {
                edge_light.push([u, graph[u][j]]);
                // renderEdge(u, graph[u][j], true);
            } else {
                renderEdge(u, graph[u][j], flag);
            }
        }
    }
    for (var i = 0; i < edge_light.length; i++) {
        var u = edge_light[i][0];
        var v = edge_light[i][1];
        renderEdge(u, v, 1);
    }

    for (var i = 0; i < vertex.length; i++) {
        if (vertex_light[i]) {
            renderVertex(i, 1);
        } else {
            renderVertex(i, flag);
        }
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


function getVertexRad() {
    var nowk = cwidth / 600 * 1.5 / Math.sqrt(vertex.length);
    var rad = Math.floor(45 * nowk);
    return [nowk, rad];
}


function renderVertex(i, flag = false) {
    const computedStyle = getComputedStyle(canvas);
    var mag_fill = computedStyle.getPropertyValue('--magic-fill');
    var mag_backfill = computedStyle.getPropertyValue('--magic-backfill');
    var v = vertex_n[i];
    var nx = v[0];
    var ny = v[1];
    var nowrk = getVertexRad();
    var nowk = nowrk[0];
    var rad = nowrk[1];
    ctx.beginPath();
    ctx.moveTo(nx + rad, ny);
    ctx.lineWidth = Math.floor(12 * nowk);
    ctx.strokeStyle = mag_fill;
    if (flag) {
        ctx.strokeStyle = mag_backfill;
    }
    ctx.fillStyle = "black";

    // if (current_theme == "white") {
    //     ctx.strokeStyle = "white";
    //     ctx.fillStyle = "black";
    //     if (flag == 1) {
    //         ctx.strokeStyle = "white";
    //         // ctx.setLineDash([10]);
    //     }
    // }


    ctx.arc(nx, ny, rad, 0, Math.PI * 2, true); // Outer circle
    ctx.stroke();
    ctx.fill();
    // ctx.setLineDash([]);

    if (current_theme == "white") {
        rad = Math.floor(rad * 0.87);
    } else {
        rad = Math.floor(rad * 0.92);
    }


    ctx.beginPath();
    ctx.moveTo(nx + rad, ny);
    ctx.lineWidth = Math.floor(12 * nowk);
    ctx.strokeStyle = mag_fill;
    if (flag == -1) {
        ctx.strokeStyle = mag_backfill;
    }
    ctx.fillStyle = "black";

    if (flag == 1) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = mag_backfill;
    }
    if (current_theme == "white") {
        if (flag == 1) {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "red";
            // ctx.lineWidth = Math.floor(10 * nowk);
            // ctx.strokeStyle = "white";
            // ctx.setLineDash([10, 10]);
            // ctx.strokeStyle = "red";
        } else {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
        }
    }

    ctx.arc(nx, ny, rad, 0, Math.PI * 2, true); // Outer circle
    ctx.stroke();
    ctx.fill();
    

    ctx.font = Math.floor(55 * nowk) + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(vertex_text[i], nx, ny + Math.floor(rad * 2 / 4));
    /*ctx.moveTo(110, 75);
    ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye*/
}





function renderRandomGraph(n, p) {
    vertex = new Array(n);
    vertex_text = new Array(n);
    graph = new Array(n);
    for (var i = 0; i < n; i++) {
        graph[i] = [];
        vertex[i] = [10, 10];
        vertex_text[i] = String(i);
    }
    m = 0;
    for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
            if (Math.random() <= p) {
                m++;
                graph[i].push(j);
                graph[j].push(i);
            }
        }
    }
    // if (p > 0 && m == 0 && n >= 5) {
    //     v = Math.floor(Math.random() * (n - 1.1));
    //     u = (v + 1 + Math.floor(Math.random() * (n - 1.1))) % n;
    //     graph[u].push(v);
    //     graph[v].push(u);
    // }
}





function renderEdge(u, v, flag = false) {
    nx1 = vertex_n[u][0];
    ny1 = vertex_n[u][1];
    nx2 = vertex_n[v][0];
    ny2 = vertex_n[v][1];

    const computedStyle = getComputedStyle(canvas);
    var mag_fill = computedStyle.getPropertyValue('--magic-fill');
    var mag_backfill = computedStyle.getPropertyValue('--magic-backfill');

    ctx.beginPath();

    ctx.lineWidth = 8;

    if (current_theme == "white") {
        ctx.strokeStyle = "white";
        if (flag == 1) {
            // nowlen = Math.sqrt(distanceSquare(vertex_n[u], vertex_n[v]));
            // cnt = Math.floor(nowlen / 25);
            // if (cnt % 2 == 0) {
            //     cnt++;
            // }
            // ctx.setLineDash([Math.floor(nowlen / cnt)]);
        }
    }

    ctx.strokeStyle = mag_fill;
    if (flag == -1) {
        ctx.strokeStyle = mag_backfill;
    }

    ctx.moveTo(nx1, ny1);
    ctx.lineTo(nx2, ny2);
    ctx.stroke();
    // ctx.setLineDash([]);

    // if (!(current_theme == "white" && flag)) {
    if (true) {
        ctx.beginPath();

        ctx.lineWidth = 4;
        ctx.strokeStyle = mag_fill;
        if (flag == 1) {
            ctx.strokeStyle = "white";
        }
        if (flag == -1) {
            ctx.strokeStyle = mag_backfill;
        }
        if (current_theme == "white") {
            ctx.strokeStyle = "black";
            if (flag == 1) {
                // ctx.strokeStyle = "black";
                ctx.strokeStyle = "red";
            }
        }

        ctx.moveTo(nx1, ny1);
        ctx.lineTo(nx2, ny2);
        ctx.stroke();
    }
}





function checkChanged(a) {
    for (var i = 0; i < a.length; i++) {
        if (is_vertex_changed[a[i]]) {
            return true;
        }
    }
    return false;
}





function scoreDist(pos1, pos2) {
    var nowds = distanceSquare(pos1, pos2) / base_sq;
    return (Math.sqrt(Math.sqrt(nowds)) + 1 / (nowds + 0.00000001));
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

// var cnt_dist = 0;
// var cnt_cross = 0;
// var cnt_line = 0;

function graphRateBfs() {
    // console.log("BBB");

    var Edges = [];
    var rate = 0;
    var score = 0;
    var oldrate = 0;
    var big = 1000000000;

    n = vertex.length;

    if (n == 0) {
        return 1;
    }
    if (n == 1) {
        return 1;
    }

    var base = 300;
    var base_sq = base * base;
    for (var i = 0; i < vertex.length; i++) {
        for (var j = i + 1; j < vertex.length; j++) {
            var nowd = distanceSquare(vertex[i], vertex[j]) / base_sq;
            var flag = false;
            score += 1 / (nowd + 0.00000001);
            // score += scoreDist(vertex[i], vertex[j]);
            if (short_path[i][j] == -1) {
                // var nowds0 = Math.sqrt((nowd) / base_sq);
                score += Math.sqrt(nowd) / n;
            } else {
                // var nowds0 = Math.sqrt((nowd) / base_sq);
                score += Math.pow(Math.sqrt(nowd) - short_path[i][j], 2);
            }
        }
    }
    // console.log(score);
    for (var i = 0; i < graph.length; i++) {
        for (var j = 0; j < graph[i].length; j++) {
            var v = graph[i][j];
            if (i < v) {
                Edges.push([i, v]);
            }
        }
    }
    // console.log(score);
    for (var i = 0; i < vertex.length; i++) {
        for (var j = 0; j < Edges.length; j++) {
            var u = Edges[j][0];
            var v = Edges[j][1];
            if (u == i || v == i) {
                continue;
            }
            var nowds0 = distancePointToLineSquared(vertex[i][0], vertex[i][1], vertex[u][0], vertex[u][1], vertex[v][0], vertex[v][1]);
            score += base_sq / (nowds0 + 0.00000000001);
        }
    }

    console.log(score);
    return score;
}


function graphRate() {
    // console.log("AAA");
    // return graphRateBfs();
    cnt_dist = 0;
    cnt_cross = 0;
    cnt_line = 0;
    var Edges = [];
    var rate = 0;
    var score = 0;
    var oldrate = 0;
    var big = 1000000000;
    n = vertex.length;
    if (n == 0) {
        return 1;
    }
    if (n == 1) {
        return 1;
    }
    full_score = true;
    // 80
    // var full_score = (shake_p == 1) || lastScore == -1;
    // 40
    /*mindist = distanceSquare(vertex[0], vertex[1]);
    for (var i = 0; i < vertex.length; i++) {
        for (var j = i + 1; j < vertex.length; j++) {
            mindist = Math.min(mindist, distanceSquare(vertex[i], vertex[j]));
        }
    }
    if (mindist == 0) {
        return 1000000000000000000;
    }*/
    var base = 300;
    var base_sq = base * base;
    for (var i = 0; i < vertex.length; i++) {
        for (var j = i + 1; j < vertex.length; j++) {
            /*
            var nowds = distanceSquare(vertex[i], vertex[j]) / base_sq;
            rate += Math.sqrt(Math.sqrt(nowds));
            rate += 1 / (nowds + 0.00000001);
            */
            
            var flag = false;
            if (full_score) {
                score += scoreDist(vertex[i], vertex[j]);
                // console.log("WTF");
                // rate += scoreDist(vertex[i], vertex[j]);
            } else {
                // console.log("BINGO2");
                // console.log(i, j);
                // console.log(is_vertex_changed[i], is_vertex_changed[j]);
                if (checkChanged([i, j])) {
                    // console.log("here");
                    rate += scoreDist(vertex[i], vertex[j]);
                    oldrate += scoreDist(vertex_orig[i], vertex_orig[j]);
                    //console.log(i, j);
                    //console.log(vertex);
                    //console.log(vertex_orig);
                }
            }
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
            /*
            var nowds = distanceSquare(vertex[i], vertex[v]) / base_sq;
            rate += Math.sqrt(nowds);
            */
            
            if (full_score) {
                var nowds0 = Math.sqrt(distanceSquare(vertex[i], vertex[v]) / base_sq);
                score += nowds0;
                //var nowds = Math.sqrt(distanceSquare(vertex[i], vertex[v]) / base_sq);
                //rate += nowds;
            } else if (checkChanged([i, v])) {
                var nowds = Math.sqrt(distanceSquare(vertex[i], vertex[v]) / base_sq);
                rate += nowds;
                var oldds = Math.sqrt(distanceSquare(vertex_orig[i], vertex_orig[v]) / base_sq);
                oldrate += oldds;
            }
        }
    }

    for (var i = 0; i < vertex.length; i++) {
        for (var j = 0; j < Edges.length; j++) {
            var u = Edges[j][0];
            var v = Edges[j][1];
            if (u == i || v == i) {
                continue;
            }
            /*
            var nowdist = distancePointToLineSquared(vertex[i][0], vertex[i][1], vertex[u][0], vertex[u][1], vertex[v][0], vertex[v][1]);
            rate += base_sq / (nowdist + 0.00000000001);
            */
            
            if (full_score) {
                var nowds0 = distancePointToLineSquared(vertex[i][0], vertex[i][1], vertex[u][0], vertex[u][1], vertex[v][0], vertex[v][1]);
                score += base_sq / (nowds0 + 0.00000000001);
                // var nowds = distancePointToLineSquared(vertex[i][0], vertex[i][1], vertex[u][0], vertex[u][1], vertex[v][0], vertex[v][1]);;
                // rate += base_sq / (nowds + 0.00000000001);
            } else if (checkChanged([u, i, v])) {
                var nowds = distancePointToLineSquared(vertex[i][0], vertex[i][1], vertex[u][0], vertex[u][1], vertex[v][0], vertex[v][1]);
                rate += base_sq / (nowds + 0.00000000001);
                var oldds = distancePointToLineSquared(vertex_orig[i][0], vertex_orig[i][1], vertex_orig[u][0], vertex_orig[u][1], vertex_orig[v][0], vertex_orig[v][1]);
                oldrate += base_sq / (oldds + 0.00000000001);
            }
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
            if (full_score) {
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
                nowps = new Array(4);
                for (var k = 0; k < 4; k++) {
                    nowps[k] = vertex[nowis[k]];
                }
                if (CrossingCheck(nowps[0], nowps[1], nowps[2], nowps[3])) {
                    // rate += n * n * n * Math.sqrt(Math.sqrt(distanceSquare(nowps[0], nowps[1]) * distanceSquare(nowps[2], nowps[3])));
                    score += n * n * n;
                    // rate += big;
                }
            } else if (checkChanged(nowis)) {
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
                nowps = new Array(4);
                for (var k = 0; k < 4; k++) {
                    nowps[k] = vertex[nowis[k]];
                }
                if (CrossingCheck(nowps[0], nowps[1], nowps[2], nowps[3])) {
                    // rate += n * n * n * Math.sqrt(Math.sqrt(distanceSquare(nowps[0], nowps[1]) * distanceSquare(nowps[2], nowps[3])));
                    rate += n * n * n;
                    // rate += big;
                }
                oldps = new Array(4);
                for (var k = 0; k < 4; k++) {
                    oldps[k] = vertex_orig[nowis[k]];
                }
                if (CrossingCheck(oldps[0], oldps[1], oldps[2], oldps[3])) {
                    oldrate += n * n * n;
                }
            }
        }
    }

    // console.log(cnt_dist, cnt_line, cnt_cross, shake_p);
    if (lastScore == -1) {
        // lastScore = score;
        return score;
    }
    if (full_score) {
        // if (rate == score) {
        //     console.log("ALARM!");
        //     console.log(score, lastScore + rate - oldrate);
        // }
        // lastScore = Math.min(lastScore, score);
        return score;
    } else {
        // console.log("***");
        // console.log(score, lastScore + rate - oldrate);
        // console.log(score, lastScore, rate, oldrate);
        // console.log(score, "\n", rate);
        // console.log(lastScore, "\n", oldrate);
        var res = lastScore + rate - oldrate;
        // lastScore = Math.min(lastScore, score);
        return res;
    }
    /*if (n >= 2) {
        var mindist = 1000000000000;
        var maxdist = -1;
        for (var i = 0; i < vertex.length; i++) {
            for (var j = i + 1; j < vertex.length; j++) {
                var nowd = distanceSquare(vertex[i], vertex[j]);
                mindist = Math.min(nowd, mindist);
                maxdist = Math.max(nowd, maxdist);
            }
        }
        rate += big / 100 * maxdist / (mindist + 1);
    }*/

    // console.log("Rate = " + rate);
    return score;
}





function countPhysics() {
    if (lastScore == -1) {
        lastScore = graphRateBfs();
    }
    let deltax = new Array(n)
    let deltay = new Array(n);
    deltax = deltax.fill(0);
    deltay = deltay.fill(0);

    var step = 10 + Math.floor((Math.random() - 0.5) * 50 * 2);

    // console.log(vertex);
    for (var i = 0; i < vertex.length; i++) {
        if (Math.random() <= shake_p) {
            is_vertex_changed[i] = true;
            deltax[i] = Math.floor((Math.random() - 0.5) * 2 * step);
            deltay[i] = Math.floor((Math.random() - 0.5) * 2 * step);
            vertex[i][0] += deltax[i];
            vertex[i][1] += deltay[i];
        }
    }
    var newRate = -1;
    newRate = graphRateBfs();
    // console.log(lastScore);
    // console.log(newRate);
    if (newRate >= lastScore) {
        for (var i = 0; i < vertex.length; i++) {
            vertex[i][0] -= deltax[i];
            vertex[i][1] -= deltay[i];
        }
        failShakeCnt++;
    }
    // console.log(vertex_orig);
    if (lastScore > newRate) {
        lastScore = newRate;
    }
}





function genTest(k = 3) {
    var n = k * k;
    vertex = new Array(n);
    graph = new Array(n);
    for (var i = 0; i < n; i++) {
        vertex[i] = [10,10];
        vertex_text[i] = String(i);
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
        vertex_n[i] = [0, 0];
        vertex_n[i][0] = vertex[i][0];
        vertex_n[i][1] = vertex[i][1];
    }
    var minx = vertex_n[0][0];
    var maxx = vertex_n[0][0];
    var miny = vertex_n[0][1];
    var maxy = vertex_n[0][1];
    for (var i = 0; i < vertex.length; i++) {
        minx = Math.min(minx, vertex_n[i][0]);
        maxx = Math.max(maxx, vertex_n[i][0]);
        miny = Math.min(miny, vertex_n[i][1]);
        maxy = Math.max(maxy, vertex_n[i][1]);
    }

    var ltx = minx - 30;
    var lty = miny - 30;
    var rbx = maxx + 30;
    var rby = maxy + 30;

    zero_x = Math.floor((ltx + rbx) / 2);
    zero_y = Math.floor((lty + rby) / 2);
    var coeff = 1;
    var maxrad = 80;
    if (cwidth < (maxx - minx + maxrad * 2)) {
        coeff = (cwidth - maxrad * 2) / (maxx - minx);
    }
    if (cheight < (maxy - miny + maxrad * 2)) {
        coeff = Math.min(coeff, (cheight - maxrad * 2) / (maxy - miny));
    }

    for (var i = 0; i < vertex_n.length; i++) {
        vertex_n[i][0] -= zero_x;
        vertex_n[i][0] *= coeff;
        vertex_n[i][0] = Math.floor(vertex_n[i][0] + cwidth / 2);
        vertex_n[i][1] -= zero_y;
        vertex_n[i][1] *= coeff;
        vertex_n[i][1] = Math.floor(vertex_n[i][1] + cheight / 2);
    }
}






function shakeGraph(score_t = 0) {
    // console.log("shake");
    // if (shake_finished) {
    //     score_t = 1;
    // }
    if (nowDelta > 0) {
        // console.log(nowDelta, failShakeCnt);
        window.n = vertex.length;
        // var nowRate = lastScore;
        let deltax = new Array(n)
        let deltay = new Array(n);
        deltax = deltax.fill(0);
        deltay = deltay.fill(0);

        is_vertex_changed = new Array(n);
        vertex_orig = new Array(n);
        is_vertex_changed = is_vertex_changed.fill(false);

        // console.log(vertex);
        for (var i = 0; i < vertex.length; i++) {
            vertex_orig[i] = [0, 0];
            vertex_orig[i][0] = vertex[i][0];
            vertex_orig[i][1] = vertex[i][1];
            if (Math.random() <= shake_p) {
                // console.log(vertex_orig[i]);
                is_vertex_changed[i] = true;
                deltax[i] = Math.floor((Math.random() - 0.5) * 2 * nowDelta / shake_p);
                deltay[i] = Math.floor((Math.random() - 0.5) * 2 * nowDelta / shake_p);
                vertex[i][0] += deltax[i];
                vertex[i][1] += deltay[i];
                // console.log(vertex[i], vertex_orig[i]);
            }
        }
        // console.log(window.is_vertex_changed);
        // console.log(vertex_orig);
        // console.log(vertex);
        var newRate = -1;
        //if (score_t == 0) {
            newRate = graphRate();
        //}
        //if (score_t == 1) {
        //    newRate = graphRateBfs();
        //}
        // console.log(lastScore);
        // console.log(newRate);
        if (newRate >= lastScore && lastScore != -1) {
            for (var i = 0; i < vertex.length; i++) {
                vertex[i][0] -= deltax[i];
                vertex[i][1] -= deltay[i];
            }
            failShakeCnt++;
        }
        // console.log(vertex_orig);
        if (lastScore == -1 || lastScore > newRate) {
            lastScore = newRate;
        }
        // }
        if (failShakeCnt >= (20) / shake_p) {
            if (shake_p * n * 0.6 >= 3) {
                shake_p *= 0.6;
                failShakeCnt = 0;
            } else {
                shake_p = 1;
                nowDelta *= 0.95;
                nowDelta = Math.floor(nowDelta);
                // if (nowDelta == 0) {
                //     on_pause = true;
                // }
                failShakeCnt = 0;
            }
        }
    } else {
        // if (score_t == 0) {
            shake_finished = true;
            lastScore = -1;
        //    lastScore = -1;
        //    nowDelta = base * 0.7;
        //}
        //if (score_t == 1) {
            // on_pause = false;
            // pause_view();
        //}
    }
}





function distanceSquare(pos1, pos2) {
    // cnt_dist++;
    return Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2);
}





function pause_view() {
    var pause_bttn = document.getElementById("pause_bttn");
    var pause_bttn1 = document.getElementById("pause_bttn1");
    on_pause = !on_pause;
    
    if (on_pause) {
        pause_bttn.innerHTML = "play";
        pause_bttn1.innerHTML = "play";
    }
    else {
        pause_bttn.innerHTML = "stop";
        pause_bttn1.innerHTML = "stop";
        start_cycle();
    }
}






function render_view() {
    inputGraph();
    main();
}





function render_random_view() {
    try {
        n = parseInt(document.getElementById("input_rand_n").value);
        p = parseFloat(document.getElementById("input_rand_p").value);
        renderRandomGraph(n, p);
    } catch(err) {
        alert("failed to generate graph");
    }
    main();
}





function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch(code) {
    case 32:
        key = 'SPACE';
        /*if (!document.getElementById('input_graph').hasFocus) {
            pause_view();
        }*/
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
    // console.log("on Input");
    try {
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
        // console.log(Edges.length);
        // console.log(Edges);
        vertex = new Array(n);
        graph = new Array(n);
        // console.log(graph);
        for (var i = 0; i < n; i++) {
            vertex[i] = [10, 10];
            vertex_text[i] = String(i);
            graph[i] = [];
        }

        for (var i = 0; i < Edges.length; i++) {
            var u = Edges[i][0];
            var v = Edges[i][1];
            graph[u].push(v);
            graph[v].push(u);
            // console.log(graph);
        }
        // console.log(graph);
    } catch(err) {
        alert("incorrect input");
    }
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
    ctx.translate(entity[0], entity[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}





function distancePointToLineSquared(x, y, x1, y1, x2, y2)
{
    // cnt_line++;
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
    return ax * by - bx * ay;
}

function CrossingCheck(t1,t2,t3,t4) //проверка пересечения
{
    // cnt_cross++;
    var v1, v2, v3, v4;

    dv34x = t4[0] - t3[0];
    dv34y = t4[1] - t3[1];

    dv13x = t1[0] - t3[0];
    dv13y = t1[1] - t3[1];

    v1=VEK(dv34x, dv34y, dv13x, dv13y);

    v2=VEK(dv34x, dv34y, t2[0] - t3[0], t2[1] - t3[1]);

    if (v1 * v2 > 0) {
        return false;
    }


    dv21x = t2[0] - t1[0];
    dv21y = t2[1] - t1[1];
    v3=VEK(dv21x, dv21y, - dv13x, - dv13y);

    v4=VEK(dv21x, dv21y, t4[0] - t1[0], t4[1] - t1[1]);

    // console.log(v1, v2, v3, v4);
    if (v3 * v4 <=0) return true;
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





function print_graph() {
    document.getElementById("input_n").value = String(vertex.length);
    // nowtxt = "";
    // nowtxt += String(vertex.length);
    nowtxt = "";
    for (var i = 0; i < vertex.length; i++) {
        for (var j = 0; j < graph[i].length; j++) {
            var v = graph[i][j];
            if (i < v) {
                if (nowtxt != "") {
                    nowtxt += "\n";
                }
                nowtxt += String(i) + " " + String(v);
            }
        }
    }
    document.getElementById("random_graph").innerHTML = String(vertex.length) + "\n" + nowtxt;
    document.getElementById("input_graph").value = nowtxt;
}





function calc_all_dist() {
    // console.log("AAA");
    short_path = new Array(n);
    for (var i = 0; i < n; i++) {
        bfs(i);
    }
}





function bfs(u) {
    v_queue = [];
    v_queue.push([u, 0]);

    used = new Array(n);
    now_dist = new Array(n);

    used.fill(false);
    now_dist = now_dist.fill(-1);

    now_dist[u] = 0;

    nowi = 0;
    while (true) {
        if (v_queue.length == nowi) {
            break;
        }
        now_x = v_queue[nowi];
        now_v = now_x[0];
        now_d = now_x[1];
        if (!used[now_v]) {
            used[now_v] = true;
            for (var i = 0; i < graph[now_v].length; i++) {
                var ch = graph[now_v][i];
                if (now_dist[ch] == -1) {
                    v_queue.push([ch, now_d + 1]);
                    now_dist[ch] = now_d + 1;
                }
            }
        }
        nowi++;
    }
    // console.log(now_dist);
    short_path[u] = new Array(n);
    for (var i = 0; i < n; i++) {
        short_path[u][i] = now_dist[i];
    }
}





//console.log(CrossingCheck([0,0],[100,100],[100,0],[0,100]));
//console.log(distancePointToLine(0, 0, 100, 0, 0, 100));




init();






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

function findVertex(coords) {
    var rad_sq = Math.pow(getVertexRad()[1], 2);
    for (var i = 0; i < vertex.length; i++) {
        if (distanceSquare(coords, vertex_n[i]) <= rad_sq) {
            return i;
        }
    }
    return -1;
}

function onMoveCanvas(e) {
    // canvas.addEventListener('mousemove', function() {
    if (!shake_finished || canvas_clicked) {
        return;
    }
    
    // console.log("mousemove");

    cw = canvas.width;
    vw = canvas.offsetWidth;
    ch = canvas.height;
    vh = canvas.offsetHeight;
    // console.log(e.offsetX, e.offsetY);
    nowx = Math.floor(e.offsetX * cw / vw);
    nowy = Math.floor(e.offsetY * ch / vh);
    // console.log(nowx, nowy);
    var nowi = findVertex([nowx, nowy]);
    // console.log(nowi);
    if (nowi == cur_i) {
        return;
    }
    cur_i = nowi;
    render(nowi);
    // if (cur != -1) {
    //     nodes[cur] = [e.offsetX, e.offsetY];
    // }
}

function onClickCanvas(e) {
    // canvas.addEventListener('mousemove', function() {
    if (!shake_finished) {
        return;
    }
    
    // console.log("mouseclick");

    cw = canvas.width;
    vw = canvas.offsetWidth;
    ch = canvas.height;
    vh = canvas.offsetHeight;
    // console.log(e.offsetX, e.offsetY);
    nowx = Math.floor(e.offsetX * cw / vw);
    nowy = Math.floor(e.offsetY * ch / vh);
    // console.log(nowx, nowy);
    var nowi = findVertex([nowx, nowy]);
    // console.log(nowi);
    // console.log(canvas_clicked);
    // console.log("check conds");
    // if (nowi == cur_i && canvas_clicked) {
    //     return;
    // }
    if (canvas_clicked && (nowi == cur_i)) {
        canvas_clicked = false;
    } else {
        canvas_clicked = true;
        if (nowi == -1) {
            canvas_clicked = false;
        }
    }
    // console.log(canvas_clicked);
    cur_i = nowi;
    render(nowi);
    // if (cur != -1) {
    //     nodes[cur] = [e.offsetX, e.offsetY];
    // }
}

