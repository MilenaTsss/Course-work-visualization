class BTreeNode {
    leftNode = null;
    middleNode = null;
    rightNode = null;

    parent = null;
    index = null; // index of this element in relation to parent

    left = null;
    middleLeft = null;
    middleRight = null;
    right = null;

    constructor(leftKey = null, left = null, middleLeft = null, parent = null, index = null) {
        if (leftKey != null) {
            if (leftKey.key !== undefined) {
                this.leftNode = leftKey;
                leftKey.bNode = this;
                leftKey.insiseIndex = 0;
            } else {
                this.leftNode = new Node(leftKey, 0);
                this.leftNode.bNode = this;
            }
        }

        this.left = left;
        this.middleLeft = middleLeft;

        if (left != null) {
            left.parent = this;
            left.index = 0;
        }

        if (middleLeft != null) {
            middleLeft.parent = this;
            middleLeft.index = 1;
        }

        this.parent = parent;
        this.index = index;
    }

    fixNodes() {
        if (this.leftNode != null) {
            this.leftNode.insideIndex = 0;
            this.leftNode.bNode = this;
        }

        if (this.middleNode != null) {
            this.middleNode.insideIndex = 1;
            this.middleNode.bNode = this;
        }

        if (this.rightNode != null) {
            this.rightNode.insideIndex = 2;
            this.rightNode.bNode = this;
        }
    }

    fixChildren() {
        if (this.left != null) {
            this.left.parent = this;
            this.left.index = 0;
        }

        if (this.middleLeft != null) {
            this.middleLeft.parent = this;
            this.middleLeft.index = 1;
        }

        if (this.middleRight != null) {
            this.middleRight.parent = this;
            this.middleRight.index = 2;
        }

        if (this.right != null) {
            this.right.parent = this;
            this.right.index = 3;
        }
    }

    getChild(index) {
        switch (index) {
            case 0:
                return this.left;
            case 1:
                return this.middleLeft;
            case 2:
                return this.middleRight;
            case 3:
                return this.right;
        }

        return null;
    }

    getChildIndex(child) {
        if (child === this.left) {
            return 0;
        } else if (child === this.middleLeft) {
            return 1;
        } else if (child === this.middleRight) {
            return 2;
        } else if (child === this.right) {
            return 3;
        }

        return -1;
    }

    setChild(child, index) {
        switch (index) {
            case 0:
                this.left = child;
                break;
            case 1:
                this.middleLeft = child;
                break;
            case 2:
                this.middleRight = child;
                break;
            case 3:
                this.right = child;
                break;
        }

        this.fixChildren();
    }

    getNode(index) {
        switch (index) {
            case 0:
                return this.leftNode;
            case 1:
                return this.middleNode;
            case 2:
                return this.rightNode;
        }

        return null;
    }

    containsKey(key) {
        return this.leftNode != null && key === this.leftNode.key ||
            this.middleNode != null && key === this.middleNode.key ||
            this.rightNode != null && key === this.rightNode.key;
    }

    getKeyIndex(key) {
        if (this.leftNode != null && key === this.leftNode.key) {
            return 0;
        } else if (this.middleNode != null && key === this.middleNode.key) {
            return 1;
        } else if (this.rightNode != null && key === this.rightNode.key) {
            return 2;
        }

        return -1;
    }

    getNodeIndex(node) {
        if (this.leftNode === node) {
            return 0;
        } else if (this.middleNode === node) {
            return 1;
        } else if (this.rightNode === node) {
            return 2;
        }

        return -1;
    }

    countKeys() {
        if (this.rightNode != null) {
            return 3;
        } else if (this.middleNode != null) {
            return 2;
        }
        return 1;
    }

    setKey(key, index) {
        switch (index) {
            case 0:
                this.leftNode.setKey(key);
                break;
            case 1:
                this.middleNode.setKey(key);
                break;
            case 2:
                this.rightNode.setKey(key);
                break;
        }
    }

    setNode(node, index) {
        switch (index) {
            case 0:
                this.leftNode = node;
                break;
            case 1:
                this.middleNode = node;
                break;
            case 2:
                this.rightNode = node;
                break;
        }
        this.fixNodes();
    }

    insertKey(key) {
        if (this.leftNode == null || key < this.leftNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = this.leftNode;
            this.leftNode = new Node(key, 0, this);
        } else if (this.middleNode == null || key < this.middleNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = new Node(key, 1, this);
        } else {
            this.rightNode = new Node(key, 2, this);
        }
    }

    nextNode(key) {
        if (this.leftNode == null || key < this.leftNode.key) {
            return this.left;
        } else if (this.middleNode == null || key < this.middleNode.key) {
            return this.middleLeft;
        } else if (this.rightNode == null || key < this.rightNode.key) {
            return this.middleRight;
        }

        return this.right;
    }

    appendNodeWithChild(node, child) {
        if (this.middleNode == null) {
            this.middleNode = node;
            this.middleRight = child;
        } else {
            this.rightNode = node;
            this.right = child;
        }

        this.fixNodes();
        this.fixChildren();
    }

    // Inserts a new key into the proper location in this node, and
    // sets the children on either side of the inserted key.
    // Precondition: This node has 2 or fewer keys

    insertNode(node) {
        if (this.leftNode == null || node.key < this.leftNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = this.leftNode;
            this.leftNode = node;
        } else if (this.middleNode == null || node.key < this.middleNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = node;
        } else {
            this.rightNode = node;
        }

        this.fixNodes();
    }

    insertKeyWithChildren(node, leftChild, rightChild) {
        if (node == null) {
            return;
        }

        if (this.leftNode == null || node.key < this.leftNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = this.leftNode;
            this.leftNode = node;

            this.right = this.middleRight;
            this.middleRight = this.middleLeft;
            this.middleLeft = rightChild;
            this.left = leftChild;
        } else if (this.middleNode == null || node.key < this.middleNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = node;

            this.right = this.middleRight;
            this.middleRight = rightChild;
            this.middleLeft = leftChild;
        } else {
            this.rightNode = node;

            this.right = rightChild;
            this.middleRight = leftChild;
        }

        this.fixChildren();
        this.fixNodes();
    }

    // Returns true if this node is a leaf, false otherwise.
    isLeaf() {
        return this.left == null;
    }

    removeKey(index) {
        switch (index) {
            case 0: {
                this.leftNode.delete();
                this.leftNode = this.middleNode;
                this.middleNode = this.rightNode;
                this.rightNode = null;

                this.left = this.middleLeft;
                this.middleLeft = this.middleRight;
                this.middleRight = this.right;
                if (this.right != null) {
                    this.right.delete();
                }
                this.right = null;
                break;
            }

            case 1: {
                this.middleNode.delete();
                this.middleNode = this.rightNode;
                this.rightNode = null;

                this.middleRight = this.right;
                if (this.right != null) {
                    this.right.delete();
                }
                this.right = null;
                break;
            }
            case 2: {
                this.rightNode.delete();
                this.rightNode = null;
                if (this.right != null) {
                    this.right.delete();
                }
                this.right = null;
            }
        }
        this.fixChildren();
        this.fixNodes();
    }

    simpleRemoveNode(index) {
        switch (index) {
            case 0: {
                this.leftNode = this.middleNode;
                this.middleNode = this.rightNode;
                this.rightNode = null;

                this.left = this.middleLeft;
                this.middleLeft = this.middleRight;
                this.middleRight = this.right;
                this.right = null;
                break;
            }

            case 1: {
                this.middleNode = this.rightNode;
                this.rightNode = null;

                this.middleRight = this.right;
                this.right = null;
                break;
            }
            case 2: {
                this.rightNode = null;
                this.right = null;
            }
        }
        this.fixChildren();
        this.fixNodes();
    }

    removeRightmostChild() {
        let removed = null;
        if (this.right != null) {
            removed = this.right;
            this.right = null;
        } else if (this.middleRight != null) {
            removed = this.middleRight;
            this.middleRight = null;
        }

        return removed;
    }

    // Removes and returns the rightmost key. Three possible cases exist:
    // No children are changed in any case.
    removeRightmostNode() {
        let removed = null;
        if (this.rightNode != null) {
            removed = this.rightNode;
            this.rightNode = null;
        } else if (this.middleNode != null) {
            removed = this.middleNode;
            this.middleNode = null;
        }
        return removed;
    }

    delete() {
        if (this.leftNode != null) {
            this.leftNode.delete();
        }
        if (this.middleNode != null) {
            this.middleNode.delete();
        }
        if (this.rightNode != null) {
            this.rightNode.delete();
        }
    }

    drawHighlighted() {
        if (this.leftNode != null) {
            this.leftNode.drawHighlighted();
        }
        if (this.middleNode != null) {
            this.middleNode.drawHighlighted();
        }
        if (this.rightNode != null) {
            this.rightNode.drawHighlighted();
        }
    }

    clearHighlight() {
        if (this.leftNode != null) {
            this.leftNode.clearHighlight();
        }
        if (this.middleNode != null) {
            this.middleNode.clearHighlight();
        }
        if (this.rightNode != null) {
            this.rightNode.clearHighlight();
        }
    }

    move() {
        this.fixChildren();
        this.fixNodes();

        if (this.leftNode != null) {
            this.leftNode.move();
        }

        if (this.middleNode != null) {
            this.middleNode.move();
        }

        if (this.rightNode != null) {
            this.rightNode.move();
        }
    }
}


