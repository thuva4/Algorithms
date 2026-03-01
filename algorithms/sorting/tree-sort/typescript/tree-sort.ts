class Node {
  key: number;
  left: Node | null;
  right: Node | null;

  constructor(key: number) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

export function treeSort(arr: number[]): number[] {
  let root: Node | null = null;
  for (const value of arr) {
    root = insert(root, value);
  }

  let index = 0;
  storeSorted(root, arr, { get: () => index, inc: () => index++ });
  return arr;
}

function insert(root: Node | null, key: number): Node {
  if (root === null) {
    return new Node(key);
  }

  if (key < root.key) {
    root.left = insert(root.left, key);
  } else {
    root.right = insert(root.right, key);
  }

  return root;
}

function storeSorted(root: Node | null, arr: number[], idx: { get: () => number, inc: () => number }): void {
  if (root !== null) {
    storeSorted(root.left, arr, idx);
    arr[idx.inc()] = root.key;
    storeSorted(root.right, arr, idx);
  }
}
