let g1 = new Graph(10);
g1.addAdjacents(0, [1, 2, 8, 9, 5]);
g1.addAdjacents(1, [0, 2]);
g1.addAdjacents(2, [0, 1]);
g1.addAdjacents(3, [4, 5]);
g1.addAdjacents(4, [3, 5]);
g1.addAdjacents(5, [3, 4, 6, 7, 0]);
g1.addAdjacents(6, [5, 7]);
g1.addAdjacents(7, [6, 5]);
g1.addAdjacents(8, [0, 9]);
g1.addAdjacents(9, [0, 8]);

let K5 = new Graph(5);
K5.addAdjacents(0, [1, 2, 3, 4]);
K5.addAdjacents(1, [2, 3, 4, 0]);
K5.addAdjacents(2, [3, 4, 0, 1]);
K5.addAdjacents(3, [4, 0, 1, 2]);
K5.addAdjacents(4, [0, 1, 2, 3]);

let K3 = new Graph(3);
K3.addAdjacents(0, [1]);
K3.addAdjacents(1, [2]);
K3.addAdjacents(2, [0]);

let K2_2 = new Graph(4);
K2_2.addAdjacents(0, [2, 3]);
K2_2.addAdjacents(1, [2, 3]);
K2_2.addAdjacents(2, [0, 1]);
K2_2.addAdjacents(3, [0, 1]);

let K2_4 = new Graph(6);
K2_4.addAdjacents(0, [2, 3, 4, 5]);
K2_4.addAdjacents(1, [2, 3, 4, 5]);
K2_4.addAdjacents(2, [0, 1]);
K2_4.addAdjacents(3, [0, 1]);
K2_4.addAdjacents(4, [0, 1]);
K2_4.addAdjacents(5, [0, 1]);

let p4 = new Graph(4);
p4.addAdjacents(0, [1]);
p4.addAdjacents(1, [2]);
p4.addAdjacents(2, [3]);

let K3K3 = new Graph(6);
K3K3.addAdjacents(0, [1]);
K3K3.addAdjacents(1, [2]);
K3K3.addAdjacents(2, [0]);
K3K3.addAdjacents(3, [4]);
K3K3.addAdjacents(4, [5]);
K3K3.addAdjacents(5, [3]);


function pyr(depth) {
    let PYR = new Graph(depth*(depth+1)/2)

    let k = 0;
    for (let i = 1; i < depth; i++) {
        for (let upper = k; upper < k+i; upper++) {
            PYR.addAdjacents(upper, [upper+i, upper+i+1])
            PYR.addAdjacents(upper+i, [upper+i+1])
        }
        k += i;
    }
    return PYR;
}

PYR3 = pyr(3);
PYR4 = pyr(4);
PYR5 = pyr(5);


let bidakis_cube = new Graph(12);
bidakis_cube.addAdjacents(0, [1, 5, 6]);
bidakis_cube.addAdjacents(1, [0, 2, 4]);
bidakis_cube.addAdjacents(2, [1, 3, 7]);
bidakis_cube.addAdjacents(3, [2, 4, 10]);
bidakis_cube.addAdjacents(4, [1, 3, 5]);
bidakis_cube.addAdjacents(5, [0, 4, 11]);
bidakis_cube.addAdjacents(6, [0, 7, 9]);
bidakis_cube.addAdjacents(7, [2, 6, 8]);
bidakis_cube.addAdjacents(8, [7, 9, 10]);
bidakis_cube.addAdjacents(9, [6, 8, 11]);
bidakis_cube.addAdjacents(10, [3, 8, 11]);
bidakis_cube.addAdjacents(11, [9, 10, 5]);

let golomb = new Graph(10);
golomb.addAdjacents(0, [1, 2, 3, 4, 5, 6]);
golomb.addAdjacents(1, [0, 2, 6, 7]);
golomb.addAdjacents(2, [0, 1, 3]);
golomb.addAdjacents(3, [0, 2, 4, 8]);
golomb.addAdjacents(4, [0, 3, 5]);
golomb.addAdjacents(5, [0, 4, 6, 9]);
golomb.addAdjacents(6, [0, 1, 5]);
golomb.addAdjacents(7, [1, 8, 9]);
golomb.addAdjacents(8, [3, 7, 9]);
golomb.addAdjacents(9, [5, 7, 8]);
golomb.V[7].x = 0;
golomb.V[7].y = 3000;
golomb.V[8].x = 1500;
golomb.V[8].y = -1500;
golomb.V[9].x = -1500;
golomb.V[9].y = -1500;

