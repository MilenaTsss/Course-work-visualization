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

    draw() {
        this.#drawHighlight();
        this.setStyle();
        this.#drawCircle();
        this.drawLabel();
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