const DISTANCE = 100;
const COEFFICIENT = 1.2;

class RedBlackTree {
    root = null;

    async insert() {
        let value = parseInt(insertField.value);
        if (!isNaN(value)) {
            insertField.value = "";
            disableAllButtons();
            await this.insertNode(value);

            await delay(1000);
            enableAllButtons();
        }
    }

    async find() {
        let value = parseInt(findField.value);
        if (!isNaN(value)) {
            findField.value = "";
            disableAllButtons();
            await this.#searchNode(value);

            await delay(1000);
            enableAllButtons();
        }
    }

    async delete() {
        let value = parseInt(deleteField.value);
        if (!isNaN(value)) {
            deleteField.value = "";
            disableAllButtons();
            await this.#deleteNode(value);

            await delay(1000);
            enableAllButtons();
        }
    }

    clear() {
        this.root = null;
        clear();
    }

    #replaceParentsChild(parent, oldChild, newChild) {
        if (parent == null) {
            this.root = newChild;
        } else if (parent.left === oldChild) {
            parent.left = newChild;
        } else if (parent.right === oldChild) {
            parent.right = newChild;
        } else {
            throw "Node is not a child of its parent";
        }

        if (newChild != null) {
            newChild.parent = parent;
        }
    }

    #moveDown(node, direction = 1) {
        if (node == null) {
            return;
        }

        const finalX = node.graphic.centerX + DISTANCE / Math.pow(COEFFICIENT, node.level + 1) * direction;
        const finalY = node.graphic.centerY + DISTANCE / Math.pow(COEFFICIENT, node.level + 1);
        /*if (node.edgeGraphic != null) {
            node.edgeGraphic.moveHead(node.parent.graphic.centerX, node.parent.graphic.centerY);
            await delay(400);
        }*/

        node.move(finalX, finalY);
        return [finalX, finalY];
    }

    async #moveUp(node, direction = 1) {
        if (node == null) {
            return;
        }

        const finalX = node.parent.graphic.centerX + DISTANCE / Math.pow(COEFFICIENT, node.level + 1) * direction;
        const finalY = node.parent.graphic.centerY + DISTANCE / Math.pow(COEFFICIENT, node.level + 1);
        if (node.edgeGraphic != null) {
            node.edgeGraphic.moveHead(node.parent.graphic.centerX, node.parent.graphic.centerY);
            await delay(400);
        }
        node.move(finalX, finalY);
        return [finalX, finalY];
    }

    async #moveAllUp(node) {
        console.log("up");
        if (node != null) {
            console.log("up" + node);
            await this.#moveUp(node.left, -1);
            await this.#moveUp(node.right, 1);
            await delay(700);
            await this.#moveAllUp(node.left);
            await this.#moveAllUp(node.right);
        }
    }

    async #moveAllDown(node, direction = 1) {
        if (node != null) {
            if (node.left != null) {
                await this.#moveAllDown(node.left, -1);
            }
            if (node.right != null) {
                await this.#moveAllDown(node.right, 1);
            }
            this.#moveDown(node, direction);
        }
    }

    async #moveRotateRight(node, parent, left, right) {
        node.deleteEdge();
        left.deleteEdge();

        if (right != null) {
            right.deleteEdge();
        }

        const oldLeftX = left.graphic.centerX;
        const oldLeftY = left.graphic.centerY;

        left.parent = parent;
        this.#replaceParentsChild(parent, node, left)
        left.setEdge();
        left.move(node.graphic.centerX, node.graphic.centerY);

        if (left.left != null) {
            this.#checkGraphicMove(left, node.graphic.centerX, node.graphic.centerY, () => {
                left.left.edgeGraphic.moveAll(left.graphic.centerX, left.graphic.centerY, oldLeftX, oldLeftY)

                //left.left.edgeGraphic.moveHead(left.graphic.centerX, left.graphic.centerY);
                //left.left.edgeGraphic.move(oldLeftX, oldLeftY);
                left.left.move(oldLeftX, oldLeftY);
            })

            this.#checkGraphicMove(left.left, oldLeftX, oldLeftY, async () => {
                redrawAll();
                await this.#moveAllUp(left.left);
            })
        }


        await this.#moveAllDown(node.right);
        const finalCoordinatesNode = this.#moveDown(node);
        this.#checkGraphicMove(node, finalCoordinatesNode[0], finalCoordinatesNode[1], () => {
            node.left = right;
            if (right != null) {
                right.parent = node;
                this.#moveNode(right, () => {
                });
            }

            node.parent = left;
            left.right = node;
            node.setEdge();
        })
    }

    async #rotateRight(node) {
        const parent = node.parent;
        const left = node.left;
        console.log(node, parent, left, left.right);

        await this.#moveRotateRight(node, parent, left, left.right);

        /*node.left = left.right;
        if (left.right != null) {
            left.right.parent = node;
        }

        left.right = node;
        node.parent = left;

        this.replaceParentsChild(parent, node, left);*/
    }

    async #moveRotateLeft(node, parent, right, left) {
        node.deleteEdge();
        right.deleteEdge();

        if (left != null) {
            left.deleteEdge();
        }

        const oldRightX = right.graphic.centerX;
        const oldRightY = right.graphic.centerY;

        right.parent = parent;
        this.#replaceParentsChild(parent, node, right);
        right.setEdge();
        right.move(node.graphic.centerX, node.graphic.centerY);

        if (right.right != null) {
            this.#checkGraphicMove(right, node.graphic.centerX, node.graphic.centerY, () => {
                right.right.edgeGraphic.moveAll(right.graphic.centerX, right.graphic.centerY, oldRightX, oldRightY)

                //left.left.edgeGraphic.moveHead(left.graphic.centerX, left.graphic.centerY);
                //left.left.edgeGraphic.move(oldLeftX, oldLeftY);
                right.right.move(oldRightX, oldRightY);
            })

            this.#checkGraphicMove(right.right, oldRightX, oldRightY, async () => {
                redrawAll();
                await this.#moveAllUp(right.right);
            })
        }


        await this.#moveAllDown(node.left, -1);
        const finalCoordinatesNode = this.#moveDown(node, -1);
        this.#checkGraphicMove(node, finalCoordinatesNode[0], finalCoordinatesNode[1], () => {
            node.right = left;
            if (left != null) {
                left.parent = node;
                this.#moveNode(left, () => {
                });
            }

            node.parent = right;
            right.left = node;
            node.setEdge();
        })
    }

    async #rotateLeft(node) {
        const parent = node.parent;
        const right = node.right;
        console.log(node, parent, right, right.left);

        await this.#moveRotateLeft(node, parent, right, right.left);

        /*node.right = right.left;
        if (right.left != null) {
            right.left.parent = node;
        }

        right.left = node;
        node.parent = right;

        this.#replaceParentsChild(parent, node, right);*/
    }

    async #searchNode(key) {
        let node = this.root;
        while (node != null) {
            status.label = "Node: " + node.data;
            node.drawHighlighted();

            if (key === node.data) {
                status.label = key + " found";
                await delay(400);
                node.clearHighlight();
                return node;
            } else if (key < node.data) {
                await delay(400);
                node.clearHighlight();
                node = node.left;
            } else {
                await delay(400);
                node.clearHighlight();
                node = node.right;
            }
        }
        status.label = key + " not found";
        redrawAll()

        return null;
    }

    #checkGraphicMove(newNode, toX, toY, final) {
        if (newNode.graphic.centerX !== toX || newNode.graphic.centerY !== toY) {
            window.setTimeout(
                () => {
                    this.#checkGraphicMove(newNode, toX, toY, final)
                },
                200);
        } else {
            final();
        }
    }

    #moveNode(newNode, final) {
        if (newNode.parent == null) {
            newNode.move(RBTreeStartCoordinates[0], RBTreeStartCoordinates[1]);
            this.#checkGraphicMove(newNode, RBTreeStartCoordinates[0], RBTreeStartCoordinates[1], final)
            return;
        }

        let direction = -1;
        if (newNode.data < newNode.parent.data) {
            newNode.parent.left = newNode;
        } else {
            newNode.parent.right = newNode;
            newNode.graphic.centerX = 800;
            newNode.graphic.centerY = 400;
            direction = 1;
        }

        newNode.setEdge();
        const finalX = newNode.parent.graphic.centerX + DISTANCE / Math.pow(COEFFICIENT, newNode.level) * direction;
        const finalY = newNode.parent.graphic.centerY + DISTANCE / Math.pow(COEFFICIENT, newNode.level);

        newNode.move(finalX, finalY);
        this.#checkGraphicMove(newNode, finalX, finalY, final);
    }

    async insertNode(key) {
        let node = this.root;
        let parent = null;

        while (node != null) {
            parent = node;
            //status.label = "Node: " + node.data;
            node.drawHighlighted();
            if (key < node.data) {
                //status.label = "Node: " + node.data;
                await delay(400);
                node.clearHighlight();
                node = node.left;
            } else if (key > node.data) {
                //status.label = "Node: " + node.data;
                await delay(400);
                node.clearHighlight();
                node = node.right;
            } else {
                node.clearHighlight();
                status.label = "Node already exists";
                await delay(400);
                return;
            }
        }

        let newNode = new RedBlackNode(key, RED);

        if (parent == null) {
            this.root = newNode;
            this.#moveNode(newNode, () => {
                this.#fixRedBlackPropertiesAfterInsert(newNode);
            });
        } else {
            newNode.level = parent.level + 1;
            newNode.parent = parent;
            this.#moveNode(newNode, () => {
                this.#fixRedBlackPropertiesAfterInsert(newNode);
            });
        }
    }

    #getUncle(parent) {
        const grandparent = parent.parent;
        if (grandparent.left === parent) {
            return grandparent.right;
        } else if (grandparent.right === parent) {
            return grandparent.left;
        } else {
            throw "Parent is not a child of its grandparent";
        }
    }

    async #fixRedBlackPropertiesAfterInsert(node) {
        console.log(node.data);
        let parent = node.parent;

        // Case 1: Parent is null, we've reached the root, the end of the recursion
        if (parent == null) {
            node.setColor(BLACK);
            return;
        }

        // Parent is black --> nothing to do
        if (parent.color === BLACK) {
            return;
        }

        // From here on, parent is red
        const grandparent = parent.parent;

        // Case 2:
        // Not having a grandparent means that parent is the root. If we enforce black roots
        // (rule 2), grandparent will never be null, and the following if-then block can be
        // removed.
        if (grandparent == null) {
            // As this method is only called on red nodes (either on newly inserted ones - or -
            // recursively on red grandparents), all we have to do is to recolor the root black.
            parent.setColor(BLACK);
            return;
        }

        // Get the uncle (may be null/nil, in which case its color is BLACK)
        const uncle = this.#getUncle(parent);

        // Case 3: Uncle is red -> recolor parent, grandparent and uncle
        if (uncle != null && uncle.color === RED) {
            parent.setColor(BLACK);
            grandparent.setColor(RED);
            uncle.setColor(BLACK);

            // Call recursively for grandparent, which is now red.
            // It might be root or have a red parent, in which case we need to fix more...
            await this.#fixRedBlackPropertiesAfterInsert(grandparent);
        }

        // Parent is left child of grandparent
        else if (parent === grandparent.left) {
            // Case 4a: Uncle is black and node is left->right "inner child" of its grandparent
            if (node === parent.right) {
                console.log("rotate left");
                await this.#rotateLeft(parent);

                // Let "parent" point to the new root node of the rotated subtree.
                // It will be recolored in the next step, which we're going to fall-through to.
                parent = node;
            }

            // Case 5a: Uncle is black and node is left->left "outer child" of its grandparent
            console.log("rotate right");
            await this.#rotateRight(grandparent);


            // Recolor original parent and grandparent

            parent.setColor(BLACK);
            grandparent.setColor(RED);
        }

        // Parent is right child of grandparent
        else {
            // Case 4b: Uncle is black and node is right->left "inner child" of its grandparent
            if (node === parent.left) {
                console.log("rotate right", parent);
                await this.#rotateRight(parent);

                // Let "parent" point to the new root node of the rotated sub-tree.
                // It will be recolored in the next step, which we're going to fall-through to.
                parent = node;
            }

            // Case 5b: Uncle is black and node is right->right "outer child" of its grandparent

            console.log("rotate left")
            await this.#rotateLeft(grandparent);

            // Recolor original parent and grandparent
            parent.setColor(BLACK);
            grandparent.setColor(RED);
        }
    }

    #findMinimum(node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    #deleteNodeWithZeroOrOneChild(node) {
        // Node has ONLY a left child -> replace by its left child
        if (node.left != null) {
            this.#replaceParentsChild(node.parent, node, node.left);
            return node.left; // moved-up node
        }
        // Node has ONLY a right child -> replace by its right child
        else if (node.right != null) {
            this.#replaceParentsChild(node.parent, node, node.right);
            return node.right; // moved-up node
        }
            // Node has no children ->
            // * node is red --> just remove it
        // * node is black -> replace it by a temporary NIL node (needed to fix the R-B rules)
        else {
            let newChild = node.color === BLACK ? new RedBlackNode(0, true) : null;
            this.#replaceParentsChild(node.parent, node, newChild);
            return newChild;
        }
    }

    async #deleteNode(key) {
        let node = this.root;

        // Find the node to be deleted
        while (node != null && node.data !== key) {
            // Traverse the tree to the left or right depending on the key
            if (key < node.data) {
                node = node.left;
            } else {
                node = node.right;
            }
        }

        // Node not found?
        if (node == null) {
            return;
        }

        // At this point, "node" is the node to be deleted
        // In this variable, we'll store the node at which we're going to start to fix the R-B
        // properties after deleting a node.

        let movedUpNode;
        let deletedNodeColor;

        // Node has zero or one child
        if (node.left == null || node.right == null) {
            movedUpNode = this.#deleteNodeWithZeroOrOneChild(node);
            deletedNodeColor = node.color;
        } else {
            // Node has two children

            // Find minimum node of right subtree ("inorder successor" of current node)
            let inOrderSuccessor = this.#findMinimum(node.right);

            // Copy inorder successor's data to current node (keep its color!)
            node.data = inOrderSuccessor.data;

            // Delete inorder successor just as we would delete a node with 0 or 1 child
            movedUpNode = this.#deleteNodeWithZeroOrOneChild(inOrderSuccessor);
            deletedNodeColor = inOrderSuccessor.color;
        }

        if (deletedNodeColor === BLACK) {
            await this.#fixRedBlackPropertiesAfterDelete(movedUpNode);

            // Remove the temporary NIL node
            if (movedUpNode.isNil === true) {
                this.#replaceParentsChild(movedUpNode.parent, movedUpNode, null);
            }
        }
    }

    #getSibling(node) {
        const parent = node.parent;
        if (node === parent.left) {
            return parent.right;
        } else if (node === parent.right) {
            return parent.left;
        } else {
            throw "Parent is not a child of its grandparent";
        }
    }

    #isBlack(node) {
        return node === null || node.color === BLACK;
    }

    async #fixRedBlackPropertiesAfterDelete(node) {
        // Case 1: Examined node is root, end of recursion
        if (node === this.root) {
            node.color = BLACK;
            return;
        }
        let sibling = this.#getSibling(node);

        // Case 2: Red sibling
        if (sibling.color === RED) {
            await this.#handleRedSibling(node, sibling);
            sibling = this.#getSibling(node); // Get new sibling for fall-through to cases 3-6
        }

        // Cases 3+4: Black sibling with two black children
        if (this.#isBlack(sibling.left) && this.#isBlack(sibling.right)) {
            sibling.color = RED;

            // Case 3: Black sibling with two black children + red parent
            if (node.parent.color === RED) {
                node.parent.color = BLACK;
            }

            // Case 4: Black sibling with two black children + black parent
            else {
                await this.#fixRedBlackPropertiesAfterDelete(node.parent);
            }
        }
        // Case 5+6: Black sibling with at least one red child
        else {
            await this.#handleBlackSiblingWithAtLeastOneRedChild(node, sibling);
        }
    }

    async #handleRedSibling(node, sibling) {
        // Recolor
        sibling.color = BLACK;
        node.parent.color = RED;

        // Rotate
        if (node === node.parent.left) {
            await this.#rotateLeft(node.parent);
        } else {
            await this.#rotateRight(node.parent);
        }
    }

    async #handleBlackSiblingWithAtLeastOneRedChild(node, sibling) {
        const nodeIsLeftChild = node === node.parent.left;

        // Case 5: Black sibling with at least one red child + "outer nephew" is black
        // --> Recolor sibling and its child, and rotate around sibling
        if (nodeIsLeftChild && this.#isBlack(sibling.right)) {
            sibling.left.color = BLACK;
            sibling.color = RED;
            await this.#rotateRight(sibling);
            sibling = node.parent.right;
        } else if (!nodeIsLeftChild && this.#isBlack(sibling.left)) {
            sibling.right.color = BLACK;
            sibling.color = RED;
            await this.#rotateLeft(sibling);
            sibling = node.parent.left;
        }
        // Fall-through to case 6...

        // Case 6: Black sibling with at least one red child + "outer nephew" is red
        // --> Recolor sibling + parent + sibling's child, and rotate around parent
        sibling.color = node.parent.color;
        node.parent.color = BLACK;
        if (nodeIsLeftChild) {
            sibling.right.color = BLACK;
            await this.#rotateLeft(node.parent);
        } else {
            sibling.left.color = BLACK;
            await this.#rotateRight(node.parent);
        }
    }
}

