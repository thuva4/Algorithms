class TreapNode {
    key: number;
    priority: number;
    left: TreapNode | null = null;
    right: TreapNode | null = null;
    constructor(key: number) {
        this.key = key;
        this.priority = Math.floor(Math.random() * 2147483647);
    }
}

function rightRot(p: TreapNode): TreapNode {
    const q = p.left!;
    p.left = q.right;
    q.right = p;
    return q;
}

function leftRot(p: TreapNode): TreapNode {
    const q = p.right!;
    p.right = q.left;
    q.left = p;
    return q;
}

function insertTreapNode(root: TreapNode | null, key: number): TreapNode {
    if (!root) return new TreapNode(key);
    if (key < root.key) {
        root.left = insertTreapNode(root.left, key);
        if (root.left!.priority > root.priority) root = rightRot(root);
    } else if (key > root.key) {
        root.right = insertTreapNode(root.right, key);
        if (root.right!.priority > root.priority) root = leftRot(root);
    }
    return root;
}

function inorderTreap(node: TreapNode | null, result: number[]): void {
    if (!node) return;
    inorderTreap(node.left, result);
    result.push(node.key);
    inorderTreap(node.right, result);
}

export function treap(arr: number[]): number[] {
    let root: TreapNode | null = null;
    for (const val of arr) root = insertTreapNode(root, val);
    const result: number[] = [];
    inorderTreap(root, result);
    return result;
}
