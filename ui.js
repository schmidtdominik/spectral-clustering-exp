function setClusteringk(k) {
    clusteringK = parseInt(k);
    graph.spectralColoring(clusteringK, kmeansRestarts);
}

function recolor() {
    graph.spectralColoring(clusteringK, kmeansRestarts);
}

function relayout() {
    graph.findCompactDynamics(dynamicsFinderRestarts);
    if (preadjustGraphLayout) {
        graph.dynamics.updateN(postLayoutAdjustmentUpdateSteps, 1);
    }
}

function setUpdateSteps(p) {
    updateSteps = p;
}

function setResetClusterK(v) {
    resetClusterK = v;
}

function setPreadjustGraph(v) {
    preadjustGraphLayout = v;
}

function setKmeansRestarts(v) {
    kmeansRestarts = parseInt(v);
}

function setDynamicsFinderRestarts(v) {
    dynamicsFinderRestarts = parseInt(v);
}

function setPlotMode(v) {
    switch (v) {
        case "eigenvalues": graph.plotEigenvalues(dispcanvas, dctx); break;
        case "eigenvectors": graph.plotEigenvectors(dispcanvas, dctx); break;
        case "adjacencymatrix": graph.plotAdjacencyMatrix(dispcanvas, dctx); break;
        case "degreematrix": graph.plotDegreeMatrix(dispcanvas, dctx); break;
        case "laplacianmatrix": graph.plotLaplacianMatrix(dispcanvas, dctx); break;
    }
}

function loadGraph(v) {
    switch (v) {
        case "g1": graph = g1; break;
        case "K3": graph = K3; break;
        case "K5": graph = K5; break;
        case "K2_2": graph = K2_2; break;
        case "K2_4": graph = K2_4; break;
        case "p4": graph = p4; break;
        case "K3K3": graph = K3K3; break;
        case "PYR3": graph = PYR3; break;
        case "PYR4": graph = PYR4; break;
        case "PYR5": graph = PYR5; break;
        case "bidakis_cube": graph = bidakis_cube; break;
        case "golomb_graph": graph = golomb; break;
        case "R0": graph = R0; break;
        case "R1": graph = R1; break;
        case "R2": graph = R2; break;
        case "R3": graph = R3; break;
        case "R4": graph = R4; break;
        case "L0": graph = L0; break;
        case "L1": graph = L1; break;
    }


    let initK;
    if (resetClusterK) {
        initK = min(Math.ceil(Math.sqrt(graph.V.length)), graph.clusterCount());
        document.getElementById("clusteringKRange").max = graph.V.length;
    } else {
        initK = min(parseInt(document.getElementById("clusteringKRange").value), graph.V.length);
    }
    document.getElementById("clusteringKRange").value = initK;
    document.getElementById("clusteringKamount").value = initK;


    setClusteringk(initK);
    setUpdateSteps(5);

    graph.findCompactDynamics(dynamicsFinderRestarts);
    if (preadjustGraphLayout) {
        graph.dynamics.updateN(postLayoutAdjustmentUpdateSteps, 1);
    }

    setPlotMode(document.getElementById("plotMode").value);

    let componentCount = graph.componentCount();
    document.getElementById("componentCount").innerText = componentCount === 1 ? "There is 1 connected component." : "There are " + componentCount + " connected components.";
    let clusterCount = graph.clusterCount();
    document.getElementById("clusterCount").innerText = clusterCount === 1 ? "There is likely 1 cluster." : "There are likely " + clusterCount + " clusters.";
    document.getElementById("spectralGap").innerText = "The spectral gap (~ graph density) is " + graph.spectralGap().toFixed(2);
}