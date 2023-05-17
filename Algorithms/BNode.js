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

        if (child != null) {
            child.index = index;
        }
    }

    getKey(index) {
        switch (index) {
            case 0:
                return this.leftNode.key;
            case 1:
                return this.middleNode.key;
            case 2:
                return this.rightNode.key;
        }

        return null;
    }

    containsKey(key) {
        return this.leftNode != null && key === this.leftNode.key ||
            this.middleNode != null && key === this.middleNode.key ||
            this.rightNode != null && key === this.rightNode.key;
    }

    getKeyIndex(key) {
        if (key === this.leftNode.key) {
            return 0;
        } else if (key === this.middleNode.key) {
            return 1;
        } else if (key === this.rightNode.key) {
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
                this.left.setKey(key);
                break;
            case 1:
                this.middleLeft.setKey(key);
                break;
            case 2:
                this.middleRight.setKey(key);
                break;
            case 3:
                this.right.setKey(key);
                break;
        }
    }

    insertKey(key) {
        if (this.leftNode == null || key < this.leftNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = this.leftNode;
            this.leftNode = new Node(key, 0, this);
        } else if (this.middleNode == null || key < this.middleNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = new Node(key, 1, this);
        } else  {
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


    // Appends 1 key and 1 child to this node.
    // Preconditions:
    // 1. This node has 1 or 2 keys
    // 2. key > all keys in this node
    // 3. Child subtree contains only keys > key
    appendKeyAndChild(key, child) {
        if (this.middleNode == null) {
            this.middleNode = new Node(key, 1);
            this.middleRight = child;
        } else {
            this.rightNode = new Node(key, 2);
            this.right = child;
        }
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
        } else  {
            this.rightNode = node;
        }
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
            if (this.right != null) {
                this.right.index = 3;
            }

            this.middleRight = this.middleLeft;
            if (this.middleRight != null) {
                this.middleRight.index = 2;
            }

            this.middleLeft = rightChild;
            if (this.middleLeft != null) {
                this.middleLeft.index = 1;
            }

            this.left = leftChild;
            if (this.left != null) {
                this.left.index = 0;
            }

        } else if (this.middleNode == null || node.key < this.middleNode.key) {
            this.rightNode = this.middleNode;
            this.middleNode = node;

            this.right = this.middleRight;
            if (this.right != null) {
                this.right.index = 3;
            }

            this.middleRight = rightChild;
            if (this.middleRight != null) {
                this.middleRight.index = 2;
            }

            this.middleLeft = leftChild;
            if (this.middleLeft != null) {
                this.middleLeft.index = 1;
            }
        } else {
            this.rightNode = node;

            this.right = rightChild;
            if (this.right != null) {
                this.right.index = 3;
            }
            this.middleRight = leftChild;
            if (this.middleRight != null) {
                this.middleRight.index = 2;
            }
        }

        node.bNode = this;
    }

    // Returns true if this node is a leaf, false otherwise.
    isLeaf() {
        return this.left == null;
    }

    deleteNode() {
        if (this.leftNode != null) {
            this.leftNode.graphic.isVisible = false;
        }

        if (this.middleNode != null) {
            this.middleNode.graphic.isVisible = false;
        }

        if (this.rightNode != null) {
            this.rightNode.graphic.isVisible = false;
        }
    }

    move() {
        if (this.leftNode != null) {
            this.leftNode.insideIndex = 0;
            this.leftNode.move();
        }

        if (this.middleNode != null) {
            this.middleNode.insideIndex = 1;
            this.middleNode.move();
        }

        if (this.rightNode != null) {
            this.rightNode.insideIndex = 2;
            this.rightNode.move();
        }
    }
}


// Node
class Node {
    bNode;
    key;
    color;
    graphic;

    insideIndex;
    edgeGraphic; // edge to parent

    constructor(key, insideIndex, bNode = null, color = RED) {
        this.key = key;
        this.color = color;
        this.insideIndex = insideIndex;
        this.bNode = bNode;

        this.graphic = new AnimatedRectangle(600, 400, this.key);
        this.graphic.setColor(color);
        drawable_objects.push(this.graphic);
    }

    setColor(newColor) {
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
            }
        }
    }

    deleteEdge() {
        if (this.edgeGraphic != null) {
            this.edgeGraphic.clear();
            this.edgeGraphic = null;
        }
    }

}