class AnimatedLine extends AnimatedObject {
    beginX;
    endX;
    beginY;
    endY;


    constructor(x1, y1, x2, y2) {
        super();
        this.beginX = x1;
        this.beginY = y1;
        this.endX = x2;
        this.endY = y2;
    }

    #drawLine() {
        context.beginPath();
        context.moveTo(this.beginX, this.beginY);
        context.lineTo(this.endX, this.endY);
        context.stroke();
        context.closePath();
    }

    draw() {
        this.setStyle();
        this.#drawLine();
    }

    move(toX, toY) {
        if (this.endX === toX && this.endY === toY) {
            redrawAll();
            cancelAnimationFrame(this.move);
            return;
        }

        requestAnimationFrame(() => {
            this.move(toX, toY);
        });

        if (toX !== this.endX) {
            if (Math.abs(toX - this.endX) < SPEED) {
                this.endX = toX;
            }
            this.endX += Math.sign(toX - this.endX) * SPEED;
        }

        if (toY !== this.endY) {
            if (Math.abs(toY - this.endY) < SPEED) {
                this.endY = toY;
            }
            this.endY += Math.sign(toY - this.endY) * SPEED;
        }

        redrawAll();
    }

    moveHead(toX, toY) {
        if (this.beginX === toX && this.beginY === toY) {
            redrawAll();
            cancelAnimationFrame(this.moveHead);
            return;
        }

        requestAnimationFrame(() => {
            this.moveHead(toX, toY);
        });

        if (toX !== this.beginX) {
            if (Math.abs(toX - this.beginX) < SPEED) {
                this.beginX = toX;
            }
            this.beginX += Math.sign(toX - this.beginX) * SPEED;
        }

        if (toY !== this.beginY) {
            if (Math.abs(toY - this.beginY) < SPEED) {
                this.beginY = toY;
            }
            this.beginY += Math.sign(toY - this.beginY) * SPEED;
        }

        redrawAll();
    }

    moveAll(beginToX, beginToY, endToX, endToY) {
        if (this.beginX === beginToX && this.beginY === beginToY
            && this.endX === endToX && this.endY === endToY) {
            redrawAll();
            cancelAnimationFrame(this.moveHead);
            return;
        }

        requestAnimationFrame(() => {
            this.moveAll(beginToX, beginToY, endToX, endToY);
        });

        if (beginToX !== this.beginX) {
            if (Math.abs(beginToX - this.beginX) < SPEED) {
                this.beginX = beginToX;
            }
            this.beginX += Math.sign(beginToX - this.beginX) * SPEED;
        }

        if (beginToY !== this.beginY) {
            if (Math.abs(beginToY - this.beginY) < SPEED) {
                this.beginY = beginToY;
            }
            this.beginY += Math.sign(beginToY - this.beginY) * SPEED;
        }

        if (endToX !== this.endX) {
            if (Math.abs(endToX - this.endX) < SPEED) {
                this.endX = endToX;
            }
            this.endX += Math.sign(endToX - this.endX) * SPEED;
        }

        if (endToY !== this.endY) {
            if (Math.abs(endToY - this.endY) < SPEED) {
                this.endY = endToY;
            }
            this.endY += Math.sign(endToY - this.endY) * SPEED;
        }

        redrawAll();
    }
}