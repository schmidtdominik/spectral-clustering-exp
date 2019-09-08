class GraphDynamics {
    constructor (V, size) {
        this.V = V;

        this.forceDistScalePower = 0.7;
        this.forceDistScale = 0.75;

        this.initAdjacentForceFactor = 0.00006;
        this.finalAdjacentForceFactor = 0.004;

        this.initNonAdjacentForceFactor = 0.1;
        this.finalNonAdjacentForceFactor = 0.004;

        this.sameColorForceFactor = 0.985;
        this.diffColorForceFactor = 1.015;

        this.paramTransitionSteps = 500;
        this.transitionStep = 0;

        this.largeGraphMode = size >= 15;
        //if (this.largeGraphMode) console.log("large graph mode enabled");
        this.alternateMode = size >= 8;
        //if (this.alternateMode) console.log("alternate dynamics enabled");
        this.edgeRepelling = this.alternateMode;
        this.alignToRing = !this.alternateMode;
        this.edgeRepelForce = 0.0005;
        this.centerPull = 0.93; // for !alignToRing
        this.ringDiameter = 0.17;
        this.ringAlignForce = 0.2;


        this.dynamicTension = 0;
    }

    reset() {
        this.transitionStep = 0;
    }

    repel(vertexA, vertexB, adjacentForceFactor, nonAdjacentForceFactor, updateSize) {
        let adjacent = vertexA.adjacentTo(vertexB);
        let sameColor = vertexA.color === vertexB.color;

        let dx = vertexA.x-vertexB.x;
        let dy = vertexA.y-vertexB.y;
        let dist = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));

        let repelForce = 1/Math.pow(dist, this.forceDistScalePower) * this.forceDistScale;

        repelForce *= adjacent ? adjacentForceFactor : nonAdjacentForceFactor;
        repelForce *= sameColor ? this.sameColorForceFactor : this.diffColorForceFactor;

        this.dynamicTension += repelForce;

        vertexA.x += dx*repelForce*updateSize;
        vertexA.y += dy*repelForce*updateSize;
    }

    update(updateSize) {
        this.dynamicTension = 0;

        let t = this.transitionStep/this.paramTransitionSteps;
        let adjacentForceFactor = (1-t)*this.initAdjacentForceFactor + t*this.finalAdjacentForceFactor;
        let nonAdjacentForceFactor = (1-t)*this.initNonAdjacentForceFactor + t*this.finalNonAdjacentForceFactor;

        for (let i = 0; i < this.V.length; i++) {

            let thisVertex = this.V[i];

            for (let j = 0; j < this.V.length; j++) {
                if (i === j) {
                    continue;
                }

                let thatVertex = this.V[j];
                this.repel(thisVertex, thatVertex, adjacentForceFactor, nonAdjacentForceFactor, updateSize)
            }

            if (this.edgeRepelling) {
                for (let j = 0; j < thisVertex.adjacentVertices.length; j++) {
                    let neighborVertex = thisVertex.adjacentVertices[j];
                    let middlePoint = new GraphNode(-1);
                    middlePoint.x = (thisVertex.x + neighborVertex.x) / 2;
                    middlePoint.y = (thisVertex.y + neighborVertex.y) / 2;
                    for (let k = 0; k < this.V.length; k++) {
                        let edgeRepelledVertex = this.V[k];
                        if (edgeRepelledVertex.id === thisVertex.id || edgeRepelledVertex.id === neighborVertex.id) {
                            continue;
                        }

                        this.repel(edgeRepelledVertex, middlePoint, this.edgeRepelForce, this.edgeRepelForce, updateSize);
                    }
                }
            }

            let distFromCenter = Math.sqrt(Math.pow(thisVertex.x, 2) + Math.pow(thisVertex.y, 2));
            let offset = Math.abs(this.ringDiameter-distFromCenter);

            if (this.alignToRing) {
                thisVertex.x *= Math.min(this.ringAlignForce/offset, 1);
                thisVertex.y *= Math.min(this.ringAlignForce/offset, 1);
            } else {
                thisVertex.x *= this.centerPull * (this.largeGraphMode ? 0.93 : 1);
                thisVertex.y *= this.centerPull * (this.largeGraphMode ? 0.93 : 1);
            }

        }

        this.transitionStep = min(++this.transitionStep, this.paramTransitionSteps);

        return this.dynamicTension;
    }

    updateN(n, updateSize) {
        for (let i = 0; i < n; i++) {
            this.update(updateSize);
        }
    }
}


