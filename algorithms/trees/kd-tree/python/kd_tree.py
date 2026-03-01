import math


class KDNode:
    def __init__(self, point, left=None, right=None, axis=0):
        self.point = point
        self.left = left
        self.right = right
        self.axis = axis


def build_kd_tree(points, depth=0):
    if not points:
        return None
    k = 2
    axis = depth % k
    points.sort(key=lambda p: p[axis])
    mid = len(points) // 2
    return KDNode(
        point=points[mid],
        left=build_kd_tree(points[:mid], depth + 1),
        right=build_kd_tree(points[mid + 1:], depth + 1),
        axis=axis
    )


def sq_dist(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2


def nearest_neighbor(root, query, best=None, best_dist=float('inf')):
    if root is None:
        return best, best_dist

    d = sq_dist(root.point, query)
    if d < best_dist:
        best_dist = d
        best = root.point

    axis = root.axis
    diff = query[axis] - root.point[axis]

    if diff <= 0:
        near, far = root.left, root.right
    else:
        near, far = root.right, root.left

    best, best_dist = nearest_neighbor(near, query, best, best_dist)

    if diff * diff < best_dist:
        best, best_dist = nearest_neighbor(far, query, best, best_dist)

    return best, best_dist


def kd_tree(data):
    n = data[0]
    points = []
    idx = 1
    for _ in range(n):
        points.append((data[idx], data[idx + 1]))
        idx += 2
    qx, qy = data[idx], data[idx + 1]

    root = build_kd_tree(points)
    _, dist = nearest_neighbor(root, (qx, qy))
    return dist


if __name__ == "__main__":
    print(kd_tree([3, 1, 2, 3, 4, 5, 6, 3, 3]))
    print(kd_tree([2, 0, 0, 5, 5, 0, 0]))
    print(kd_tree([1, 3, 4, 0, 0]))
