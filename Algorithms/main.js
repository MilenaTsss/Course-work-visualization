let width;
let height;

let redBlackTree;
let bTree;
let animationManager;

let canvas;
let context;
let status;

let insertField;
let insertButton;
let deleteField;
let deleteButton;
let findField;
let findButton;
let printButton;
let clearButton;

let RBTreeStartCoordinates;


function associateFields() {
    insertField = document.getElementById("insert")
    insertButton = document.getElementById("insertButton")
    deleteField = document.getElementById("delete")
    deleteButton = document.getElementById("deleteButton")
    findField = document.getElementById("find")
    findButton = document.getElementById("findButton")
    printButton = document.getElementById("printButton")
    clearButton = document.getElementById("clearButton")
}

function getCanvas() {
    canvas = document.querySelector("canvas");
    width = canvas.width;
    height = canvas.height;
    context = canvas.getContext('2d');
    RBTreeStartCoordinates = [width / 4, 40];
    status = new AnimatedLabel("Start");
}

async function init() {
    associateFields();
    getCanvas();

    redBlackTree = new RedBlackTree();
    status.draw()

    //bTree = new BTree();

    /*let head = createBlackCircle(width / 4, 30, "2");
    head.draw();

    let left = createRedCircle(head.centerX - 40, head.centerY + 60, "1");
    left.draw();

    let right = createRedCircle(head.centerX + 40, head.centerY + 60, "3");
    right.draw();

    let headAttach = head.getTail();
    let leftAttach = left.getHead();
    let rightAttach = right.getHead();

    let leftLine = new AnimatedLine(headAttach[0], headAttach[1], leftAttach[0], leftAttach[1]);
    leftLine.draw();

    let rightLine = new AnimatedLine(headAttach[0], headAttach[1], rightAttach[0], rightAttach[1]);
    rightLine.draw();

    setTimeout(() => {
        left.move(head.centerX - 80, head.centerY + 80);
        right.move(head.centerX + 80, head.centerY + 80);
        leftLine.move(head.centerX - 80,  head.centerY + 80 - head.radius - 4);
        rightLine.move(head.centerX + 80, head.centerY + 80 - head.radius - 4);
    }, 1000);*/

    //const RBtree = new RedBlackTree();

    await redBlackTree.insertNode(4);

    await delay(2000);

    await redBlackTree.insertNode(5);

    await delay(2000);

    await redBlackTree.insertNode(6);

    await delay(2000);

    await redBlackTree.insertNode(7);

    await delay(2000);

    await redBlackTree.insertNode(1);

    await delay(2000);

    await redBlackTree.insertNode(9);

    await delay(2000);

    await redBlackTree.insertNode(11);

    await delay(2000);

    await redBlackTree.insertNode(13);

    await delay(2000);

    //await redBlackTree.insertNode(-2);

    //await delay(2000);

    /*await redBlackTree.insertNode(-2);

    await delay(2000);*/

    /*setTimeout(() => {
        redBlackTree.insertNode(1);
        //console.log(redR.highlighted);
    }, 2000)

    setTimeout(() => {
        redBlackTree.insertNode(3);
        //console.log(redR.highlighted);
    }, 4060)

    setTimeout(() => {
        redBlackTree.insertNode(0);
        //console.log(redR.highlighted);
    }, 6060)

    setTimeout(() => {
        redBlackTree.insertNode(-1);
        //console.log(redR.highlighted);
    }, 8060)*/

    /*RBtree.insertNode(1);
    const head = RBtree.root;
    const left = RBtree.root.left;
    head.draw(100, 100);
    head.graphic.draw();

    left.draw(50, 150);
    left.graphic.draw();*/
    //console.log(RBtree);


    //let blackC = createBlackCircle(50, 80, "", "234");
    //blackC.draw();
    //blackC.move(204, 204);

    //blackC.move(51, 81);

    /*

    let redC = createRedCircle(60, 100, 434, "434");
    redC.draw();

    let redR = createRedRectangle(200, 200, 23, "23");
    redR.highlighted = true;
    redR.draw();

    setTimeout(() => {
        redR.clear();
        console.log(redR.highlighted);
    }, 3000);*/

    //let blackR = createBlackRectangle(200, 200, 233, "233");
    //blackR.highlighted = true;
    //blackR.draw();
    //blackR.move(302, 302);


    //animationManager = initCanvas();
    //redBlackTree = new RedBlack();
    //bTree = new BTree(animationManager, canvas.width, canvas.height)
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}