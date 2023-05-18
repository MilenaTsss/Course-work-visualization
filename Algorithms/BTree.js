class BTree {
    root = null;

    traverse(node, level) {
        if (node == null) {
            return;
        }

        node.level = level;
        node.move();
        this.traverse(node.left, level + 1);
        this.traverse(node.middleLeft, level + 1);
        this.traverse(node.middleRight, level + 1);
        this.traverse(node.right, level + 1);
    }

    async recolorTree(node) {
        if (node == null) {
            return;
        }
        if (node.leftNode != null) {
            const newColor = await redBlackTree.searchNode(node.leftNode.key, false);
            node.leftNode.setColor(newColor.color);
        }
        if (node.middleNode != null) {
            const newColor = await redBlackTree.searchNode(node.middleNode.key, false);
            node.middleNode.setColor(newColor.color);
        }
        if (node.rightNode != null) {
            const newColor = await redBlackTree.searchNode(node.rightNode.key, false);
            node.rightNode.setColor(newColor.color);
        }

        await this.recolorTree(node.left);
        await this.recolorTree(node.middleLeft);
        await this.recolorTree(node.middleRight);
        await this.recolorTree(node.right);
    }

    async insertNode(key, node, nodeParent) {
        setStatus("Inserting " + key);

        if (this.root == null) {
            setStatus("Insert root");
            this.root = new BTreeNode(key);
            this.root.move();
            await moveAll();
            await this.recolorTree(this.root);

            return this.root;
        }

        if (node == null) {
            return this.insertNode(key, this.root, null);
        }

        node.drawHighlighted();
        await delay(400);

        if (node.containsKey(key)) {
            setStatus("Already contains " + key);
            return null;
        }

        // Split full nodes
        if (node.rightNode != null) {
            node = this.split(node, nodeParent);
        }

        // If node is not a leaf, recursively insert into child subtree
        if (!node.isLeaf()) {
            node.clearHighlight();
            await delay(400);
            return this.insertNode(key, node.nextNode(key), node);
        }

        node.clearHighlight();
        await delay(400);

        // key can be inserted into leaf node
        node.insertKey(key);

        this.traverse(this.root, 0);
        await moveAll();
        await this.recolorTree(this.root);

        return node;
    }

    split(node, nodeParent) {
        setStatus("Splitting node");

        const splitLeft = new BTreeNode(node.leftNode, node.left, node.middleLeft, nodeParent);
        const splitRight = new BTreeNode(node.rightNode, node.middleRight, node.right, nodeParent);

        if (nodeParent != null) {
            nodeParent.insertKeyWithChildren(node.middleNode, splitLeft, splitRight);
        } else {
            nodeParent = new BTreeNode(node.middleNode, splitLeft, splitRight);
            this.root = nodeParent;
        }

        return nodeParent;
    }

    async searchNode(key, node) {
        if (node == null) {
            return null;
        }

        node.drawHighlighted();

        if (node.containsKey(key)) {
            setStatus(key + " found");
            await delay(400);
            node.clearHighlight();
            return node;
        }

        await delay(400);
        node.clearHighlight();

        // Recursively search the appropriate subtree
        return this.searchNode(key, node.nextNode(key));
    }

    async deleteNode(key) {
        if (this.root.isLeaf() && this.root.countKeys() === 1) {
            this.root.drawHighlighted();

            if (this.root.leftNode.key === key) {
                this.root.delete();
                setStatus("Deleted root " + key);
                this.root = null;
                return true;
            }

            this.root.clearHighlight();
            await delay(300);
            setStatus(key + " not found");
            return false;
        }

        let currentParent = null;
        let current = this.root;

        while (current != null) {
            current.drawHighlighted();

            if (current.countKeys() === 1 && current !== this.root) {
                current = await this.merge(current, currentParent);
            }

            current.drawHighlighted();
            await delay(500);

            // Check if current node contains key
            const keyIndex = current.getKeyIndex(key);
            if (keyIndex !== -1) {
                setStatus(key + " found, deleting it");

                if (current.isLeaf()) {
                    current.removeKey(keyIndex);
                    current.clearHighlight();
                    this.traverse(this.root, 0);
                    await moveAll();
                    await this.recolorTree(this.root);

                    return true;
                }

                setStatus("Deleting with child");
                // The node contains the key and is not a leaf, so the key is
                // replaced with the successor
                const tmpChild = current.getChild(keyIndex + 1);
                const tmpNode = this.getMinNode(tmpChild);
                await this.deleteNode(tmpNode.key);
                this.keySwap(this.root, key, tmpNode.key);

                this.traverse(this.root, 0);
                await moveAll();
                await this.recolorTree(this.root);

                return true;
            }

            current.clearHighlight();
            await delay(300);

            // Current node does not contain key, so continue down tree
            currentParent = current;
            current = current.nextNode(key);
        }

        setStatus(key + " not found");
        return false;
    }

    getMinNode(node) {
        let current = node;
        while (current.left != null) {
            current = current.left;
        }
        return current.leftNode;
    }

    keySwap(node, existing, replacement) {
        if (node == null) {
            return false;
        }

        const keyIndex = node.getKeyIndex(existing);
        if (keyIndex === -1) {
            const next = node.nextNode(existing);
            return this.keySwap(next, existing, replacement);
        }

        node.setKey(replacement, keyIndex);
        return true;
    }

    async merge(node, nodeParent) {
        setStatus("Merging");
        node.clearHighlight();
        await delay(300);

        const nodeIndex = nodeParent.getChildIndex(node);
        const leftSibling = nodeParent.getChild(nodeIndex - 1);
        const rightSibling = nodeParent.getChild(nodeIndex + 1);

        if (leftSibling != null && leftSibling.countKeys() >= 2) {
            await this.rotateRight(leftSibling, nodeParent);
        } else if (rightSibling != null && rightSibling.countKeys() >= 2) {
            await this.rotateLeft(rightSibling, nodeParent);
        } else {
            if (leftSibling == null) {
                node = await this.fuse(nodeParent, node, rightSibling);
            } else {
                node = await this.fuse(nodeParent, leftSibling, node);
            }
        }

        return node;
    }

    async fuse(parent, leftNode, rightNode) {
        setStatus("Fusing");

        if (parent === this.root && parent.countKeys() === 1) {
            return await this.fuseRoot();
        }

        const leftNodeIndex = parent.getChildIndex(leftNode);
        const middleNode = parent.getNode(leftNodeIndex);
        const fusedNode = new BTreeNode(leftNode.leftNode);

        fusedNode.middleNode = middleNode;
        fusedNode.rightNode = rightNode.leftNode;
        fusedNode.fixNodes();

        fusedNode.left = leftNode.left;
        fusedNode.middleLeft = leftNode.middleLeft;
        fusedNode.middleRight = rightNode.left;
        fusedNode.right = rightNode.middleLeft;
        fusedNode.fixChildren();

        const keyIndex = parent.getNodeIndex(middleNode);
        parent.simpleRemoveNode(keyIndex);
        parent.setChild(fusedNode, keyIndex);

        this.traverse(this.root, 0);
        await moveAll();
        await delay(1000);

        return fusedNode;
    }

    async fuseRoot() {
        setStatus("Fusing root");

        const oldLeft = this.root.left;
        const oldMiddleLeft = this.root.middleLeft;

        this.root.middleNode = this.root.leftNode;
        this.root.leftNode = oldLeft.leftNode;
        this.root.rightNode = oldMiddleLeft.leftNode;
        this.root.fixNodes();

        this.root.left = oldLeft.left;
        this.root.middleLeft = oldLeft.middleLeft;
        this.root.middleRight = oldMiddleLeft.left;
        this.root.right = oldMiddleLeft.middleLeft;
        this.root.fixChildren();

        this.traverse(this.root, 0);
        await moveAll();
        await delay(1000);

        return this.root;
    }

    async rotateLeft(node, nodeParent) {
        setStatus("Rotate left");
        const nodeIndex = nodeParent.getChildIndex(node);
        const leftSibling = nodeParent.getChild(nodeIndex - 1);

        const nodeForLeftSibling = nodeParent.getNode(nodeIndex - 1);

        leftSibling.appendNodeWithChild(nodeForLeftSibling, node.left);

        nodeParent.setNode(node.leftNode, nodeIndex - 1);

        node.simpleRemoveNode(0);

        this.traverse(this.root, 0);
        await moveAll();
        await delay(500);
    }

    async rotateRight(node, nodeParent) {
        setStatus("Rotate right");
        const nodeIndex = nodeParent.getChildIndex(node);
        const rightSibling = nodeParent.getChild(nodeIndex + 1);

        // Get key from the parent that will be moved into the right sibling
        const nodeForRightSibling = nodeParent.getNode(nodeIndex);

        rightSibling.rightNode = rightSibling.middleNode;
        rightSibling.middleNode = rightSibling.leftNode;
        rightSibling.leftNode = nodeForRightSibling;
        rightSibling.fixNodes();

        rightSibling.right = rightSibling.middleRight;
        rightSibling.middleRight = rightSibling.middleLeft;
        rightSibling.middleLeft = rightSibling.left;
        rightSibling.left = node.removeRightmostChild();
        rightSibling.fixChildren();

        // Replace the parent's key that was prepended to the right sibling
        nodeParent.setNode(node.removeRightmostNode(), nodeIndex);

        this.traverse(this.root, 0);
        await moveAll();
        await delay(500);
    }
}