// undirected graph
class Graph {

    constructor(size) {
        this.V = [];
        this.dynamics = new GraphDynamics(this.V, size);
        for (let i = 0; i < size; i++) {
            this.V.push(new GraphNode(i));
        }
    }

    addAdjacents(fromNodeId, toNodeIds) {
        if (!(fromNodeId >= 0 && fromNodeId < this.V.length)) console.log("graph def error: fromNodeId in addAdjacents");
        for (let i = 0; i < toNodeIds.length; i++) {
            if (!(toNodeIds[i] >= 0 && toNodeIds[i] < this.V.length)) console.log("graph def error: toNodeIds in addAdjacents");

            this.V[fromNodeId].addAdjacentUndirected(this.V[toNodeIds[i]]);
        }
    }

    adjacencyMatrix() {
        let m = zeros(this.V.length, this.V.length);

        for (let i = 0; i < this.V.length; i++) {
            let node = this.V[i];
            for (let j = 0; j < node.adjacentVertices.length; j++) {
                let adNode = node.adjacentVertices[j];
                m.val[node.id*m.n + adNode.id] = 1;
            }
        }

        return m;
    }

    degreeMatrix() {
        let m = zeros(this.V.length, this.V.length);

        for (let i = 0; i < this.V.length; i++) {
            m.val[i*m.n + i] = this.V[i].degree()
        }

        return m;
    }

    laplacianMatrix() {
        return sub(this.degreeMatrix(), this.adjacencyMatrix());
    }

    componentCount() {
        let c = 0;
        let ev = this.eigenvalues();

        for (let i = 0; i < ev.length; i++) {
            if (Math.abs(ev[i]) < 0.00001) {
                c++;
            }
        }
        return c;
    }

    clusterCount() {
        let e = this.eigenvalues();
        let largestGap = Number.NEGATIVE_INFINITY;
        let index = -1;

        for (let i = 0; i < e.length-1; i++) {
            if (Math.abs(e[i]-e[i+1]) > largestGap) {
                largestGap = Math.abs(e[i]-e[i+1]);
                index = i;
            }
        }

        return index+1;
    }

    // correlates with graph density. Is n when graph with n nodes is fully connected
    spectralGap() {
        let ev = this.eigenvalues();
        return ev[this.componentCount()];
    }

    eigenvalues() {
        return sort(vec2array(eig(this.laplacianMatrix())));
    }

    eigenvectors() {
        let e = eig(this.laplacianMatrix(), true);
        let evUnsorted = vec2array(e.V);
        let euUnsorted = vec2array(transpose(e.U).toArray());

        let ev = [];
        let eu = [];

        while (evUnsorted.length > 0) {
            let minValue = Number.POSITIVE_INFINITY;
            let minIndex = undefined;

            for (let i = 0; i < evUnsorted.length; i++) {
                if (evUnsorted[i] < minValue) {
                    minValue = evUnsorted[i];
                    minIndex = i;
                }
            }

            ev.push(evUnsorted[minIndex]);
            eu.push(euUnsorted[minIndex]);
            evUnsorted.splice(minIndex, 1);
            euUnsorted.splice(minIndex, 1);
        }

        return [ev, eu];
    }

    fiedlerColor() {
        let e = this.eigenvectors();
        let ev = e[0];
        let eu = e[1];

        for (let i = 0; i < this.V.length; i++) {
            this.V[i].color = eu[1][i] > 0 ? 0 : 0.5;
        }
    }

    spectralColoring(k, restarts) {
        let e = this.eigenvectors();
        let eu = e[1];

        let selected_eus = [];
        for (let i = 0; i < k; i++) {
            selected_eus.push(eu[i]);
        }

        let colors = repeatedKmeans(transposeM(selected_eus), k, restarts);

        for (let i = 0; i < this.V.length; i++) {
            this.V[i].color = colors[i]/k;
        }
    }

    plot(canvas, ctx) {
        for (let i = 0; i < this.V.length; i++) {
            let node = this.V[i];
            node.plotEdges(canvas, ctx);
        }
        for (let i = 0; i < this.V.length; i++) {
            let node = this.V[i];
            node.plotVertex(canvas, ctx, (this.dynamics.largeGraphMode ? 0.8 : 1));
        }
    }

    plotEigenvalues(canvas, ctx) {
        plotGraph(canvas, ctx, this.eigenvalues(), "Eigenvalues")
    }

