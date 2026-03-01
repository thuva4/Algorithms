type Link = Option<Box<Node>>;

struct Node {
    value: i32,
    next: Link,
}

fn build_list(arr: &[i32]) -> Link {
    let mut head: Link = None;
    for &val in arr.iter().rev() {
        head = Some(Box::new(Node {
            value: val,
            next: head,
        }));
    }
    head
}

fn to_array(head: &Link) -> Vec<i32> {
    let mut result = Vec::new();
    let mut current = head;
    while let Some(node) = current {
        result.push(node.value);
        current = &node.next;
    }
    result
}

pub fn reverse_linked_list(arr: &[i32]) -> Vec<i32> {
    let head = build_list(arr);

    let mut prev: Link = None;
    let mut current = head;
    while let Some(mut node) = current {
        current = node.next.take();
        node.next = prev;
        prev = Some(node);
    }

    to_array(&prev)
}