class RedBlackNode {
    data = 0;
    level = 0;
    left = null;
    right = null;
    parent = null;
    edgeGraphic = null; // edge to parent

    color;
    graphic;
    isNil = false;

    constructor(data, color = BLACK, nil = false) {
        this.data = data;
        this.isNil = nil;
        this.color = color;

        this.graphic = new AnimatedCircle(40, 400, this.data);
        this.graphic.setColor(color);
        drawable_objects.push(this.graphic);
    }

    setEdge() {
        if (this.parent != null) {
            if (this.edgeGraphic != null) {
                this.edgeGraphic.isVisible = false;
            }

            const head = this.parent.getAttachPoint(this.graphic.centerX, this.graphic.centerY);
            const tail = this.getAttachPoint(this.parent.graphic.centerX, this.parent.graphic.centerY);
            this.edgeGraphic = new AnimatedLine(head[0], head[1], tail[0], tail[1]);
            drawable_objects.push(this.edgeGraphic);
            redrawAll();
        }
    }

    deleteEdge() {
        if (this.edgeGraphic != null) {
            this.edgeGraphic.clear();
            this.edgeGraphic = null;
        }
    }

    setColor(newColor) {
        this.color = newColor;
        this.graphic.setColor(newColor);
        redrawAll();
    }

    draw() {
        redrawAll();
    }

    drawHighlighted() {
        this.graphic.drawHighlighted();
    }

    clearHighlight() {
        this.graphic.clearHighlight();
    }

    move(toX, toY) {
        this.graphic.move(toX, toY);
        if (this.edgeGraphic != null) {
            const newTail =
                getAttachPoint(this.edgeGraphic.beginX, this.edgeGraphic.beginY, toX, toY)
            this.edgeGraphic.move(newTail[0], newTail[1]);
        }
    }

    getAttachPoint(fromX, fromY) {
        return this.graphic.getAttachPoint(fromX, fromY);
    }
}