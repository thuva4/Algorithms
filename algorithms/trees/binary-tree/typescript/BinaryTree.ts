class BinaryTreeNode {
    val: number;
    left: BinaryTreeNode | null = null;
    right: BinaryTreeNode | null = null;

    constructor(val: number) {
        this.val = val;
    }
}

function buildTree(arr: (number | null)[]): BinaryTreeNode | null {
    if (arr.length === 0 || arr[0] === null) return null;
    const nodes = arr.map((value) => value === null ? null : new BinaryTreeNode(value));

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;

        const leftIndex = 2 * i + 1;
        const rightIndex = 2 * i + 2;
        node.left = leftIndex < nodes.length ? nodes[leftIndex] : null;
        node.right = rightIndex < nodes.length ? nodes[rightIndex] : null;
    }

    return nodes[0];
}

export function levelOrderTraversal(arr: (number | null)[]): number[] {
    const root = buildTree(arr);
    if (!root) return [];

    const result: number[] = [];
    const queue: BinaryTreeNode[] = [root];

    while (queue.length > 0) {
        const node = queue.shift()!;
        result.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    return result;
}
