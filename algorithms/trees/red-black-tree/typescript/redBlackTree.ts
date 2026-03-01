const RED = true;
const BLACK = false;

interface RBNode {
    key: number;
    left: RBNode | null;
    right: RBNode | null;
    parent: RBNode | null;
    color: boolean;
}

function createRBNode(key: number): RBNode {
    return { key, left: null, right: null, parent: null, color: RED };
}

export function rbInsertInorder(arr: number[]): number[] {
    let root: RBNode | null = null;

    function rotateLeft(x: RBNode): void {
        const y = x.right!;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;
        if (!x.parent) root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    }

    function rotateRight(x: RBNode): void {
        const y = x.left!;
        x.left = y.right;
        if (y.right) y.right.parent = x;
        y.parent = x.parent;
        if (!x.parent) root = y;
        else if (x === x.parent.right) x.parent.right = y;
        else x.parent.left = y;
        y.right = x;
        x.parent = y;
    }

    function fixInsert(z: RBNode): void {
        while (z.parent && z.parent.color === RED) {
            const gp = z.parent.parent!;
            if (z.parent === gp.left) {
                const y = gp.right;
                if (y && y.color === RED) {
                    z.parent.color = BLACK;
                    y.color = BLACK;
                    gp.color = RED;
                    z = gp;
                } else {
                    if (z === z.parent.right) {
                        z = z.parent;
                        rotateLeft(z);
                    }
                    z.parent!.color = BLACK;
                    z.parent!.parent!.color = RED;
                    rotateRight(z.parent!.parent!);
                }
            } else {
                const y = gp.left;
                if (y && y.color === RED) {
                    z.parent.color = BLACK;
                    y.color = BLACK;
                    gp.color = RED;
                    z = gp;
                } else {
                    if (z === z.parent.left) {
                        z = z.parent;
                        rotateRight(z);
                    }
                    z.parent!.color = BLACK;
                    z.parent!.parent!.color = RED;
                    rotateLeft(z.parent!.parent!);
                }
            }
        }
        root!.color = BLACK;
    }

    function insert(key: number): void {
        let y: RBNode | null = null;
        let x = root;
        while (x) {
            y = x;
            if (key < x.key) x = x.left;
            else if (key > x.key) x = x.right;
            else return;
        }
        const node = createRBNode(key);
        node.parent = y;
        if (!y) root = node;
        else if (key < y.key) y.left = node;
        else y.right = node;
        fixInsert(node);
    }

    function inorder(node: RBNode | null, result: number[]): void {
        if (!node) return;
        inorder(node.left, result);
        result.push(node.key);
        inorder(node.right, result);
    }

    for (const val of arr) insert(val);
    const result: number[] = [];
    inorder(root, result);
    return result;
}
