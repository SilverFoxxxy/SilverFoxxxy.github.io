const nodeR = 10;
const edgeD = 1;
const INF = 1E9;

var
    canv = document.getElementById('canvas'),
    ctx    = canvas.getContext('2d'),
    edges = [],
    nodes = [],
    exist = [],
    cur = -1,
    last = -1,
    type = false,
    n = 0,
    d = [],
    maxb = 1;

document.oncontextmenu = function (){return false};
canv.width = canv.offsetWidth;
canv.height = canv.offsetHeight;

setInterval(function() {
    canv.width = canv.offsetWidth;
    canv.height = canv.offsetHeight;
    if (type) {
        force();
    }
    drawField();
}, 30);

canv.addEventListener('contextmenu', function(e) {
    console.log("contextmenu");
    var v = node(e.offsetX, e.offsetY);
    if (v != -1) {
        exist[v] = false;
    }
});

canv.addEventListener('click', function(e) {
    console.log("click");
    if (cur != -1) {
        return;
    }
    var
        x = e.offsetX;
        y = e.offsetY;
        v = node(x, y);
    if (v == -1) {
        n++;
        nodes.push([x, y]);
        edges.push([]);
        exist.push(true);
        if (exist[last] && last != -1) {
            if (edges[last].indexOf(n - 1))
            edges[last].push(n - 1);
            edges[n - 1].push(last);
            last = -1;
        }
    } else {
        if (!exist[last] || last == -1) {
            last = v;
        } else {
            if (edges[last].indexOf(v) == -1) {
                edges[last].push(v);
                edges[v].push(last);
            } else {
                edges[last].splice(edges[last].indexOf(v), 1);
                edges[v].splice(edges[v].indexOf(last), 1);
            }
            last = -1;
        }
    }
});

canv.addEventListener('mousedown', function(e) {
    console.log("mousedown");
    var v = node(e.offsetX,  e.offsetY);
    if (v != -1) {
        cur = v;
    }
});

canv.addEventListener('mouseup', function(e) {
    console.log("mouseup");
    cur = -1;
});

canv.addEventListener('mousemove', function(e) {
    console.log("mousemove");
    if (cur != -1) {
        nodes[cur] = [e.offsetX, e.offsetY];
    }
});

canv.addEventListener('dblclick', function(e) {});

document.addEventListener('keydown', function(e) {
    console.log("keydown ", e.keyCode);
    if (e.keyCode == 66) {
        type = !type;
        console.log('force: ', type);
    } else if (e.keyCode == 67) {
        clear();
        nodes = [];
        edges = [];
        exist = [];
        n = 0;
        maxb = 1;
        console.log("clear");
    }
});


function clear() {
    ctx.beginPath();
    ctx.fillStyle = 'bisque';
    ctx.fillRect(0, 0, canv.width, canv.height);
}

function drawField() {
    clear();
    for (var i = 0; i < edges.length; ++i) {
        if (exist[i]) {
            for (var j = 0; j < edges[i].length; ++j) {
                if (exist[edges[i][j]] && i < edges[i][j]) {
                    ctx.lineWidth = edgeD;
                    ctx.strokeStyle = 'gray';
                    ctx.beginPath();
                    ctx.moveTo(nodes[i][0], nodes[i][1]);
                    ctx.lineTo(nodes[edges[i][j]][0], nodes[edges[i][j]][1]);
                    ctx.stroke();
                }
            }
        }
    }
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            ctx.fillStyle = 'brown';
            if (i == last) {
                ctx.fillStyle = 'gray';
            }
            ctx.beginPath();
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * (1 + (i == last)), 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'gray';
            ctx.beginPath();
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * 2, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function node(x, y) {
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            var
                dx = nodes[i][0] - x;
                dy = nodes[i][1] - y;
                len = Math.sqrt(dx * dx + dy * dy);
            if (len < nodeR * 3) {
                return i;
            }
        }
    }
    return -1;
}

function bfs(s) {
    var 
        q = [],
        beg = 0;
        used = [];
    for (var i = 0; i < n; ++i) {
        used.push(false);
    }
    q.push(s);
    used[s] = true;
    d[s][s] = 0;
    while (beg != q.length) {
        var v = q[beg];
        beg++;
        for (var j = 0; j < edges[v].length; ++j) {
            var u = edges[v][j];
            if (exist[u] && !used[u]) {
                used[u] = true;
                q.push(u);
                d[s][u] = d[s][v] + 1;
                maxb = Math.max(maxb, d[s][u]);
            }
        }
    }
}

function rib() {
    return Math.min(canv.width, canv.height) / (maxb + 1);
}

function f(v, u) {
    var
        dx = nodes[v][0] - nodes[u][0],
        dy = nodes[v][1] - nodes[u][1],
        len = Math.sqrt(dx * dx + dy * dy);
    return [(dx / len * d[v][u] * rib() - dx) / 30,
            (dy / len * d[v][u] * rib() - dy) / 30];
}

function force() {
    d = [];
    maxb = 0;
    for (var i = 0; i < n; ++i) {
        d.push([]);
        for (var j = 0; j < n; ++j) {
            d[i].push(INF);
        }
        if (exist[i]) {
            bfs(i);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            for (var j = 0; j < n; ++j) {
                if (exist[j] && i != j && d[i][j] != INF && i != cur) {
                    var delta = f(i, j);
                    nodes[i][0] += delta[0];
                    nodes[i][1] += delta[1];
                }
            }
        }
    }
    var 
        mxx = -INF,
        mxy = -INF,
        mnx = INF,
        mny = INF;
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            mxx = Math.max(mxx, nodes[i][0]);
            mxy = Math.max(mxy, nodes[i][1]);
            mnx = Math.min(mnx, nodes[i][0]);
            mny = Math.min(mny, nodes[i][1]);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            nodes[i][0] += (canv.width / 2 - (mxx + mnx) / 2) / 30;
            nodes[i][1] += (canv.height / 2 - (mxy + mny) / 2) / 30;
        }
    }
}
