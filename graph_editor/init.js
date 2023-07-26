

canvas = document.getElementById("graph_view");
var ctx = canvas.getContext("2d");

var mindir = Math.min(window.innerWidth, window.innerHeight * 0.8);

var cur_i = -1;
var canvas_clicked = false;
// ctx.canvas.width = Math.floor(mindir * 0.9);
// ctx.canvas.height = Math.floor(mindir * 0.9);
ctx.canvas.width = 1000;
ctx.canvas.height = 1000;
var canvas_edge = Math.floor(mindir * 0.9);
console.log([window.innerWidth * 0.9 - 400, window.innerHeight * 0.8 * 0.9]);
if (window.innerWidth * 0.9 - 400 > window.innerHeight * 0.8 * 0.9) {
    canvas_edge = Math.min(window.innerWidth * 0.9 - 400, window.innerHeight * 0.8 * 0.9);
}
canvas.style.width = String(canvas_edge) + "px";
canvas.style.height = String(canvas_edge) + "px";
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

function recalc_canvas_size() {
    let mindir = Math.min(window.innerWidth, window.innerHeight * 0.8);

    window.cur_i = -1;
    window.canvas_clicked = false;
    
    window.canvas_edge = Math.floor(mindir * 0.9);
    // console.log([window.innerWidth * 0.9 - 400, window.innerHeight * 0.8 * 0.9]);
    if (window.innerWidth * 0.9 - 400 > window.innerHeight * 0.8 * 0.9) {
        canvas_edge = Math.min(window.innerWidth * 0.9 - 400, window.innerHeight * 0.8 * 0.9);
    }
    canvas.style.width = String(canvas_edge) + "px";
    canvas.style.height = String(canvas_edge) + "px";
    var cwidth = canvas.width;
    var cheight = canvas.height;
}

addEventListener("resize", (event) => {recalc_canvas_size();});

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
window.weights = {};




