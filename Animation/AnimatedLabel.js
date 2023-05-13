class AnimatedLabel extends AnimatedObject {
    constructor(label) {
        super(70,height - 30,  label);
    }

    draw() {
        context.textAlign = 'center';
        context.font = '20px Times New Roman';
        context.textBaseline = 'middle';
        context.fillStyle = this.labelColor;
        context.fillText(this.label, this.centerX, this.centerY);
    }
}