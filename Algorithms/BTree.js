class BTree {
    root;

    constructor() {
        this.root = null;
    }

    // Inserts a new key into this tree, provided the tree doesn't already
    // contain the same key.
    #insert(key, node, nodeParent) {
        // Special case for empty tree
        if (this.root == null) {
            this.root = new (key);
            return this.root;
        }

        // If the node argument is null, recursively call with root
        if (node == null) {
            return this.#insert(key, this.root, null);
        }

        // Check for duplicate key
        if (node.hasKey(key)) {
            // Duplicate keys are not allowed
            return null;
        }

        // Preemptively split full nodes
        if (node.c != null) {
            node = this.split(node, nodeParent);
        }

        // If node is not a leaf, recursively insert into child subtree
        if (!node.isLeaf()) {
            return this.#insert(key, node.nextNode(key), node);
        }

        // key can be inserted into leaf node
        node.insertKey(key);
        return node;
    }

    insert(key) {
        return this.#insert(key, null, null);
    }

    // Searches this tree for the specified key. If found, the node containing
    // the key is returned. Otherwise, null is returned.
    search(key) {
        return this.searchRecursive(key, this.root);
    }

    // Recursive helper method for search.
    searchRecursive(key, node) {
        if (node == null) {
            return null;
        }

        // Check if the node contains the key
        if (node.hasKey(key)) {
            return node;
        }

        // Recursively search the appropriate subtree
        return this.searchRecursive(key, node.nextNode(key));
    }

    // Splits a full node, moving the middle key up into the parent node.
    split(node, nodeParent) {
        const splitLeft = new BNode(node.A, node.left, node.middle1);
        const splitRight = new BNode(node.C, node.middle2, node.right);
        if (nodeParent != null) {
            nodeParent.insertKeyWithChildren(node.B, splitLeft, splitRight);
        } else {
            // Split root
            nodeParent = new BNode(node.B, splitLeft, splitRight);
            this.root = nodeParent;
        }

        return nodeParent;
    }

    // Fuses a parent node and two children into one node.
    // Precondition: Each of the three nodes must have one key each.
    fuse(parent, leftNode, rightNode) {
        if (parent === this.root && parent.countKeys() === 1) {
            return this.fuseRoot();
        }

        const leftNodeIndex = parent.getChildIndex(leftNode);
        const middleKey = parent.getKey(leftNodeIndex);
        const fusedNode = new (leftNode.A);
        fusedNode.B = middleKey;
        fusedNode.C = rightNode.A;
        fusedNode.left = leftNode.left;
        fusedNode.middle1 = leftNode.middle1;
        fusedNode.middle2 = rightNode.left;
        fusedNode.right = rightNode.middle1;
        const keyIndex = parent.getKeyIndex(middleKey);
        parent.removeKey(keyIndex);
        parent.setChild(fusedNode, keyIndex);
        return fusedNode;
    }

    // Fuses the tree's root node with the root's two children.
    // Precondition: Each of the three nodes must have one key each.
    fuseRoot() {
        const oldLeft = this.root.left;
        const oldMiddle1 = this.root.middle1;
        this.root.B = this.root.A;
        this.root.A = oldLeft.A;
        this.root.C = oldMiddle1.A;
        this.root.left = oldLeft.left;
        this.root.middle1 = oldLeft.middle1;
        this.root.middle2 = oldMiddle1.left;
        this.root.right = oldMiddle1.middle1;
        return this.root;
    }

    #getHeight(node) {
        if (node.left == null) {
            return 0;
        }
        return 1 + this.#getHeight(node.left);
    }

    // Returns the height of this tree.
    getHeight() {
        return this.#getHeight(this.root);
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

    // Returns the number of keys in this tree.
    length() {
        let count = 0;
        const nodes = []
        nodes.push(this.root);

        while (!nodes.length) {
            const node = nodes.pop();
            if (node != null) {
                // Add the number of keys in the node to the count
                count = count + node.countKeys();

                // Push children
                nodes.push(node.left);
                nodes.push(node.middle1);
                nodes.push(node.middle2);
                nodes.push(node.right);
            }
        }
        return count;
    }

    // Rotates or fuses to add 1 or 2 additional keys to a node with 1 key.
    merge(node, nodeParent) {
        // Get references to node's siblings
        const nodeIndex = nodeParent.getChildIndex(node);
        const leftSibling = nodeParent.getChild(nodeIndex - 1);
        const rightSibling = nodeParent.getChild(nodeIndex + 1);

        // Check siblings for a key that can be transferred
        if (leftSibling != null && leftSibling.countKeys() >= 2) {
            this.rotateRight(leftSibling, nodeParent);
        } else if (rightSibling != null && rightSibling.countKeys() >= 2) {
            this.rotateLeft(rightSibling, nodeParent);
        } else {
            if (leftSibling == null) {
                node = this.fuse(nodeParent, node, rightSibling);
            } else {
                node = this.fuse(nodeParent, leftSibling, node);
            }
        }

        return node;
    }

    // Finds and removes the specified key from this tree.

    remove(key) {
        // Special case for tree with 1 key
        if (this.root.isLeaf() && this.root.countKeys() === 1) {
            if (this.root.A === key) {
                this.root = null;
                return true;
            }
            return false;
        }

        let currentParent = null;
        let current = this.root;
        while (current != null) {
            // Merge any non-root node with 1 key
            if (current.countKeys() === 1 && current !== this.root) {
                current = this.merge(current, currentParent);
            }

            // Check if current node contains key
            const keyIndex = current.getKeyIndex(key);
            if (keyIndex !== -1) {
                if (current.isLeaf()) {
                    current.removeKey(keyIndex);
                    return true;
                }

                // The node contains the key and is not a leaf, so the key is
                // replaced with the successor
                const tmpChild = current.getChild(keyIndex + 1);
                const tmpKey = this.getMinKey(tmpChild);
                this.remove(tmpKey);
                this.keySwap(this.root, key, tmpKey);
                return true;
            }

            // Current node does not contain key, so continue down tree
            currentParent = current;
            current = current.nextNode(key);
        }

        // key not found
        return false;
    }

    rotateLeft(node, nodeParent) {
        // Get the node's left sibling
        const nodeIndex = nodeParent.getChildIndex(node);
        const leftSibling = nodeParent.getChild(nodeIndex - 1);

        // Get key from the parent that will be copied into the left sibling
        const keyForLeftSibling = nodeParent.getKey(nodeIndex - 1);

        // Append the key to the left sibling
        leftSibling.appendKeyAndChild(keyForLeftSibling, node.left);

        // Replace the parent's key that was appended to the left sibling
        nodeParent.setKey(node.A, nodeIndex - 1);

        // Remove key A and left child from node
        node.removeKey(0);
    }

    rotateRight(node, nodeParent) {
        // Get the node's right sibling
        const nodeIndex = nodeParent.getChildIndex(node);
        const rightSibling = nodeParent.getChild(nodeIndex + 1);

        // Get key from the parent that will be copied into the right sibling
        const keyForRightSibling = nodeParent.getKey(nodeIndex);

        // Shift key and child references in right sibling
        rightSibling.C = rightSibling.B;
        rightSibling.B = rightSibling.A;
        rightSibling.right = rightSibling.middle2;
        rightSibling.middle2 = rightSibling.middle1;
        rightSibling.middle1 = rightSibling.left;

        // Set key A and the left child of rightSibling
        rightSibling.A = keyForRightSibling;
        rightSibling.left = node.removeRightmostChild();

        // Replace the parent's key that was prepended to the right sibling
        nodeParent.setKey(node.removeRightmostKey(), nodeIndex);
    }
}
