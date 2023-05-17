let width;
let height;

let redBlackTree;
let bTree;

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
let speedField;
let speedButton;

let RBTreeStartCoordinates;
let BTreeStartCoordinates;


function associateFields() {
    insertField = document.getElementById("insert")
    insertButton = document.getElementById("insertButton")
    deleteField = document.getElementById("delete")
    deleteButton = document.getElementById("deleteButton")
    findField = document.getElementById("find")
    findButton = document.getElementById("findButton")
    printButton = document.getElementById("printButton")
    clearButton = document.getElementById("clearButton")
    speedField = document.getElementById("speed");
    speedButton = document.getElementById("speedButton");
}

function getCanvas() {
    canvas = document.querySelector("canvas");
    width = canvas.width;
    height = canvas.height;
    context = canvas.getContext('2d');
    RBTreeStartCoordinates = [width / 4, 50];
    BTreeStartCoordinates = [width * 3 / 4, 40];
    status = new AnimatedLabel("Start");
}

async function Insert() {
    let value = parseInt(insertField.value);
    if (!isNaN(value)) {
        insertField.value = "";
        disableAllButtons();

        await redBlackTree.insertNode(value);
        await delay(1000);
        await bTree.insertNode(value, null, null);
        await delay(1000);

        enableAllButtons();
    }
}

async function Find() {
    let value = parseInt(findField.value);
    if (!isNaN(value)) {
        findField.value = "";
        disableAllButtons();

        await redBlackTree.searchNode(value);
        await delay(1000);
        await bTree.searchNode(value, bTree.root);
        await delay(1000);

        enableAllButtons();
    }
}

async function Delete() {
    let value = parseInt(deleteField.value);
    if (!isNaN(value)) {
        deleteField.value = "";
        disableAllButtons();

        await redBlackTree.deleteNode(value);
        await delay(1000);
        await bTree.deleteNode(value);
        await delay(1000);

        enableAllButtons();
    }
}

function Clear() {
    redBlackTree.root = null;
    bTree.root = null;
    clearAll();
}


async function init() {
    associateFields();
    getCanvas();

    redBlackTree = new RedBlackTree();
    setStatus("Starting");
    console.log(redBlackTree);
    bTree = new BTree();
    console.log(bTree);

}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}