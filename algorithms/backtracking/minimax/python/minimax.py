import math

def minimax(tree_values, depth, is_maximizing):
    def solve(level, node_index, maximize):
        if level == depth:
            return tree_values[node_index]
        left = solve(level + 1, node_index * 2, not maximize)
        right = solve(level + 1, node_index * 2 + 1, not maximize)
        return max(left, right) if maximize else min(left, right)

    return solve(0, 0, is_maximizing)


if __name__ == "__main__":
    scores = [3, 5, 2, 9, 12, 5, 23, 23]
    h = int(math.log2(len(scores)))
    result = minimax(scores, h, True)
    print(f"The optimal value is: {result}")
