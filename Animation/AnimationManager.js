let drawable_objects = []

let rbNodes = []
let rbEdges = []
let bNodes = []
let bEdges = []

function redrawAll() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drawable_objects.length; ++i) {
        if (drawable_objects[i].isVisible && !drawable_objects[i].isOnTop) {
            drawable_objects[i].draw();
        }
    }

    for (let i = 0; i < drawable_objects.length; ++i) {
        if (drawable_objects[i].isVisible && drawable_objects[i].isOnTop) {
            drawable_objects[i].draw();
        }
    }
    status.draw();
}

function addCircle(circle) {
    if (circle != null) {
        drawable_objects.push(circle);
        rbNodes.push(circle);
    }
    redrawAll();
}

function clear() {
    drawable_objects = []
    rbNodes = []
    rbEdges = []
    bNodes = []
    bEdges = []
    redrawAll();
}

function disableAllButtons() {
    insertButton.disabled = true;
    findButton.disabled = true;
    deleteButton.disabled = true;
    clearButton.disabled = true;
}

function enableAllButtons() {
    insertButton.disabled = false;
    findButton.disabled = false;
    deleteButton.disabled = false;
    clearButton.disabled = false;
}

async function moveAll(time = 1000) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drawable_objects.length; ++i) {
        if (drawable_objects[i].isVisible && !drawable_objects[i].isOnTop) {
            if (drawable_objects[i].isMoving) {
                drawable_objects[i].move(this.movingToX, this.movingToY);
            } else {
                drawable_objects[i].draw();
            }
        }
    }

    for (let i = 0; i < drawable_objects.length; ++i) {
        if (drawable_objects[i].isVisible && drawable_objects[i].isOnTop) {
            if (drawable_objects[i].isMoving) {
                drawable_objects[i].move(this.movingToX, this.movingToY);
            } else {
                drawable_objects[i].draw();
            }
        }
    }

    await delay(time);
}