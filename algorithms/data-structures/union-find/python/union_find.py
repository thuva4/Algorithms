#https://stackoverflow.com/questions/20154368/union-find-implementation-using-python
def union_find(lis):
    lis = map(set, lis)
    unions = []
    for item in lis:
        temp = []
        for s in unions:
            if s.isdisjoint(item):
                temp.append(s)
            else:
                item = s.union(item)
        temp.append(item)
        unions = temp
    return unions



if __name__ == '__main__':
    l = [[1, 2], [2, 3], [4, 5], [6, 7], [1, 7]]
    print(union_find(l))
