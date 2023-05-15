let SPEED = 10;
const STROKE_WIDTH = 1;
const HIGHLIGHT_WIDTH = 3;

class AnimatedObject {
    centerX = 0;
    centerY = 0;
    isMoving = false;
    movingToX = null;
    movingToY = null;
    label = "";
    isVisible = true;
    isOnTop = false;

    constructor(x, y, label) {
        this.centerX = x;
        this.centerY = y;
        if (label !== undefined && label != null) {
            this.label = label;
        }
    }

    backgroundColor = DEFAULT_BACKGROUND_COLOR;
    foregroundColor = DEFAULT_FOREGROUND_COLOR;
    labelColor = DEFAULT_LABEL_COLOR;
    highlighted = false;

    draw() {
    }

    drawLabel() {
        context.textAlign = 'center';
        context.font = '8px sans-serif';
        context.textBaseline = 'middle';
        context.lineWidth = STROKE_WIDTH;
        context.fillStyle = this.labelColor;
        context.fillText(this.label, this.centerX, this.centerY);
    }

    setStyle() {
        context.fillStyle = this.backgroundColor;
        context.strokeStyle = this.foregroundColor;
        context.lineWidth = STROKE_WIDTH;
    }

    drawHighlighted() {
        this.highlighted = true;
        redrawAll();
    }

    clearHighlight() {
        this.highlighted = false;
        redrawAll();
    }

    move() {
        if (!this.isMoving) {
            return;
        }

        if (this.centerX === this.movingToX && this.centerY === this.movingToY) {
            this.isMoving = false;
            this.highlighted = false;
            redrawAll();
            cancelAnimationFrame(this.move);
            return;
        }


        requestAnimationFrame(() => {
            this.move();
        });

        this.highlighted = true;

        if (this.movingToX !== this.centerX) {
            if (Math.abs(this.movingToX - this.centerX) < SPEED) {
                this.centerX = this.movingToX;
            }
            this.centerX += Math.sign(this.movingToX - this.centerX) * SPEED;
        }

        if (this.movingToY !== this.centerY) {
            if (Math.abs(this.movingToY - this.centerY) < SPEED) {
                this.centerY = this.movingToY;
            }
            this.centerY += Math.sign(this.movingToY - this.centerY) * SPEED;
        }

        redrawAll();
    }

    clear() {
        this.isVisible = false;
        redrawAll();
    }
}

function setSpeed() {
    let value = parseInt(speedField.value);
    if (!isNaN(value) && value >= 1 && value <= 20) {
        speedField.value = "";
        SPEED = value;
    }
}