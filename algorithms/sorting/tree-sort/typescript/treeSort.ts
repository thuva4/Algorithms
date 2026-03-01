class BSTNode {
    val: number;
    left: BSTNode | null = null;
    right: BSTNode | null = null;

    constructor(val: number) {
        this.val = val;
    }
}

function insertBST(root: BSTNode | null, val: number): BSTNode {
    if (root === null) return new BSTNode(val);
    if (val < root.val) root.left = insertBST(root.left, val);
    else root.right = insertBST(root.right, val);
    return root;
}

function inorderBST(root: BSTNode | null, result: number[]): void {
    if (root !== null) {
        inorderBST(root.left, result);
        result.push(root.val);
        inorderBST(root.right, result);
    }
}

export function treeSort(arr: number[]): number[] {
    if (arr.length <= 1) return [...arr];

    let root: BSTNode | null = null;
    for (const val of arr) {
        root = insertBST(root, val);
    }

    const result: number[] = [];
    inorderBST(root, result);
    return result;
}