    plotEigenvectors(canvas, ctx) {
        let eu = this.eigenvectors()[1];
        let euTransposed = zeros(eu.length, eu.length);

        for (let i = 0; i < eu.length; i++) {
            for (let j = 0; j < eu.length; j++) {
                euTransposed.val[j*euTransposed.n + i] = eu[i][j];
            }
        }
        euTransposed = euTransposed.toArray();

        plotMatrix(canvas, ctx, euTransposed, "Eigenvectors")
    }

    plotAdjacencyMatrix(canvas, ctx) {
        plotMatrix(canvas, ctx, this.adjacencyMatrix().toArray(), "Adjacency Matrix");
    }

    plotDegreeMatrix(canvas, ctx) {
        plotMatrix(canvas, ctx, this.degreeMatrix().toArray(), "Degree Matrix");
    }

    plotLaplacianMatrix(canvas, ctx) {
        plotMatrix(canvas, ctx, this.laplacianMatrix().toArray(), "Laplacian Matrix (Deg-Adj)");
    }

    resetDynamics() {
        this.dynamics.reset();
        for (let i = 0; i < this.V.length; i++) {
            this.V[i].resetDynamics();
        }
    }

    findCompactDynamics(restarts) {
        let graphData;
        let graphTension = Number.POSITIVE_INFINITY;

        let data0;

        for (let i = 0; i < restarts; i++) {
            let tension;

            if (!preadjustGraphLayout) {
                data0 = [];
                for (let j = 0; j < this.V.length; j++) {
                    let node = this.V[j];
                    data0.push([node.x, node.y]);
                }
            }

            for (let j = 0; j < 280; j++) {
                tension = this.dynamics.update(1);
            }
            if (tension < graphTension) {
                graphTension = tension;
                if (!preadjustGraphLayout) {
                    graphData = data0;
                } else {
                    graphData = [];
                    for (let j = 0; j < this.V.length; j++) {
                        let node = this.V[j];
                        graphData.push([node.x, node.y]);
                    }
                }
            }
            this.resetDynamics();
        }

        for (let j = 0; j < this.V.length; j++) {
            let node = this.V[j];
            node.x = graphData[j][0];
            node.y = graphData[j][1];
        }
    }

    getGeneratingCode(name) {
        let     str = "let " + name + " = new Graph(" + this.V.length + ");";
        for (let i = 0; i < this.V.length; i++) {
            let v = this.V[i];
            let adjacents = [];
            for (let j = 0; j < v.adjacentVertices.length; j++) {
                adjacents.push(v.adjacentVertices[j].id);
            }
            str += "\n" + name + ".addAdjacents(" + v.id + ", [" + adjacents.join(", ") + "]);"
            str += "\n" + name + ".V[" + v.id + "].x = " + v.x + ";";
            str += "\n" + name + ".V[" + v.id + "].y = " + v.y + ";";
        }
        return str;
    }
}

class GraphNode {
    constructor(id) {
        this.resetDynamics();
        this.adjacentVertices = [];
        this.id = id;
        this.color = undefined;
    }

    addAdjacentUndirected(vertex) {
        if (!this.adjacentTo(vertex) && this.id !== vertex.id) this.adjacentVertices.push(vertex);
        vertex.addAdjacentDirected(this);
    }

    addAdjacentDirected(vertex) {
        if (!this.adjacentTo(vertex) && this.id !== vertex.id) this.adjacentVertices.push(vertex);
    }

    adjacentTo(vertex) {
        return this.adjacentVertices.includes(vertex);
    }

    degree() {
        return this.adjacentVertices.length;
    }

    plotEdges(canvas, ctx) {
        for (let i = 0; i < this.adjacentVertices.length; i++) {
            ctx.beginPath();
            ctx.moveTo(canvas.width * this.x, canvas.height * this.y);
            ctx.lineTo(canvas.width * this.adjacentVertices[i].x, canvas.height * this.adjacentVertices[i].y);
            ctx.stroke();
        }
    }

    plotVertex(canvas, ctx, scale) {

        if (this.color === undefined) ctx.fillStyle = "black";
        else ctx.fillStyle = "hsl(" + 330*this.color + ", 75%, 55%)";

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc(canvas.width*this.x, canvas.height*this.y, 30*scale, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = Math.floor(40*scale) + "px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.id, canvas.width*this.x, canvas.height*this.y+15);

    }

    resetDynamics() {
        this.x = (Math.random()-0.5)*5;
        this.y = (Math.random()-0.5)*5;
    }
}