function randomGraph() {

    const componentSize = 0.85; // 0 < componentSize < 1, larger componenSize <=> larger components in graph
    const maxSize = 20;
    let size = Math.round(6+Math.random()*(maxSize-6));
    let RAND = new Graph(size);

    // create small components
    for (let i = 0; i < RAND.V.length; i++) {
        let v1 = RAND.V[i];
        let v2 = RAND.V[Math.floor(Math.random()*size)];
        if (Math.random() > componentSize/Math.pow(v1.adjacentVertices.length+v2.adjacentVertices.length, 1)) continue;

        RAND.addAdjacents(v1.id, [v2.id]);
    }


    // insert more random edges (decreases component count)
    for (let i = 0; i < Math.floor(size/2); i++) {
        let a = Math.floor(Math.random()*size);
        let b = Math.floor(Math.random()*size);

        RAND.addAdjacents(a, [b]);
    }

    for (let i = 0; i < RAND.V.length; i++) {
        let v = RAND.V[i];
        if (v.adjacentVertices.length > 2 || v.adjacentVertices.length === 0) continue;

        for (let k = 0; k < 7; k++) {
            let n = v;
            for (let j = 0; j < 2; j++) {
                if (Math.random() < 0.4) break;
                //console.log(n.adjacentVertices);
                n = n.adjacentVertices[Math.floor(Math.random()*n.adjacentVertices.length)];
                //console.log(n)
            }

            RAND.addAdjacents(v.id, [n.id]);
        }
    }

    //console.log("size", size)
    /*for (let i = 0; i < floor(size/2); i++) {
        let a = Math.floor(Math.random()*size);
        let b = Math.floor(Math.random()*size);

        RAND.addAdjacents(a, [b]);
    }

    for (let i = 0; i < RAND.V.length; i++) {
        let v = RAND.V[i];

        if (v.adjacentVertices.length == 0) {

        }
    }*/

    /*edgeCount = 0;
    for (let i = 0; i < RAND.V.length; i++) {
        edgeCount += RAND.V[i].adjacentVertices.length;
    }
    edgeCount /= 2;
    console.log("edgeCount", edgeCount);*/


    return RAND;
}

RAND = randomGraph();

let R0 = new Graph(12);
R0.addAdjacents(0, [10, 0]);
R0.V[0].x = 0.44266484596989714;
R0.V[0].y = -0.16368034618698524;
R0.addAdjacents(1, [5, 6, 4, 9, 7]);
R0.V[1].x = -0.1483330201482057;
R0.V[1].y = -0.2666231331419652;
R0.addAdjacents(2, [10, 3, 11, 4]);
R0.V[2].x = 0.20301669803492597;
R0.V[2].y = 0.1995910868704685;
R0.addAdjacents(3, [2, 4, 3, 10, 11]);
R0.V[3].x = 0.2659702155493618;
R0.V[3].y = 0.35135866139861216;
R0.addAdjacents(4, [5, 7, 3, 2, 1]);
R0.V[4].x = -0.19815519820819025;
R0.V[4].y = 0.2760728942509936;
R0.addAdjacents(5, [1, 4, 9, 7]);
R0.V[5].x = -0.3825873055202371;
R0.V[5].y = 0.17284110447675496;
R0.addAdjacents(6, [6, 8, 1]);
R0.V[6].x = 0.0570828081745448;
R0.V[6].y = -0.43271741026165456;
R0.addAdjacents(7, [4, 9, 7, 5, 1]);
R0.V[7].x = -0.41914159700835174;
R0.V[7].y = -0.043705311322057516;
R0.addAdjacents(8, [6, 10, 8]);
R0.V[8].x = 0.23905462296927457;
R0.V[8].y = -0.33998043666152333;
R0.addAdjacents(9, [5, 7, 1]);
R0.V[9].x = -0.31145152440064366;
R0.V[9].y = -0.31158459978085773;
R0.addAdjacents(10, [0, 2, 8, 3]);
R0.V[10].x = 0.38022980285691166;
R0.V[10].y = 0.004561055782884695;
R0.addAdjacents(11, [2, 11, 3]);
R0.V[11].x = -0.016128786976005966;
R0.V[11].y = 0.4464846927505811;

