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
let speedField;
let speedButton;

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
    speedField = document.getElementById("speed");
    speedButton = document.getElementById("speedButton");
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
    setStatus("Starting");
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}