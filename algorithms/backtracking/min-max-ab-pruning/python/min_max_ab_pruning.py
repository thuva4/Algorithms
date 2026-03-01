import math


def minimax_ab(depth, node_index, is_max, scores, h, alpha, beta):
    if depth == h:
        return scores[node_index]

    if is_max:
        best_val = float('-inf')
        for child_index in [node_index * 2, node_index * 2 + 1]:
            child_value = minimax_ab(depth + 1, child_index, False, scores, h, alpha, beta)
            best_val = max(best_val, child_value)
            alpha = max(alpha, best_val)
            if beta <= alpha:
                break
        return best_val
    else:
        best_val = float('inf')
        for child_index in [node_index * 2, node_index * 2 + 1]:
            child_value = minimax_ab(depth + 1, child_index, True, scores, h, alpha, beta)
            best_val = min(best_val, child_value)
            beta = min(beta, best_val)
            if beta <= alpha:
                break
        return best_val


if __name__ == "__main__":
    scores = [3, 5, 2, 9, 12, 5, 23, 23]
    h = int(math.log2(len(scores)))
    result = minimax_ab(0, 0, True, scores, h, float('-inf'), float('inf'))
    print(f"The optimal value is: {result}")
