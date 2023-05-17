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
            this.root = new BTreeNode(key);
            this.root.move();
            await moveAll();
            await this.recolorTree(this.root);

            return this.root;
        }

        // If the node argument is null, recursively call with root
        if (node == null) {
            return this.insertNode(key, this.root, null);
        }

        // Check for duplicate key
        if (node.containsKey(key)) {
            setStatus("Already contains " + key);
            return null;
        }

        // Preemptively split full nodes
        if (node.rightNode != null) {
            node = this.split(node, nodeParent);
        }

        // If node is not a leaf, recursively insert into child subtree
        if (!node.isLeaf()) {
            return this.insertNode(key, node.nextNode(key), node);
        }

        // key can be inserted into leaf node
        node.insertKey(key);

        this.traverse(this.root, 0);
        await moveAll();
        await this.recolorTree(this.root);

        return node;
    }

    split(node, nodeParent) {
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

    // Recursive helper method for search.
    async searchNode(key, node) {
        if (node == null) {
            return null;
        }

        node.drawHighlighted();

        // Check if the node contains the key
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

    // Finds and removes the specified key from this tree.
    async deleteNode(key) {
        // Special case for tree with 1 key
        if (this.root.isLeaf() && this.root.countKeys() === 1) {
            if (this.root.leftNode.key === key) {
                this.root.delete();
                setStatus("Deleted root " + key);
                this.root = null;
                return true;
            }
            setStatus(key + " not found");
            return false;
        }

        let currentParent = null;
        let current = this.root;

        while (current != null) {
            // Merge any non-root node with 1 key
            if (current.countKeys() === 1 && current !== this.root) {
                current = await this.merge(current, currentParent);
            }

            // Check if current node contains key
            const keyIndex = current.getKeyIndex(key);
            if (keyIndex !== -1) {
                if (current.isLeaf()) {
                    current.removeKey(keyIndex);

                    this.traverse(this.root, 0);
                    await moveAll();
                    await this.recolorTree(this.root);

                    return true;
                }

                // The node contains the key and is not a leaf, so the key is
                // replaced with the successor
                const tmpChild = current.getChild(keyIndex + 1);
                const tmpKey = this.getMinKey(tmpChild);
                await this.deleteNode(tmpKey);
                this.keySwap(this.root, key, tmpKey);

                this.traverse(this.root, 0);
                await moveAll();
                await this.recolorTree(this.root);

                return true;
            }

            // Current node does not contain key, so continue down tree
            currentParent = current;
            current = current.nextNode(key);
        }

        setStatus(key + " not found");
        return false;
    }

    // Splits a full node, moving the middle key up into the parent node.

    // Fuses a parent node and two children into one node.
    // Precondition: Each of the three nodes must have one key each.
    fuse(parent, leftNode, rightNode) {
        if (parent === this.root && parent.countKeys() === 1) {
            return this.fuseRoot();
        }

        const leftNodeIndex = parent.getChildIndex(leftNode);
        const middleNode = parent.getNode(leftNodeIndex);
        const fusedNode = new BTreeNode(leftNode.leftNode);

        fusedNode.middleNode = middleNode;
        fusedNode.rightNode = rightNode.leftNode;
        fusedNode.left = leftNode.left;
        fusedNode.middleLeft = leftNode.middleLeft;
        fusedNode.middleRight = rightNode.left;
        fusedNode.right = rightNode.middleLeft;
        const keyIndex = parent.getNodeIndex(middleNode);
        parent.removeKey(keyIndex);
        parent.setChild(fusedNode, keyIndex);
        return fusedNode;
    }

    // Fuses the tree's root node with the root's two children.
    // Precondition: Each of the three nodes must have one key each.
    fuseRoot() {
        const oldLeft = this.root.left;
        const oldMiddleLeft = this.root.middleLeft;

        this.root.middleNode = this.root.leftNode;
        this.root.leftNode = oldLeft.leftNode;
        oldLeft.leftNode.bNode = this.root;
        this.root.rightNode = oldMiddleLeft.leftNode;
        oldMiddleLeft.leftNode.bNode = this.root;

        this.root.left = oldLeft.left;
        this.root.middleLeft = oldLeft.middleLeft;
        this.root.middleRight = oldMiddleLeft.left;
        this.root.right = oldMiddleLeft.middleLeft;
        return this.root;
    }

    // Searches for, and returns, the minimum key in a subtree
    getMinKey(node) {
        let current = node;
        while (current.left != null) {
            current = current.left;
        }
        return current.A;
    }

    // Finds and replaces one key with another. The replacement key must
    // be known to be a key that can be used as a replacement without violating
    // any of the 2-3-4 tree rules.
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

    // Rotates or fuses to add 1 or 2 additional keys to a node with 1 key.
    async merge(node, nodeParent) {
        setStatus("Merging");

        const nodeIndex = nodeParent.getChildIndex(node);
        const leftSibling = nodeParent.getChild(nodeIndex - 1);
        const rightSibling = nodeParent.getChild(nodeIndex + 1);

        if (leftSibling != null && leftSibling.countKeys() >= 2) {
            setStatus("Rotate right");
            await this.rotateRight(leftSibling, nodeParent);
        } else if (rightSibling != null && rightSibling.countKeys() >= 2) {
            setStatus("Rotate right");
            await this.rotateLeft(rightSibling, nodeParent);
        } else {
            if (leftSibling == null) {
                node = this.fuse(nodeParent, node, rightSibling);
            } else {
                node = this.fuse(nodeParent, leftSibling, node);
            }
        }

        return node;
    }

    async rotateLeft(node, nodeParent) {
        const nodeIndex = nodeParent.getChildIndex(node);
        const leftSibling = nodeParent.getChild(nodeIndex - 1); // node

        const nodeForLeftSibling = nodeParent.getNode(nodeIndex - 1); // node

        leftSibling.appendNodeWithChild(nodeForLeftSibling, node.left);

        nodeParent.setNode(node.leftNode, nodeIndex - 1);

        node.simpleRemoveNode(0);

        this.traverse(this.root, 0);
        await moveAll();
        await delay(500);
    }

    async rotateRight(node, nodeParent) {
        const nodeIndex = nodeParent.getChildIndex(node);
        const rightSibling = nodeParent.getChild(nodeIndex + 1); // node

        // Get key from the parent that will be copied into the right sibling
        const nodeForRightSibling = nodeParent.getNode(nodeIndex);


        // Shift key and child references in right sibling
        rightSibling.rightNode = rightSibling.middleNode;
        rightSibling.middleNode = rightSibling.leftNode;
        rightSibling.right = rightSibling.middleRight;
        rightSibling.middleRight = rightSibling.middleLeft;
        rightSibling.middleLeft = rightSibling.left;

        // Set key A and the left child of rightSibling
        rightSibling.leftNode = nodeForRightSibling;
        nodeForRightSibling.bNode = rightSibling;
        const removedChild = node.removeRightmostChild()
        rightSibling.left = removedChild;
        if (removedChild != null) {
            removedChild.parent = rightSibling;
        }

        // Replace the parent's key that was prepended to the right sibling
        //nodeParent.setKey(node.removeRightmostKey(), nodeIndex);
        nodeParent.setNode(node.removeRightmostNode(), nodeIndex);

        this.traverse(this.root, 0);
        await moveAll();
        await delay(500);
    }
}