let R1 = new Graph(8);
R1.addAdjacents(0, [5, 6, 0, 4]);
R1.V[0].x = 0.11065758520716149;
R1.V[0].y = -0.18794973429882722;
R1.addAdjacents(1, [1, 2, 4]);
R1.V[1].x = -0.22218289925445484;
R1.V[1].y = 0.06899226193315994;
R1.addAdjacents(2, [7, 4, 1, 3]);
R1.V[2].x = -0.08615585830297215;
R1.V[2].y = 0.16288916528303593;
R1.addAdjacents(3, [7, 3, 2]);
R1.V[3].x = 0.060542463733977626;
R1.V[3].y = 0.22454748374014355;
R1.addAdjacents(4, [5, 2, 0, 1]);
R1.V[4].x = -0.1646388353821733;
R1.V[4].y = -0.08895209191355595;
R1.addAdjacents(5, [0, 4, 5, 6]);
R1.V[5].x = -0.05361767394685054;
R1.V[5].y = -0.20478031179130873;
R1.addAdjacents(6, [0, 5, 6]);
R1.V[6].x = 0.2001700102703998;
R1.V[6].y = -0.06974263975688978;
R1.addAdjacents(7, [2, 3, 7]);
R1.V[7].x = 0.17221046683036842;
R1.V[7].y = 0.12415474980809187;

let R2 = new Graph(12);
R2.addAdjacents(0, [4, 11, 0, 2, 6]);
R2.V[0].x = 0.4309903153193889;
R2.V[0].y = 0.06324474912146821;
R2.addAdjacents(1, [10, 7, 3, 1]);
R2.V[1].x = -0.2787141615356953;
R2.V[1].y = -0.3559243418227651;
R2.addAdjacents(2, [11, 4, 2, 0, 6]);
R2.V[2].x = 0.40793571244087384;
R2.V[2].y = -0.128662784970186;
R2.addAdjacents(3, [5, 7, 10, 1]);
R2.V[3].x = -0.40204943141967786;
R2.V[3].y = 0.11761347289420244;
R2.addAdjacents(4, [0, 2, 6]);
R2.V[4].x = 0.08227691325370896;
R2.V[4].y = -0.42989991754900053;
R2.addAdjacents(5, [3, 8, 11, 7, 9]);
R2.V[5].x = -0.09201984695216484;
R2.V[5].y = 0.24327837500378768;
R2.addAdjacents(6, [4, 2, 6, 0]);
R2.V[6].x = 0.24546339616049082;
R2.V[6].y = -0.3773938440291359;
R2.addAdjacents(7, [3, 1, 10, 7, 5]);
R2.V[7].x = -0.1767106432593394;
R2.V[7].y = -0.1800384701052083;
R2.addAdjacents(8, [9, 5, 8]);
R2.V[8].x = -0.22497022001625136;
R2.V[8].y = 0.40066617613457756;
R2.addAdjacents(9, [8, 5, 11, 9]);
R2.V[9].x = 0.07923930748392577;
R2.V[9].y = 0.43777611593146293;
R2.addAdjacents(10, [1, 3, 7]);
R2.V[10].x = -0.444630076021085;
R2.V[10].y = -0.09359315403834174;
R2.addAdjacents(11, [2, 0, 5, 9]);
R2.V[11].x = 0.27601267815010583;
R2.V[11].y = 0.28580678299460077;

let R3 = new Graph(8);
R3.addAdjacents(0, [1, 2, 0, 6]);
R3.V[0].x = -0.13554062363188216;
R3.V[0].y = -0.17887465484074042;
R3.addAdjacents(1, [0, 6, 2]);
R3.V[1].x = -0.23598165265105553;
R3.V[1].y = -0.031351508129729984;
R3.addAdjacents(2, [1, 7, 4, 0, 3, 6]);
R3.V[2].x = -0.022550434028387554;
R3.V[2].y = 0.05629451047233421;
R3.addAdjacents(3, [4, 3, 2]);
R3.V[3].x = 0.08471541774085521;
R3.V[3].y = 0.22719369450360122;
R3.addAdjacents(4, [3, 7, 2, 5]);
R3.V[4].x = 0.19995047058158882;
R3.V[4].y = 0.0661523793999447;
R3.addAdjacents(5, [7, 5, 4]);
R3.V[5].x = 0.20878241378120993;
R3.V[5].y = -0.12430867844167622;
R3.addAdjacents(6, [1, 6, 0, 2]);
R3.V[6].x = -0.15927337332458408;
R3.V[6].y = 0.1605994928581853;
R3.addAdjacents(7, [4, 5, 2]);
R3.V[7].x = 0.07395777123441434;
R3.V[7].y = -0.19906457188285626;

