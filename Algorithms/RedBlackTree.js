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

    async #searchNode(key) {
        let node = this.root;
        while (node != null) {
            setStatus("Node: " + node.data);
            node.drawHighlighted();

            if (key === node.data) {
                setStatus(key + " found");
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

        setStatus(key + " not found");
        return null;
    }

    async insertNode(key) {
        let node = this.root;
        let parent = null;

        while (node != null) {
            parent = node;
            node.drawHighlighted();
            if (key < node.data) {
                await delay(400);
                node.clearHighlight();
                node = node.left;
            } else if (key > node.data) {
                await delay(400);
                node.clearHighlight();
                node = node.right;
            } else {
                node.clearHighlight();
                setStatus("Node already exists");
                return;
            }
        }

        let newNode = new RedBlackNode(key, RED);

        if (parent == null) {
            setStatus("Inserting root");
            this.root = newNode;
            newNode.move();
        } else {
            setStatus("Inserting after " + parent.data);

            newNode.level = parent.level + 1;
            newNode.parent = parent;

            if (newNode.parent.data < newNode.data) {
                newNode.graphic.centerX = 800;
                newNode.graphic.centerY = 800;
                parent.right = newNode;
            } else {
                parent.left = newNode;
            }

            newNode.move();
        }

        await moveAll(1000);
        await delay(500);
        await this.#fixRedBlackPropertiesAfterInsert(newNode);
    }

    #replaceParentsChild(parent, oldChild, newChild) {
        if (parent == null) {
            this.root = newChild;
        } else if (parent.left === oldChild) {
            parent.left = newChild;
        } else if (parent.right === oldChild) {
            parent.right = newChild;
        } else {
            setStatus("ERROR, Node is not child to parent");
            throw "Node is not a child of its parent";
        }

        if (newChild != null) {
            newChild.parent = parent;
        }
    }

    traverse(node, level) {
        if (node == null) {
            return;
        }
        node.level = level;
        node.move();
        this.traverse(node.left, level + 1);
        this.traverse(node.right, level + 1);
    }

    async #rotateRight(node) {
        setStatus("Rotating right " + node.data);

        const parent = node.parent;
        const left = node.left;

        node.left = left.right;
        if (left.right != null) {
            left.right.parent = node;
        }

        left.right = node;
        node.parent = left;

        this.#replaceParentsChild(parent, node, left);

        await delay(1000);

        this.traverse(this.root, 0);

        await moveAll(2000);
    }

    async #rotateLeft(node) {
        setStatus("Rotating left " + node.data);
        const parent = node.parent;
        const right = node.right;

        node.right = right.left;
        if (right.left != null) {
            right.left.parent = node;
        }

        right.left = node;
        node.parent = right;

        this.#replaceParentsChild(parent, node, right);

        await delay(1000);

        this.traverse(this.root, 0);

        await moveAll(2000);
    }

    #getUncle(parent) {
        const grandparent = parent.parent;
        if (grandparent.left === parent) {
            return grandparent.right;
        } else if (grandparent.right === parent) {
            return grandparent.left;
        } else {
            setStatus("ERROR, parent isn't a child to grandparent");
            throw "Parent is not a child of its grandparent";
        }
    }

    async #findMinimum(node) {
        node.drawHighlighted();
        await delay(400);
        while (node.left != null) {
            node.drawHighlighted();
            await delay(400);
            node = node.left;
        }
        node.clearHighlight();
        return node;
    }

    async #fixRedBlackPropertiesAfterInsert(node) {
        setStatus("Fixing after insert with node " + node.data);
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
                await this.#rotateLeft(parent);

                // Let "parent" point to the new root node of the rotated subtree.
                // It will be recolored in the next step, which we're going to fall-through to.
                parent = node;
            }

            // Case 5a: Uncle is black and node is left->left "outer child" of its grandparent
            await this.#rotateRight(grandparent);


            // Recolor original parent and grandparent
            parent.setColor(BLACK);
            grandparent.setColor(RED);
        }

        // Parent is right child of grandparent
        else {
            // Case 4b: Uncle is black and node is right->left "inner child" of its grandparent
            if (node === parent.left) {
                await this.#rotateRight(parent);

                // Let "parent" point to the new root node of the rotated sub-tree.
                // It will be recolored in the next step, which we're going to fall-through to.
                parent = node;
            }

            // Case 5b: Uncle is black and node is right->right "outer child" of its grandparent
            await this.#rotateLeft(grandparent);

            // Recolor original parent and grandparent
            parent.setColor(BLACK);
            grandparent.setColor(RED);
        }
    }

    async #deleteNode(key) {
        setStatus("Deleting " + key);
        let node = this.root;

        // Find the node to be deleted
        while (node != null && node.data !== key) {
            node.drawHighlighted();
            // Traverse the tree to the left or right depending on the key
            if (key < node.data) {
                await delay(400);
                node.clearHighlight();
                node = node.left;
            } else {
                await delay(400);
                node.clearHighlight();
                node = node.right;
            }
        }

        // Node not found?
        if (node == null) {
            setStatus(key + " not found")
            return;
        }

        setStatus(key + " found");

        // "node" is the node to be deleted
        // In this variable, we'll store the node at which we're going to start to fix the R-B
        // properties after deleting a node.

        let movedUpNode;
        let deletedNodeColor;

        // Node has zero or one child
        if (node.left == null || node.right == null) {
            setStatus("Deleting node with one child or without children")
            movedUpNode = this.#deleteNodeWithZeroOrOneChild(node);
            deletedNodeColor = node.color;
        } else {
            setStatus("Finding minimum from node.right")
            // Node has two children

            // Find minimum node of right subtree ("inorder successor" of current node)
            let inOrderSuccessor = await this.#findMinimum(node.right);

            // Copy inorder successor's data to current node (keep its color!)
            node.setData(inOrderSuccessor.data);

            // Delete inorder successor just as we would delete a node with 0 or 1 child
            movedUpNode = this.#deleteNodeWithZeroOrOneChild(inOrderSuccessor);
            deletedNodeColor = inOrderSuccessor.color;
        }

        this.traverse(this.root, 0);
        await moveAll(1000);

        if (deletedNodeColor === BLACK) {
            await this.#fixRedBlackPropertiesAfterDelete(movedUpNode);

            // Remove the temporary NIL node
            if (movedUpNode.isNil === true) {
                movedUpNode.isVisible = false;
                movedUpNode.deleteEdge();
                this.#replaceParentsChild(movedUpNode.parent, movedUpNode, null);
            }
        }

        await this.traverse(this.root, 0);
        await moveAll(1000);

        redrawAll();
    }

    #deleteNodeWithZeroOrOneChild(node) {
        node.graphic.isVisible = false;
        node.deleteEdge();

        // Node has ONLY a left child -> replace by its left child
        if (node.left != null) {
            this.#replaceParentsChild(node.parent, node, node.left);
            return node.left;
        } else if (node.right != null) {
            // Node has ONLY a right child -> replace by its right child

            this.#replaceParentsChild(node.parent, node, node.right);
            return node.right;
        } else {
            // Node has no children ->
            // * node is red --> just remove it
            // * node is black -> replace it by a temporary NIL node (needed to fix the R-B rules)

            let newChild = node.color === BLACK ? new RedBlackNode("nil", BLACK, true) : null;
            this.#replaceParentsChild(node.parent, node, newChild);
            return newChild;
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
        console.log(node);
        setStatus("Fixing after delete with " + node.data);
        // Case 1: Examined node is root, end of recursion
        if (node === this.root) {
            console.log("root");
            node.setColor(BLACK);
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
            sibling.setColor(RED);

            // Case 3: Black sibling with two black children + red parent
            if (node.parent.color === RED) {
                node.parent.setColor(BLACK);
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
        sibling.setColor(BLACK);
        node.parent.setColor(RED);

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
            sibling.left.setColor(BLACK);
            sibling.setColor(RED);
            await this.#rotateRight(sibling);
            sibling = node.parent.right;
        } else if (!nodeIsLeftChild && this.#isBlack(sibling.left)) {
            sibling.right.setColor(BLACK);
            sibling.setColor(RED);
            await this.#rotateLeft(sibling);
            sibling = node.parent.left;
        }
        // Fall-through to case 6...

        // Case 6: Black sibling with at least one red child + "outer nephew" is red
        // --> Recolor sibling + parent + sibling's child, and rotate around parent
        sibling.setColor(node.parent.color)
        node.parent.setColor(BLACK);
        if (nodeIsLeftChild) {
            sibling.right.setColor(BLACK);
            await this.#rotateLeft(node.parent);
        } else {
            sibling.left.setColor(BLACK);
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
        if (nil === true) {
            this.graphic.isVisible = false;
        }
        drawable_objects.push(this.graphic);
    }

    deleteEdge() {
        if (this.edgeGraphic != null) {
            this.edgeGraphic.clear();
            this.edgeGraphic = null;
        }
    }

    setColor(newColor) {
        let colorText = "black";
        if (newColor === RED) {
            colorText = "red";
        }
        setStatus("Recolor " + this.data + " to " + colorText);

        this.color = newColor;
        this.graphic.setColor(newColor);
        redrawAll();
    }

    setData(data) {
        this.data = data;
        this.graphic.label = data;
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

    move() {
        if (this.graphic.isVisible === false) {
            return;
        }

        if (this.parent == null) {
            this.deleteEdge();

            this.graphic.isMoving = true;
            this.graphic.movingToX = RBTreeStartCoordinates[0];
            this.graphic.movingToY = RBTreeStartCoordinates[1];
        } else {
            let parentX = this.parent.graphic.centerX;
            let parentY = this.parent.graphic.centerY;

            if (this.parent.graphic.isMoving) {
                parentX = this.parent.graphic.movingToX;
                parentY = this.parent.graphic.movingToY;
            }

            let direction = 1;
            if (this.data < this.parent.data) {
                direction = -1;
            }

            this.graphic.isMoving = true;
            this.graphic.movingToX = parentX + DISTANCE / Math.pow(COEFFICIENT, this.level) * direction;
            this.graphic.movingToY = parentY + DISTANCE / Math.pow(COEFFICIENT, this.level);

            const head = getAttachPoint(this.graphic.movingToX, this.graphic.movingToY, parentX, parentY);
            const tail = getAttachPoint(parentX, parentY, this.graphic.movingToX, this.graphic.movingToY);

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