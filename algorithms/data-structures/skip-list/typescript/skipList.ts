const MAX_LEVEL = 16;

class SkipNode {
    key: number;
    forward: (SkipNode | null)[];
    constructor(key: number, level: number) {
        this.key = key;
        this.forward = new Array(level + 1).fill(null);
    }
}

export function skipList(arr: number[]): number[] {
    const header = new SkipNode(-Infinity, MAX_LEVEL);
    let level = 0;

    for (const val of arr) {
        const update: (SkipNode | null)[] = new Array(MAX_LEVEL + 1).fill(null);
        let current: SkipNode = header;
        for (let i = level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i]!.key < val)
                current = current.forward[i]!;
            update[i] = current;
        }
        let next = current.forward[0];
        if (next && next.key === val) continue;

        let newLevel = 0;
        while (Math.random() < 0.5 && newLevel < MAX_LEVEL) newLevel++;
        if (newLevel > level) {
            for (let i = level + 1; i <= newLevel; i++) update[i] = header;
            level = newLevel;
        }
        const newNode = new SkipNode(val, newLevel);
        for (let i = 0; i <= newLevel; i++) {
            newNode.forward[i] = update[i]!.forward[i];
            update[i]!.forward[i] = newNode;
        }
    }

    const result: number[] = [];
    let node = header.forward[0];
    while (node) {
        result.push(node.key);
        node = node.forward[0];
    }
    return result;
}