let R4 = new Graph(12);
R4.addAdjacents(0, [2, 0, 3]);
R4.V[0].x = -0.1892150094755342;
R4.V[0].y = 0.39567280712490205;
R4.addAdjacents(1, [5, 6, 1, 9, 4, 8, 11]);
R4.V[1].x = -0.15219765530992163;
R4.V[1].y = -0.24599249447517368;
R4.addAdjacents(2, [0, 10, 3, 7]);
R4.V[2].x = 0.04190574612724346;
R4.V[2].y = 0.2555137375402109;
R4.addAdjacents(3, [7, 10, 2, 0]);
R4.V[3].x = 0.13174008210684893;
R4.V[3].y = 0.407672561593676;
R4.addAdjacents(4, [6, 4, 1]);
R4.V[4].x = 0.3450531793316467;
R4.V[4].y = -0.20094293320393863;
R4.addAdjacents(5, [1, 5, 9]);
R4.V[5].x = -0.387692379052872;
R4.V[5].y = -0.21836847366344556;
R4.addAdjacents(6, [8, 1, 4]);
R4.V[6].x = 0.18904055530253375;
R4.V[6].y = -0.36900475081059597;
R4.addAdjacents(7, [3, 7, 10, 2]);
R4.V[7].x = 0.3879548295743755;
R4.V[7].y = 0.034619901246283453;
R4.addAdjacents(8, [6, 1, 8]);
R4.V[8].x = -0.01914072401989617;
R4.V[8].y = -0.44126416766880594;
R4.addAdjacents(9, [11, 5, 1]);
R4.V[9].x = -0.4130194365546578;
R4.V[9].y = 0.010081504968153741;
R4.addAdjacents(10, [2, 3, 7]);
R4.V[10].x = 0.36135395659755093;
R4.V[10].y = 0.22440463697777943;
R4.addAdjacents(11, [9, 1, 11]);
R4.V[11].x = -0.3629347539110241;
R4.V[11].y = 0.18876758392063567;

let L0 = new Graph(19);
L0.addAdjacents(0, [11, 3, 2, 1, 17]);
L0.V[0].x = -0.009652991740675266;
L0.V[0].y = -0.1172915594553157;
L0.addAdjacents(1, [13, 2, 0]);
L0.V[1].x = -0.27565362357381745;
L0.V[1].y = -0.12203991066519625;
L0.addAdjacents(2, [13, 0, 1, 3, 5, 15]);
L0.V[2].x = -0.247991509482747;
L0.V[2].y = -0.03828251414721662;
L0.addAdjacents(3, [8, 0, 2, 15]);
L0.V[3].x = -0.12001823190755505;
L0.V[3].y = 0.09907823315620203;
L0.addAdjacents(4, [15, 8]);
L0.V[4].x = 0.048391663846613454;
L0.V[4].y = 0.2869258415400829;
L0.addAdjacents(5, [13, 18, 2, 14]);
L0.V[5].x = -0.10729690342740408;
L0.V[5].y = -0.27581739326121796;
L0.addAdjacents(6, [9, 16]);
L0.V[6].x = 0.1356076057585665;
L0.V[6].y = 0.1575883764949899;
L0.addAdjacents(7, [12]);
L0.V[7].x = -0.2921253730990049;
L0.V[7].y = 0.11008021491096583;
L0.addAdjacents(8, [3, 4, 15]);
L0.V[8].x = -0.042344506244819544;
L0.V[8].y = 0.293039177368812;
L0.addAdjacents(9, [6, 10, 16]);
L0.V[9].x = 0.19367641814276787;
L0.V[9].y = 0.2243609154109334;
L0.addAdjacents(10, [11, 9, 16]);
L0.V[10].x = 0.2815393262131356;
L0.V[10].y = 0.10888530373904673;
L0.addAdjacents(11, [0, 10, 16, 14, 17]);
L0.V[11].x = 0.2550641754278322;
L0.V[11].y = -0.0983552161266207;
L0.addAdjacents(12, [7]);
L0.V[12].x = -0.227026501197253;
L0.V[12].y = 0.2074505336440716;
L0.addAdjacents(13, [1, 2, 5]);
L0.V[13].x = -0.20793925383262188;
L0.V[13].y = -0.2038153347607826;
L0.addAdjacents(14, [16, 18, 11, 5]);
L0.V[14].x = 0.10325314442384055;
L0.V[14].y = -0.2612491879110565;
L0.addAdjacents(15, [4, 8, 3, 2]);
L0.V[15].x = -0.12209387028264901;
L0.V[15].y = 0.2503533146775539;
L0.addAdjacents(16, [14, 17, 6, 11, 9, 10]);
L0.V[16].x = 0.2583641628615742;
L0.V[16].y = 0.005975475592891034;
L0.addAdjacents(17, [16, 11, 0]);
L0.V[17].x = 0.2306723380033283;
L0.V[17].y = -0.18125890886396023;
L0.addAdjacents(18, [5, 14]);
L0.V[18].x = 0.029831160888659364;
L0.V[18].y = -0.29450664675219834;

