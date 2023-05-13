class BNode {
    a;
    b;
    c;
    left = null;
    right = null;
    middle1 = null;
    middle2 = null;

    constructor(keyA = null, keyB = null, keyC = null, left = null, middle1 = null, middle2 = null, right = null) {
        this.a = keyA;
        this.b = keyB;
        this.c = keyC;
        this.left = left;
        this.right = right;
        this.middle1 = middle1;
        this.middle2 = middle2;
    }


    // Appends 1 key and 1 child to this node.
    // Preconditions:
    // 1. This node has 1 or 2 keys
    // 2. key > all keys in this node
    // 3. Child subtree contains only keys > key
    appendKeyAndChild(key, child) {
        if (this.b == null) {
            this.b = key;
            this.middle2 = child;
        } else {
            this.c = key;
            this.right = child;
        }
    }

    countKeys() {
        if (this.c != null) {
            return 3;
        } else if (this.b != null) {
            return 2;
        }
        return 1;
    }

    // Returns the left, middle1, middle2, or right child if the childIndex
    // argument is 0, 1, 2, or 3, respectively.
    // Returns null if the childIndex argument is < 0 or > 3.

    getChild(childIndex) {
        if (childIndex === 0) {
            return this.left;
        } else if (childIndex === 1) {
            return this.middle1;
        } else if (childIndex === 2) {
            return this.middle2;
        } else if (childIndex === 3) {
            return this.right;
        }
        return null;
    }

    // Returns 0, 1, 2, or 3 if the child argument is this node's left,
    // middle1, middle2, or right child, respectively.
    // Returns -1 if the child argument is not a child of this node.

    getChildIndex(child) {
        if (child === this.left) {
            return 0;
        } else if (child === this.middle1) {
            return 1;
        } else if (child === this.middle2) {
            return 2;
        } else if (child === this.right) {
            return 3;
        }
        return -1;
    }

    // Returns this node's A, B, or C key, if the keyIndex argument is
    // 0, 1, or 2, respectively.
    // Returns null if the keyIndex argument is < 0 or > 2.

    getKey(keyIndex) {
        if (keyIndex === 0) {
            return this.a;
        } else if (keyIndex === 1) {
            return this.b;
        } else if (keyIndex === 2) {
            return this.c;
        }
        return null;
    }

    // Returns 0, 1, or 2, if the key argument is this node's A, B, or
    // C key, respectively.
    // Returns -1 if the key argument is not a key of this node.
    getKeyIndex(key) {
        if (key === this.a) {
            return 0;
        } else if (key === this.b) {
            return 1;
        } else if (key=== this.c) {
            return 2;
        }
        return -1;
    }

    // Returns true if this node has the specified key, false otherwise.
    hasKey(key) {
        return  key === this.a || key === this.b || key=== this.c;
    }

    // Inserts a new key into the proper location in this node.
    // Precondition: This node is a leaf and has 2 or fewer keys
    insertKey(key) {
        if (this.a == null || key < this.a) {
            this.c = this.b;
            this.b = this.a;
            this.a = key;
        } else if (this.b == null || key < this.b) {
            this.c = this.b;
            this.b = key;
        } else {
            this.c = key;
        }
    }

    // Inserts a new key into the proper location in this node, and
    // sets the children on either side of the inserted key.
    // Precondition: This node has 2 or fewer keys

    insertKeyWithChildren(key, leftChild, rightChild) {
        if (this.a == null || key < this.a) {
            this.c = this.b;
            this.b = this.a;
            this.a = key;
            this.right = this.middle2;
            this.middle2 = this.middle1;
            this.middle1 = rightChild;
            this.left = leftChild;
        } else if (this.b == null || key < this.b) {
            this.c = this.b;
            this.b = key;
            this.right = this.middle2;
            this.middle2 = rightChild;
            this.middle1 = leftChild;
        } else {
            this.c = key;
            this.right = rightChild;
            this.middle2 = leftChild;
        }
    }

    // Returns true if this node is a leaf, false otherwise.
    isLeaf() {
        return this.left == null;
    }

    // Returns the child of this node that would be visited next in the
    // traversal to search for the specified key
    nextNode(key) {
        if (this.a == null || key < this.a) {
            return this.left;
        } else if (this.b == null || key < this.b) {
            return this.middle1;
        } else if (this.c == null || key < this.c) {
            return this.middle2;
        }
        return this.right;
    }

    // Removes key A, B, or C from this node, if keyIndex is 0, 1, or 2,
    // respectively. Other keys and children are shifted as necessary.
    removeKey(keyIndex) {
        if (keyIndex === 0) {
            this.a = this.b;
            this.b = this.c;
            this.c = null;
            this.left = this.middle1;
            this.middle1 = this.middle2;
            this.middle2 = this.right;
            this.right = null;
        } else if (keyIndex === 1) {
            this.b = this.c;
            this.c = null;
            this.middle2 = this.right;
            this.right = null;
        } else if (keyIndex === 2) {
            this.c = null;
            this.right = null;
        }
    }

    // Removes and returns the rightmost child. Two possible cases exist:
    // 1. If this node has a right child, right is set to null, and the previous right value is returned.
    // 2. Else if this node has a middle2 child, middle2 is set to null, and the previous right value is returned.
    // 3. Otherwise, no action is taken, and null is returned.
    // No keys are changed in any case.

    removeRightmostChild() {
        let removed = null;
        if (this.right != null) {
            removed = this.right;
            this.right = null;
        } else if (this.middle2 != null) {
            removed = this.middle2;
            this.middle2 = null;
        }
        return removed;
    }

    // Removes and returns the rightmost key. Three possible cases exist:
    // 1. If this node has 3 keys, C is set to null and the previous C value is returned.
    // 2. If this node has 2 keys, B is set to null and the previous B value is returned.
    // 3. Otherwise, no action is taken and null is returned.
    // No children are changed in any case.
    removeRightmostKey() {
        let removed = null;
        if (this.c != null) {
            removed = this.c;
            this.c = null;
        } else if (this.b != null) {
            removed = this.b;
            this.b = null;
        }
        return removed;
    }

    // Sets the left, middle1, middle2, or right child if the childIndex
    // argument is 0, 1, 2, or 3, respectively.
    // Does nothing if the childIndex argument is < 0 or > 3.
    setChild(child, childIndex) {
        if (childIndex === 0) {
            this.left = child;
        } else if (childIndex === 1) {
            this.middle1 = child;
        } else if (childIndex === 2) {
            this.middle2 = child;
        } else if (childIndex === 3) {
            this.right = child;
        }
    }

    // Sets this node's A, B, or C key if the keyIndex argument is 0, 1, or 2, respectively.
    // Does nothing if the key index argument is < 0 or > 2.
    setKey(key, keyIndex) {
        if (keyIndex === 0) {
            this.a = key;
        } else if (keyIndex === 1) {
            this.b = key;
        } else if (keyIndex === 2) {
            this.c = key;
        }
    }
}
