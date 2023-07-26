

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



function getPercent() {
    var maxd = maxDelta;
    var nowd = nowDelta + 0.5;
    //console.log("percents");
    //console.log(Math.log(nowd + 1), Math.log(maxd + 2));
    //console.log((1 - (Math.log(nowd + 1)) / Math.log(maxd + 2)));
    return Math.min(100, Math.floor(100 * (1 - (Math.log(nowd + 0.1)) / Math.log(maxd + 2))) + 1);
}


// Draw everything
function render(nowi = cur_i) {
    normalizeGraph();
    getPercent();
    let zero_index = 1 - document.getElementById("zero_index").checked;
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
            renderVertex(i, i + zero_index,  1);
        } else {
            renderVertex(i, i + zero_index, flag);
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


function renderVertex(i, label, flag = false) {
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
    ctx.fillText(String(label), nx, ny + Math.floor(rad * 2 / 4));
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





function drawEdge(x1, y1, x2, y2, oriented) {
    ctx.beginPath();
    if (oriented) {
        var headlen = 100; // length of head in pixels
        var dx = x2 - x1;
        var dy = y2 - y1;
        var angle = Math.atan2(dy, dx);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
    } else {
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
    }
    ctx.stroke();
}





function renderEdge(u, v, flag = false) {
    let weighted = document.getElementById("weighted").checked;
    let oriented = false;//document.getElementById("oriented").checked;
    let label = "";
    if (weighted) {
        if (window.weights.hasOwnProperty(u + "_" + v)) {
            label = window.weights[u + "_" + v];
        }
    }
    nx1 = vertex_n[u][0];
    ny1 = vertex_n[u][1];
    nx2 = vertex_n[v][0];
    ny2 = vertex_n[v][1];

    const computedStyle = getComputedStyle(canvas);
    var mag_fill = computedStyle.getPropertyValue('--magic-fill');
    var mag_backfill = computedStyle.getPropertyValue('--magic-backfill');


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

    ctx.lineWidth = 8;

    ctx.strokeStyle = mag_fill;
    if (flag == -1) {
        ctx.strokeStyle = mag_backfill;
    }

    drawEdge(nx1, ny1, nx2, ny2, oriented);
    // ctx.setLineDash([]);

    // if (!(current_theme == "white" && flag)) {
    if (true) {
        // ctx.beginPath();

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

        // ctx.moveTo(nx1, ny1);
        // ctx.lineTo(nx2, ny2);
        // ctx.stroke();
        drawEdge(nx1, ny1, nx2, ny2, oriented);
    }

    ctx.beginPath();

    let mx = (nx1 + nx2) / 2;
    let my = (ny1 + ny2) / 2;
    var nowrk = getVertexRad();
    var nowk = nowrk[0];
    var rad = nowrk[1];
    ctx.font = Math.floor(45 * nowk) + "px Arial";
    ctx.shadowColor="black";
    ctx.strokeStyle = "black";
    ctx.shadowBlur=7;
    ctx.lineWidth=5;
    ctx.strokeText(label,mx,my + Math.floor(rad * 2 / 4));
    ctx.shadowBlur=0;
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(label, mx, my + Math.floor(rad * 2 / 4));
    ctx.stroke();
}





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



