package hashtable

const tableSize = 64

type entry struct {
	key   int
	value int
	next  *entry
}

type hashTable struct {
	buckets [tableSize]*entry
}

func newHashTable() *hashTable {
	return &hashTable{}
}

func hashKey(key int) int {
	k := key
	if k < 0 {
		k = -k
	}
	return k % tableSize
}

func (ht *hashTable) put(key, value int) {
	idx := hashKey(key)
	cur := ht.buckets[idx]
	for cur != nil {
		if cur.key == key {
			cur.value = value
			return
		}
		cur = cur.next
	}
	ht.buckets[idx] = &entry{key: key, value: value, next: ht.buckets[idx]}
}

func (ht *hashTable) get(key int) int {
	idx := hashKey(key)
	cur := ht.buckets[idx]
	for cur != nil {
		if cur.key == key {
			return cur.value
		}
		cur = cur.next
	}
	return -1
}

func (ht *hashTable) delete(key int) {
	idx := hashKey(key)
	cur := ht.buckets[idx]
	var prev *entry
	for cur != nil {
		if cur.key == key {
			if prev == nil {
				ht.buckets[idx] = cur.next
			} else {
				prev.next = cur.next
			}
			return
		}
		prev = cur
		cur = cur.next
	}
}

// HashTableOps processes a sequence of hash table operations encoded as integers.
// Returns the sum of all get results (-1 for misses).
func HashTableOps(operations []int) int {
	table := newHashTable()
	opCount := operations[0]
	resultSum := 0
	idx := 1

	for i := 0; i < opCount; i++ {
		opType := operations[idx]
		key := operations[idx+1]
		value := operations[idx+2]
		idx += 3

		if opType == 1 {
			table.put(key, value)
		} else if opType == 2 {
			resultSum += table.get(key)
		} else if opType == 3 {
			table.delete(key)
		}
	}

	return resultSum
}
