

canvas = document.getElementById("graph_view");
var ctx = canvas.getContext("2d");
var cwidth = canvas.width;
var cheight = canvas.height;

window.nowDelta = 300;
window.failShakeCnt = 0;

var zero_time = Date.now();
const dt = 20;
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





function main() {
    console.log("main");
    var now = Date.now();
    var nowr = Math.floor((now - zero_time) / dt);

    for (var i = rounds; i < nowr; i++) {
        // update();
        //if (!on_pause) {
        normalizeGraph();
        for (var j = 0; j < 20; j++) {
            shakeGraph();
        }
        render();
        //}

        rounds = nowr;
    }
    
    rounds = nowr;

    if (!on_pause) {
        requestAnimFrame(main);
    }
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





function renderVertex(i) {
    var v = vertex[i];
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





function renderEdge(u, v) {
    nx1 = vertex[u].pos[0];
    ny1 = vertex[u].pos[1];
    nx2 = vertex[v].pos[0];
    ny2 = vertex[v].pos[1];

    ctx.beginPath();

    ctx.lineWidth = 8;
    ctx.strokeStyle = "white";

    ctx.moveTo(nx1, ny1);
    ctx.lineTo(nx2, ny2);
    ctx.stroke();

    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";

    ctx.moveTo(nx1, ny1);
    ctx.lineTo(nx2, ny2);
    ctx.stroke();
    
}




function graphRate() {
    var rate = 0;
    var n = vertex.length;
    var base = 300 / Math.sqrt(n);
    var base_sq = base * base;
    for (var i = 0; i < vertex.length; i++) {
        for (var j = i + 1; j < vertex.length; j++) {
            var nowds = distanceSquare(vertex[i].pos, vertex[j].pos) / base_sq;
            rate += Math.sqrt(nowds);
            rate += 1 / (nowds + 0.00000001);
        }
    }
    // console.log(graph);
    for (var i = 0; i < graph.length; i++) {
        // console.log(graph[i]);
        for (var j = 0; j < graph[i].length; j++) {
            var v = graph[i][j];
            var nowds = distanceSquare(vertex[i].pos, vertex[v].pos) / base_sq;
            rate += nowds;
        }
    }
    return rate;
}





function normalizeGraph() {
    var zero_x = 0;
    var zero_y = 0;
    var n = vertex.length;
    if (n == 0) {
        return;
    }
    for (var i = 0; i < vertex.length; i++) {
        var nowx = vertex[i].pos[0];
        var nowy = vertex[i].pos[1];
        zero_x += nowx;
        zero_y += nowy;
    }
    zero_x = zero_x / n - cwidth / 2;
    zero_y = zero_y / n - cheight / 2;
    for (var i = 0; i < vertex.length; i++) {
        vertex[i].pos[0] -= zero_x;
        vertex[i].pos[1] -= zero_y;
    }
}





function shakeGraph() {
    if (nowDelta > 0) {
        console.log(nowDelta, failShakeCnt);
        var n = vertex.length;
        var nowRate = graphRate();
        let deltax = new Array(n)
        deltax = deltax.fill(0).map(() => Math.floor((Math.random() - 0.5) * 2 * nowDelta));
        let deltay = new Array(n)
        deltay = deltay.fill(0).map(() => Math.floor((Math.random() - 0.5) * 2 * nowDelta));
        for (var i = 0; i < vertex.length; i++) {
            vertex[i].pos[0] += deltax[i];
            vertex[i].pos[1] += deltay[i];
        }
        var newRate = graphRate();
        if (newRate >= nowRate) {
            for (var i = 0; i < vertex.length; i++) {
                vertex[i].pos[0] -= deltax[i];
                vertex[i].pos[1] -= deltay[i];
            }
            failShakeCnt++;
        }
        if (failShakeCnt >= 20) {
            nowDelta *= 0.95;
            nowDelta = Math.floor(nowDelta);
            failShakeCnt = 0;
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
    window.nowDelta = 300;
    window.failShakeCnt = 0;
    inputGraph();
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

*/



