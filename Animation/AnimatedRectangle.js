const RECTANGLE_WIDTH = 40;
const RECTANGLE_HEIGHT = 20;

class AnimatedRectangle extends AnimatedObject {
    constructor(x, y, label) {
        super(x, y, label);
    }

    #drawHighlight() {
        if (this.highlighted) {
            context.strokeStyle = RED;
            context.fillStyle = RED;
            context.fillRect(this.centerX - HIGHLIGHT_WIDTH - RECTANGLE_WIDTH / 2.0,
                this.centerY - HIGHLIGHT_WIDTH - RECTANGLE_HEIGHT / 2.0,
                RECTANGLE_WIDTH + 2 * HIGHLIGHT_WIDTH, RECTANGLE_HEIGHT + 2 * HIGHLIGHT_WIDTH);
        }
    }

    #drawRectangle() {
        context.fillRect(this.centerX - RECTANGLE_WIDTH / 2.0,
            this.centerY - RECTANGLE_HEIGHT / 2.0,
            RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
        context.strokeRect(this.centerX - RECTANGLE_WIDTH / 2.0,
            this.centerY - RECTANGLE_HEIGHT / 2.0,
            RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
    }

    draw() {
        this.#drawHighlight();
        this.setStyle();
        this.#drawRectangle();
        this.drawLabel();
    }

    async clearHighlight() {
        this.highlighted = false;
        redrawAll();
    }
}

function createBlackRectangle(x, y, label) {
    const rectangle = new AnimatedRectangle(x, y, label);
    rectangle.backgroundColor = GREY;
    return rectangle;
}

function createRedRectangle(x, y, label) {
    const rectangle = new AnimatedRectangle(x, y, label);
    rectangle.labelColor = DARK_RED;
    rectangle.foregroundColor = RED;
    rectangle.backgroundColor = PINK;
    return rectangle;
}