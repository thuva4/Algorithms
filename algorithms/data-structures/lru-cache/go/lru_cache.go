package lrucache

type node struct {
	key, value int
	prev, next *node
}

type lruCache struct {
	capacity int
	m        map[int]*node
	head     *node
	tail     *node
}

func newLRUCache(capacity int) *lruCache {
	head := &node{}
	tail := &node{}
	head.next = tail
	tail.prev = head
	return &lruCache{
		capacity: capacity,
		m:        make(map[int]*node),
		head:     head,
		tail:     tail,
	}
}

func (c *lruCache) removeNode(n *node) {
	n.prev.next = n.next
	n.next.prev = n.prev
}

func (c *lruCache) addToHead(n *node) {
	n.next = c.head.next
	n.prev = c.head
	c.head.next.prev = n
	c.head.next = n
}

func (c *lruCache) get(key int) int {
	if n, ok := c.m[key]; ok {
		c.removeNode(n)
		c.addToHead(n)
		return n.value
	}
	return -1
}

func (c *lruCache) put(key, value int) {
	if n, ok := c.m[key]; ok {
		n.value = value
		c.removeNode(n)
		c.addToHead(n)
	} else {
		if len(c.m) == c.capacity {
			lru := c.tail.prev
			c.removeNode(lru)
			delete(c.m, lru.key)
		}
		n := &node{key: key, value: value}
		c.m[key] = n
		c.addToHead(n)
	}
}

// LruCache processes a sequence of LRU cache operations encoded as integers.
// Returns the sum of all get results (-1 for misses).
func LruCache(operations []int) int {
	capacity := operations[0]
	opCount := operations[1]
	cache := newLRUCache(capacity)
	resultSum := 0
	idx := 2

	for i := 0; i < opCount; i++ {
		opType := operations[idx]
		key := operations[idx+1]
		value := operations[idx+2]
		idx += 3

		if opType == 1 {
			cache.put(key, value)
		} else if opType == 2 {
			resultSum += cache.get(key)
		}
	}

	return resultSum
}
