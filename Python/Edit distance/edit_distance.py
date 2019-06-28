# Helpful tutorial: https://www.youtube.com/watch?v=We3YDTzNXEk
# Useful link: https://en.wikipedia.org/wiki/Edit_distance
def get_edit_distance(s1, s2):

    l1 = len(s1) + 1
    l2 = len(s2) + 1
    edit_table = {}
    for i in range(l1):
        edit_table[i, 0] = i

    for j in range(l2):
        edit_table[0, j] = j

    for i in range(1, l1):
        for j in range(1, l2):
            edit_table[i, j] = min(edit_table[i - 1, j], edit_table[i, j - 1],
                                   edit_table[i - 1, j - 1])
            if s1[i - 1] != s2[j - 1]:
                edit_table[i, j] += 1

    return edit_table[i, j]


if __name__ == '__main__':
    # returns 1 as adding 'a' in 2nd postion to
    # 'hello' will make it 'haello'
    print get_edit_distance('hello', 'haello')
    # returns 2 as replacing 'o' in 'redor' and adding 'e' at the end will make
    # 'redare'
    print get_edit_distance('redor', 'redare')

