interface AvlNode {
    key: number;
    left: AvlNode | null;
    right: AvlNode | null;
    height: number;
}

function createNode(key: number): AvlNode {
    return { key, left: null, right: null, height: 1 };
}

function nodeHeight(node: AvlNode | null): number {
    return node ? node.height : 0;
}

function updateHeight(node: AvlNode): void {
    node.height = 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right));
}

function balanceFactor(node: AvlNode): number {
    return nodeHeight(node.left) - nodeHeight(node.right);
}

function rotateRight(y: AvlNode): AvlNode {
    const x = y.left!;
    const t2 = x.right;
    x.right = y;
    y.left = t2;
    updateHeight(y);
    updateHeight(x);
    return x;
}

function rotateLeft(x: AvlNode): AvlNode {
    const y = x.right!;
    const t2 = y.left;
    y.left = x;
    x.right = t2;
    updateHeight(x);
    updateHeight(y);
    return y;
}

function insertNode(node: AvlNode | null, key: number): AvlNode {
    if (!node) return createNode(key);
    if (key < node.key) node.left = insertNode(node.left, key);
    else if (key > node.key) node.right = insertNode(node.right, key);
    else return node;

    updateHeight(node);
    const bf = balanceFactor(node);

    if (bf > 1 && key < node.left!.key) return rotateRight(node);
    if (bf < -1 && key > node.right!.key) return rotateLeft(node);
    if (bf > 1 && key > node.left!.key) {
        node.left = rotateLeft(node.left!);
        return rotateRight(node);
    }
    if (bf < -1 && key < node.right!.key) {
        node.right = rotateRight(node.right!);
        return rotateLeft(node);
    }

    return node;
}

function inorderTraversal(node: AvlNode | null, result: number[]): void {
    if (!node) return;
    inorderTraversal(node.left, result);
    result.push(node.key);
    inorderTraversal(node.right, result);
}

export function avlInsertInorder(arr: number[]): number[] {
    let root: AvlNode | null = null;
    for (const val of arr) {
        root = insertNode(root, val);
    }
    const result: number[] = [];
    inorderTraversal(root, result);
    return result;
}
