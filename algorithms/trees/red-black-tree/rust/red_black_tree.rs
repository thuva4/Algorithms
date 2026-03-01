pub fn rb_insert_inorder(arr: &[i32]) -> Vec<i32> {
    #[derive(Clone, Copy, PartialEq)]
    enum Color { Red, Black }

    struct Node {
        key: i32,
        left: i32,
        right: i32,
        parent: i32,
        color: Color,
    }

    let mut nodes: Vec<Node> = Vec::new();
    let mut root: i32 = -1;

    fn new_node(nodes: &mut Vec<Node>, key: i32) -> i32 {
        let idx = nodes.len() as i32;
        nodes.push(Node { key, left: -1, right: -1, parent: -1, color: Color::Red });
        idx
    }

    fn rotate_left(nodes: &mut Vec<Node>, root: &mut i32, x: i32) {
        let y = nodes[x as usize].right;
        let y_left = nodes[y as usize].left;
        nodes[x as usize].right = y_left;
        if y_left != -1 {
            nodes[y_left as usize].parent = x;
        }
        let x_parent = nodes[x as usize].parent;
        nodes[y as usize].parent = x_parent;
        if x_parent == -1 { *root = y; }
        else if x == nodes[x_parent as usize].left {
            nodes[x_parent as usize].left = y;
        } else {
            nodes[x_parent as usize].right = y;
        }
        nodes[y as usize].left = x;
        nodes[x as usize].parent = y;
    }

    fn rotate_right(nodes: &mut Vec<Node>, root: &mut i32, x: i32) {
        let y = nodes[x as usize].left;
        let y_right = nodes[y as usize].right;
        nodes[x as usize].left = y_right;
        if y_right != -1 {
            nodes[y_right as usize].parent = x;
        }
        let x_parent = nodes[x as usize].parent;
        nodes[y as usize].parent = x_parent;
        if x_parent == -1 { *root = y; }
        else if x == nodes[x_parent as usize].right {
            nodes[x_parent as usize].right = y;
        } else {
            nodes[x_parent as usize].left = y;
        }
        nodes[y as usize].right = x;
        nodes[x as usize].parent = y;
    }

    fn fix_insert(nodes: &mut Vec<Node>, root: &mut i32, mut z: i32) {
        while z != *root && nodes[nodes[z as usize].parent as usize].color == Color::Red {
            let p = nodes[z as usize].parent;
            let gp = nodes[p as usize].parent;
            if p == nodes[gp as usize].left {
                let y = nodes[gp as usize].right;
                if y != -1 && nodes[y as usize].color == Color::Red {
                    nodes[p as usize].color = Color::Black;
                    nodes[y as usize].color = Color::Black;
                    nodes[gp as usize].color = Color::Red;
                    z = gp;
                } else {
                    if z == nodes[p as usize].right {
                        z = p;
                        rotate_left(nodes, root, z);
                    }
                    let p2 = nodes[z as usize].parent;
                    let gp2 = nodes[p2 as usize].parent;
                    nodes[p2 as usize].color = Color::Black;
                    nodes[gp2 as usize].color = Color::Red;
                    rotate_right(nodes, root, gp2);
                }
            } else {
                let y = nodes[gp as usize].left;
                if y != -1 && nodes[y as usize].color == Color::Red {
                    nodes[p as usize].color = Color::Black;
                    nodes[y as usize].color = Color::Black;
                    nodes[gp as usize].color = Color::Red;
                    z = gp;
                } else {
                    if z == nodes[p as usize].left {
                        z = p;
                        rotate_right(nodes, root, z);
                    }
                    let p2 = nodes[z as usize].parent;
                    let gp2 = nodes[p2 as usize].parent;
                    nodes[p2 as usize].color = Color::Black;
                    nodes[gp2 as usize].color = Color::Red;
                    rotate_left(nodes, root, gp2);
                }
            }
        }
        nodes[*root as usize].color = Color::Black;
    }

    fn insert_key(nodes: &mut Vec<Node>, root: &mut i32, key: i32) {
        let mut y: i32 = -1;
        let mut x = *root;
        while x != -1 {
            y = x;
            if key < nodes[x as usize].key { x = nodes[x as usize].left; }
            else if key > nodes[x as usize].key { x = nodes[x as usize].right; }
            else { return; }
        }
        let node = new_node(nodes, key);
        nodes[node as usize].parent = y;
        if y == -1 { *root = node; }
        else if key < nodes[y as usize].key { nodes[y as usize].left = node; }
        else { nodes[y as usize].right = node; }
        fix_insert(nodes, root, node);
    }

    fn inorder(nodes: &Vec<Node>, node: i32, result: &mut Vec<i32>) {
        if node == -1 { return; }
        inorder(nodes, nodes[node as usize].left, result);
        result.push(nodes[node as usize].key);
        inorder(nodes, nodes[node as usize].right, result);
    }

    for &val in arr {
        insert_key(&mut nodes, &mut root, val);
    }
    let mut result = Vec::new();
    inorder(&nodes, root, &mut result);
    result
}
