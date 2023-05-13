const SPEED = 5;
const STROKE_WIDTH = 1;
const HIGHLIGHT_WIDTH = 3;

class AnimatedObject {
    centerX = 0;
    centerY = 0;
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

    move(toX, toY) {
        if (this.centerX === toX && this.centerY === toY) {
            this.highlighted = false;
            redrawAll();
            cancelAnimationFrame(this.move);
            return;
        }


        requestAnimationFrame(() => {
            this.move(toX, toY);
        });

        this.highlighted = true;

        if (toX !== this.centerX) {
            if (Math.abs(toX - this.centerX) < SPEED) {
                this.centerX = toX;
            }
            this.centerX += Math.sign(toX - this.centerX) * SPEED;
        }

        if (toY !== this.centerY) {
            if (Math.abs(toY - this.centerY) < SPEED) {
                this.centerY = toY;
            }
            this.centerY += Math.sign(toY - this.centerY) * SPEED;
        }

        redrawAll();
    }

    clear() {
        this.isVisible = false;
        redrawAll();
    }
}