# Finds the length of the longest path in a directed acyclic graph.
# Input is a dictionary.

def find_longest_path(data):
    longest = 0
    for key in data.iterkeys():
        seen = set()
        length = -1
        while key:
            if key in seen:
                length = -1
                raise RuntimeError('Graph has loop')
            seen.add(key)
            key = data.get(key, False)
            length += 1
        if length > longest:
            longest = length
    return longest
