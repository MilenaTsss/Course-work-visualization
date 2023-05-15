class AnimatedLine extends AnimatedObject {
    beginX;
    endX;
    beginY;
    endY;

    moveBeginX = null;
    moveBeginY = null;
    moveEndX = null;
    moveEndY = null;


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

    move() {
        if (this.beginX === this.moveBeginX && this.beginY === this.moveBeginY
            && this.endX === this.moveEndX && this.endY === this.moveEndY) {
            this.isMoving = false;
            redrawAll();
            cancelAnimationFrame(this.move);
            return;
        }

        requestAnimationFrame(() => {
            this.move();
        });

        if (this.moveBeginX != null && this.moveBeginX !== this.beginX) {
            if (Math.abs(this.moveBeginX - this.beginX) < SPEED) {
                this.beginX = this.moveBeginX;
            }
            this.beginX += Math.sign(this.moveBeginX - this.beginX) * SPEED;
        }

        if (this.moveBeginY != null && this.moveBeginY !== this.beginY) {
            if (Math.abs(this.moveBeginY - this.beginY) < SPEED) {
                this.beginY = this.moveBeginY;
            }
            this.beginY += Math.sign(this.moveBeginY - this.beginY) * SPEED;
        }

        if (this.moveEndX != null && this.moveEndX !== this.endX) {
            if (Math.abs(this.moveEndX - this.endX) < SPEED) {
                this.endX = this.moveEndX;
            }
            this.endX += Math.sign(this.moveEndX - this.endX) * SPEED;
        }

        if (this.moveEndX != null && this.moveEndY !== this.endY) {
            if (Math.abs(this.moveEndY - this.endY) < SPEED) {
                this.endY = this.moveEndY;
            }
            this.endY += Math.sign(this.moveEndY - this.endY) * SPEED;
        }

        redrawAll();
    }
}