class BSTNode {
    key: number;
    left: BSTNode | null = null;
    right: BSTNode | null = null;

    constructor(key: number) {
        this.key = key;
    }
}

function insert(root: BSTNode | null, key: number): BSTNode {
    if (root === null) {
        return new BSTNode(key);
    }
    if (key <= root.key) {
        root.left = insert(root.left, key);
    } else {
        root.right = insert(root.right, key);
    }
    return root;
}

function inorder(root: BSTNode | null, result: number[]): void {
    if (root === null) {
        return;
    }
    inorder(root.left, result);
    result.push(root.key);
    inorder(root.right, result);
}

export function bstInorder(arr: number[]): number[] {
    let root: BSTNode | null = null;
    for (const key of arr) {
        root = insert(root, key);
    }

    const result: number[] = [];
    inorder(root, result);
    return result;
}
