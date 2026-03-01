class _Node:
    __slots__ = ("value", "next")

    def __init__(self, value: int) -> None:
        self.value = value
        self.next: "_Node | None" = None


def _build_list(arr: list[int]) -> "_Node | None":
    if not arr:
        return None
    head = _Node(arr[0])
    current = head
    for val in arr[1:]:
        current.next = _Node(val)
        current = current.next
    return head


def _to_array(head: "_Node | None") -> list[int]:
    result: list[int] = []
    current = head
    while current is not None:
        result.append(current.value)
        current = current.next
    return result


def reverse_linked_list(arr: list[int]) -> list[int]:
    head = _build_list(arr)

    prev = None
    current = head
    while current is not None:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node

    return _to_array(prev)
