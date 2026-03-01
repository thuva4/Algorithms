private class ListNode {
    var value: Int
    var next: ListNode?

    init(_ value: Int) {
        self.value = value
    }
}

private func buildList(_ arr: [Int]) -> ListNode? {
    guard !arr.isEmpty else { return nil }
    let head = ListNode(arr[0])
    var current = head
    for i in 1..<arr.count {
        current.next = ListNode(arr[i])
        current = current.next!
    }
    return head
}

private func toArray(_ head: ListNode?) -> [Int] {
    var result: [Int] = []
    var current = head
    while let node = current {
        result.append(node.value)
        current = node.next
    }
    return result
}

func reverseLinkedList(_ arr: [Int]) -> [Int] {
    let head = buildList(arr)

    var prev: ListNode? = nil
    var current = head
    while let node = current {
        let next = node.next
        node.next = prev
        prev = node
        current = next
    }

    return toArray(prev)
}
