// set up canvas
let graphcanvas = document.getElementById('graphcanvas');
let dispcanvas = document.getElementById('dispcanvas');

graphcanvas.width = 500*1.5;
graphcanvas.height = 500*1.5;
graphcanvas.style.width = "500px";
graphcanvas.style.height = "500px";
dispcanvas.width = 500*1.5;
dispcanvas.height = 500*1.5;
dispcanvas.style.width = "500px";
dispcanvas.style.height = "500px";

let gctx = graphcanvas.getContext("2d");
let dctx = dispcanvas.getContext("2d");

gctx.translate(250*1.5, 250*1.5);
dctx.translate(8, 0);

const postLayoutAdjustmentUpdateSteps = 1200;
let preadjustGraphLayout = true;
let resetClusterK = true;
let updateSteps;
let clusteringK;
let kmeansRestarts = 20;
let dynamicsFinderRestarts = 10;
let graph = g1;

loadGraph(g1);

function loop() {
    graph.dynamics.updateN(updateSteps, 1);
    gctx.clearRect(-2000, -2000, 4000, 4000);
    graph.plot(graphcanvas, gctx);
}

setInterval(loop, 17);

console.log("Hi!");