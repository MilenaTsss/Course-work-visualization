class RedBlackNode {
    data = 0;
    level = 0;
    left = null;
    right = null;
    parent = null;
    edgeGraphic = null; // edge to parent

    color;
    graphic;
    isNil = false;

    constructor(data, color = BLACK, nil = false) {
        this.data = data;
        this.isNil = nil;
        this.color = color;

        this.graphic = new AnimatedCircle(40, 400, this.data);
        this.graphic.setColor(color);
        if (nil === true) {
            this.graphic.isVisible = false;
        }
        drawable_objects.push(this.graphic);
    }

    deleteEdge() {
        if (this.edgeGraphic != null) {
            this.edgeGraphic.clear();
            this.edgeGraphic = null;
        }
    }

    setColor(newColor) {
        if (newColor === this.color) {
            return;
        }

        let colorText = "black";
        if (newColor === RED) {
            colorText = "red";
        }
        setStatus("Recolor " + this.data + " to " + colorText);

        this.color = newColor;
        this.graphic.setColor(newColor);
        redrawAll();
    }

    setData(data) {
        this.data = data;
        this.graphic.label = data;
    }

    drawHighlighted() {
        this.graphic.drawHighlighted();
    }

    clearHighlight() {
        this.graphic.clearHighlight();
    }

    move() {
        if (this.graphic.isVisible === false) {
            return;
        }

        if (this.parent == null) {
            this.deleteEdge();

            this.graphic.isMoving = true;
            this.graphic.movingToX = RBTreeStartCoordinates[0];
            this.graphic.movingToY = RBTreeStartCoordinates[1];
        } else {
            let parentX = this.parent.graphic.centerX;
            let parentY = this.parent.graphic.centerY;

            if (this.parent.graphic.isMoving) {
                parentX = this.parent.graphic.movingToX;
                parentY = this.parent.graphic.movingToY;
            }

            let direction = 1;
            if (this.data < this.parent.data) {
                direction = -1;
            }

            this.graphic.isMoving = true;
            this.graphic.movingToX = parentX + DISTANCE / Math.pow(COEFFICIENT, this.level) * direction;
            this.graphic.movingToY = parentY + DISTANCE / Math.pow(COEFFICIENT, this.level);

            const head = getAttachPoint(this.graphic.movingToX, this.graphic.movingToY, parentX, parentY);
            const tail = getAttachPoint(parentX, parentY, this.graphic.movingToX, this.graphic.movingToY);

            if (this.edgeGraphic != null) {
                this.edgeGraphic.isMoving = true;
                this.edgeGraphic.moveBeginX = head[0];
                this.edgeGraphic.moveBeginY = head[1];
                this.edgeGraphic.moveEndX = tail[0];
                this.edgeGraphic.moveEndY = tail[1];
            } else {
                this.edgeGraphic = new AnimatedLine(head[0], head[1], tail[0], tail[1]);
                drawable_objects.push(this.edgeGraphic);
            }
        }
    }
}