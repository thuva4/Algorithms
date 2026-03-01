def minimax_ab(tree_values: list[int], depth: int, is_maximizing: bool) -> int:
    def solve(level: int, index: int, maximize: bool, alpha: int, beta: int) -> int:
        if level == depth:
            return tree_values[index]
        if maximize:
            best = float("-inf")
            for child in (index * 2, index * 2 + 1):
                best = max(best, solve(level + 1, child, False, alpha, beta))
                alpha = max(alpha, best)
                if alpha >= beta:
                    break
            return int(best)
        best = float("inf")
        for child in (index * 2, index * 2 + 1):
            best = min(best, solve(level + 1, child, True, alpha, beta))
            beta = min(beta, best)
            if alpha >= beta:
                break
        return int(best)

    return solve(0, 0, is_maximizing, -10**18, 10**18)
