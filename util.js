function plotMatrix(canvas, ctx, matrix, name) {
    ctx.clearRect(-2000, -2000, 4000, 4000);
    ctx.font = "bold 40px Raleway";
    ctx.fillStyle = "rgb(30, 30, 30)";
    ctx.textAlign = "center";
    ctx.fillText(name, canvas.width/2, canvas.height*0.087);

    //ctx.translate(0, canvas.height*0.05);

    ctx.font = "bold 27px Raleway";

    let minV = Number.POSITIVE_INFINITY;
    let maxV = Number.NEGATIVE_INFINITY;

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            minV = min(minV, matrix[y][x]);
            maxV = max(maxV, matrix[y][x]);
        }
    }

    const edge = 0.12;
    const boxSizeX = ((canvas.width-2*edge*canvas.width)/matrix[0].length);
    const boxSizeY = ((canvas.height-2*edge*canvas.width)/matrix.length);

    let diffValues = [];

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            if (!diffValues.includes(matrix[y][x])) {
                diffValues.push(matrix[y][x]);
            }
        }
    }

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            let v = matrix[y][x];
            let col = (v-minV)/(maxV-minV);
            ctx.fillStyle = "hsl(" + col*360*((diffValues.length-1)/diffValues.length) + ", 65%, 55%)";

            ctx.fillRect(canvas.width*edge + x*boxSizeX, canvas.height*edge + y*boxSizeY, boxSizeX*0.9, boxSizeY*0.9);

            ctx.fillStyle = "white";
            let text = Math.round(v)===v ? v : v.toFixed(1);
            ctx.fillText(text, canvas.width*edge + x*boxSizeX + boxSizeX/2 - 2, canvas.height*edge + y*boxSizeY + boxSizeY/2 +8);
        }
    }

    ctx.fillStyle = "black";
    for (let y = 0; y < matrix.length; y++) {
        ctx.fillText(y, canvas.width*edge*0.76, canvas.height*edge + y*boxSizeY + boxSizeY/2+7);




        ctx.fillText(y, canvas.width*edge + y*boxSizeY + boxSizeY/2 - 2, canvas.height*(1-edge)*1.05);
    }
}


function plotGraph(canvas, ctx, values, name) {
    ctx.clearRect(-2000, -2000, 4000, 4000);

    ctx.font = "bold 40px Raleway";
    ctx.fillStyle = "rgb(30, 30, 30)";
    ctx.textAlign = "center";
    ctx.fillText(name, canvas.width/2, canvas.height*0.09);
    ctx.font = "bold 25px Raleway";

    let edge = 0.165;
    const boxSizeX = ((canvas.width-2*edge*canvas.width)/values .length);
    const boxSizeY = ((canvas.height-2*edge*canvas.width)/values.length);

    let graphAreaSize = (canvas.width-(canvas.width*edge*2));
    const graphEdge = 0.08;


    for (let i = 0; i < values.length; i++) {
        ctx.fillStyle = "black";
        let t = i/values.length;
        let x = canvas.width*edge*(1-t)+graphAreaSize*t+canvas.width*graphEdge;
        ctx.fillText(i.toString(), x+10, canvas.width*(1-edge)+canvas.height*0.055*0.9);
        let h = (values[i]/max(values))*graphAreaSize*0.9;

        let col = (values[i]-min(values))/(max(values)-min(values));
        ctx.fillStyle = "hsl(" +col*300+ ", 65%, 55%)";

        ctx.fillRect(x, canvas.width*(1-edge)-h, canvas.width*0.035, h);
    }

    ctx.fillStyle = "black";
    for (let i = 0; i < 10; i++) {
        let t = i/10;
        let y = canvas.height*edge*t + (canvas.height*edge + graphAreaSize)*(1-t);
        ctx.fillText((max(values)*t).toFixed(1), canvas.width*edge*0.7, y);
    }

    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(canvas.width*edge, canvas.height*(1-edge));
    ctx.lineTo(canvas.width*(1-edge), canvas.height*(1-edge));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width*edge, canvas.height*(1-edge));
    ctx.lineTo(canvas.width*edge, canvas.height*edge);
    ctx.stroke();
}

function transposeM(matrix) {
    let newM = [];
    for (let y = 0; y < matrix[0].length; y++) {
        newM.push([]);
        for (let x = 0; x < matrix.length; x++) {
            newM[y].push(matrix[x][y]);
        }
    }

    return newM;
}

function indexOfDeep(array2d, value1d) {
    for (let i = 0; i < array2d.length; i++) {
        if (array2d[i].length !== value1d.length) {
            continue;
        }

        let same = true;
        for (let j = 0; j < array2d.length; j++) {
            if (array2d[i][j] !== value1d[j]) {
                same = false;
            }
        }

        if (same) {
            return i;
        }
    }

    return -1;
}

function dist(a, b) {
    let acc = 0;
    for (let i = 0; i < a.length; i++) {
        acc += Math.pow(a[i]-b[i], 2);
    }
    return Math.sqrt(acc);
}

function addArrays(a, b) {
    let c = [];
    for (let i = 0; i < a.length; i++) {
        c.push(a[i]+b[i]);
    }
    return c;
}

function zeroArray(n) {
    let a = [];
    for (let i = 0; i < n; i++) {
        a.push(0);
    }
    return a;
}

function repeatedKmeans(vectors, k, restarts) {
    let minDist = Number.POSITIVE_INFINITY;
    let minDistClass = undefined;
    for (let i = 0; i < restarts; i++) {
        let m = kmeansSingleIter(vectors, k);
        let classifications = m[0];
        let distSum = m[1];

        if (distSum < minDist) {
            minDist = distSum;
            minDistClass = classifications;
            //console.log(minDist);
        }
    }

    return minDistClass;
}


function kmeansSingleIter(vectors, k) {
    let classifications = [];
    for (let i = 0; i < vectors.length; i++) {
        classifications.push(undefined);
    }
    let centers = [];

    let selected_ = [];
    for (let i = 0; i < k; i++) {
        let override = 0;
        while (true) {
            override++;
            let n = Math.floor(Math.random()*vectors.length);
            if (!selected_.includes(n) || override>200) {
                selected_.push(n);
                break;
            }
        }
    }

    for (let i = 0; i < selected_.length; i++) {
        centers.push(vectors[selected_[i]]);
    }

    let center_distances = [];

    for (let step = 0; step < 200; step++) {
        // classify
        for (let l = 0; l < vectors.length; l++) {
            center_distances = [];
            for (let p = 0; p < centers.length; p++) {
                center_distances.push(dist(centers[p], vectors[l]));
            }
            classifications[l] = center_distances.indexOf(min(center_distances))
        }

        // recenter
        for (let cluster_id = 0; cluster_id < centers.length; cluster_id++) {
            sum_array = zeroArray(vectors[0].length);
            sum_count = 0;
            for (let p = 0; p < vectors.length; p++) {
                if (classifications[p] === cluster_id) {
                    sum_array = addArrays(sum_array, vectors[p]);
                    sum_count += 1;
                }
            }

            let avg_array = [];
            for (let i = 0; i < sum_array.length; i++) {
                avg_array.push(sum_array[i]/sum_count);
            }

            centers[cluster_id] = avg_array;
        }
    }

    return [classifications, sum(center_distances)];
}