// Node
class Node {
    bNode; // BTree node with 3 children
    key;
    color;
    graphic;

    insideIndex;
    edgeGraphic; // edge to parent

    constructor(key, insideIndex, bNode = null) {
        this.key = key;
        this.color = RED;
        this.insideIndex = insideIndex;
        this.bNode = bNode;

        this.graphic = new AnimatedRectangle(600, 400, this.key);
        this.graphic.setColor(this.color);
        drawable_objects.push(this.graphic);
    }

    setColor(newColor) {
        if (newColor === this.color) {
            return;
        }

        let colorText = "black";
        if (newColor === RED) {
            colorText = "red";
        }

        setStatus("Recolor " + this.key + " to " + colorText);

        this.color = newColor;
        this.graphic.setColor(newColor);
        redrawAll();
    }

    setKey(key) {
        this.key = key;
        this.graphic.label = key;
    }

    drawHighlighted() {
        this.graphic.drawHighlighted();
    }

    clearHighlight() {
        this.graphic.clearHighlight();
    }

    move() {
        const parent = this.bNode.parent;

        if (parent == null) {
            if (this.edgeGraphic != null) {
                this.edgeGraphic.clear();
            }

            this.graphic.isMoving = true;
            this.graphic.movingToX = BTreeStartCoordinates[0] + this.insideIndex * 30;
            this.graphic.movingToY = BTreeStartCoordinates[1];
        } else {
            let parentX = parent.leftNode.graphic.centerX;
            let parentY = parent.leftNode.graphic.centerY;


            if (parent.leftNode.graphic.isMoving) {
                parentX = parent.leftNode.graphic.movingToX;
                parentY = parent.leftNode.graphic.movingToY;
            }

            if (this.bNode.index === 0) {
                this.graphic.movingToX = parentX + this.insideIndex * 30 - 150 * this.bNode.level;
                this.graphic.movingToY = parentY + 80;
            } else if (this.bNode.index === 1) {
                this.graphic.movingToX = parentX + this.insideIndex * 30 - 50 * this.bNode.level;
            } else if (this.bNode.index === 2) {
                this.graphic.movingToX = parentX + this.insideIndex * 30 + 50 * this.bNode.level;
            } else {
                this.graphic.movingToX = parentX + this.insideIndex * 30 + 150 * this.bNode.level;
            }


            this.graphic.isMoving = true;
            this.graphic.movingToY = parentY + 80;

            if (this.insideIndex === 0) {
                const head = getAttachPoint(
                    this.graphic.movingToX, this.graphic.movingToY,
                    parentX, parentY);
                const tail = getAttachPoint(parentX, parentY,
                    this.graphic.movingToX, this.graphic.movingToY);

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
            } else {
                if (this.edgeGraphic != null) {
                    this.edgeGraphic.clear();
                    this.edgeGraphic = null;
                }
            }
        }
    }

    deleteEdge() {
        if (this.edgeGraphic != null) {
            this.edgeGraphic.clear();
            this.edgeGraphic = null;
        }
    }

    delete() {
        if (this.graphic != null) {
            this.graphic.clear();
            this.graphic = null;
        }

        if (this.edgeGraphic != null) {
            this.edgeGraphic.clear();
            this.edgeGraphic = null;
        }
    }
}