let L1 = new Graph(18);
L1.addAdjacents(0, [11, 10]);
L1.V[0].x = 0.010133938506503055;
L1.V[0].y = -0.26505042090248193;
L1.addAdjacents(1, [14, 4]);
L1.V[1].x = -0.19650874417882178;
L1.V[1].y = 0.19448381459123068;
L1.addAdjacents(2, [10]);
L1.V[2].x = -0.09133411743484549;
L1.V[2].y = -0.051054290238406075;
L1.addAdjacents(3, [17, 8]);
L1.V[3].x = 0.2612153468448189;
L1.V[3].y = -0.05191969961735276;
L1.addAdjacents(4, [16, 1, 13, 6, 14]);
L1.V[4].x = -0.0429985030810832;
L1.V[4].y = 0.2520201661481808;
L1.addAdjacents(5, [16, 13]);
L1.V[5].x = 0.25722558537295265;
L1.V[5].y = 0.0906538649417746;
L1.addAdjacents(6, [13, 16, 4, 14]);
L1.V[6].x = 0.03851642516435102;
L1.V[6].y = 0.2410383878253776;
L1.addAdjacents(7, [12, 15]);
L1.V[7].x = -0.2658887096294878;
L1.V[7].y = 0.04277657353373507;
L1.addAdjacents(8, [3, 17, 9]);
L1.V[8].x = 0.22375190569443967;
L1.V[8].y = -0.13792690365101548;
L1.addAdjacents(9, [17, 8]);
L1.V[9].x = 0.13598661757481972;
L1.V[9].y = -0.21913679401400107;
L1.addAdjacents(10, [2, 0, 11]);
L1.V[10].x = -0.12480187587877117;
L1.V[10].y = -0.19545812682970168;
L1.addAdjacents(11, [0, 10]);
L1.V[11].x = -0.09178189524839143;
L1.V[11].y = -0.25236131392690825;
L1.addAdjacents(12, [7, 15]);
L1.V[12].x = -0.2350847032654629;
L1.V[12].y = -0.13226480060188386;
L1.addAdjacents(13, [16, 6, 4, 5]);
L1.V[13].x = 0.1666006687729035;
L1.V[13].y = 0.10827229211456411;
L1.addAdjacents(14, [1, 4, 6]);
L1.V[14].x = -0.132880942550913;
L1.V[14].y = 0.15378806330451464;
L1.addAdjacents(15, [7, 12]);
L1.V[15].x = -0.23457222145573722;
L1.V[15].y = -0.026583551551726137;
L1.addAdjacents(16, [4, 5, 13, 6]);
L1.V[16].x = 0.1639783320600159;
L1.V[16].y = 0.19281473217529474;
L1.addAdjacents(17, [3, 9, 8]);
L1.V[17].x = 0.13024397532099447;
L1.V[17].y = -0.1022988894175949;

let builtinGraphs = [g1, K5, K3, K2_2, K2_4, p4, K3K3, PYR3, PYR4, PYR5, bidakis_cube, golomb, R0, R1, R2, R3, R4, L0, L1];