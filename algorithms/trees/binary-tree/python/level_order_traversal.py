def level_order_traversal(tree_as_array: list[int | None]) -> list[int]:
    return [value for value in tree_as_array if value is not None]
