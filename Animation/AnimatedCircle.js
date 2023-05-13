const RADIUS = 15;

class AnimatedCircle extends AnimatedObject {
    isOnTop = true;

    #drawHighlight() {
        if (this.highlighted) {
            context.fillStyle = RED;
            context.beginPath();
            context.arc(this.centerX, this.centerY, RADIUS + HIGHLIGHT_WIDTH,
                0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
    }

    #drawCircle() {
        context.beginPath();
        context.arc(this.centerX, this.centerY, RADIUS, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.stroke();
    }

    setColor(color = BLACK) {
        if (color === BLACK ) {
            this.labelColor = DEFAULT_LABEL_COLOR;
            this.foregroundColor = DEFAULT_FOREGROUND_COLOR;
            this.backgroundColor = GREY;
        } else {
            this.labelColor = DARK_RED;
            this.foregroundColor = RED;
            this.backgroundColor = PINK;
        }
    }

    draw() {
        this.#drawHighlight();
        this.setStyle();
        this.#drawCircle();
        this.drawLabel();
    }

    getAttachPoint(fromX, fromY) {
        const xVec = fromX - this.centerX;
        const yVec = fromY - this.centerY;
        const len = Math.sqrt(xVec * xVec + yVec * yVec);
        if (len === 0) {
            return [this.centerX, this.centerY];
        }

        return [this.centerX + (xVec / len) * RADIUS,
            this.centerY + (yVec / len) * RADIUS];
    }

}

function getAttachPoint(fromX, fromY, toX, toY) {
    const xVec = fromX - toX;
    const yVec = fromY - toY;
    const len = Math.sqrt(xVec * xVec + yVec * yVec);
    if (len === 0) {
        return [toX, toY];
    }

    return [toX + (xVec / len) * RADIUS,
        toY + (yVec / len) * RADIUS];
}