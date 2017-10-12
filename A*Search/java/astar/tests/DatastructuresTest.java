package astar.tests;

import static org.junit.Assert.assertEquals;

import java.util.Comparator;

import org.junit.Test;

import astar.datastructures.HashPriorityQueue;

public class DatastructuresTest {

	@Test
	public void hashPriorityQueueTest() {

		// test inconsistent equal and comparator
		// compare returns 0 but elements are not equal
		class InconsistentComparator implements Comparator<Integer> {
			public int compare(Integer x, Integer y) {
				return 0;
			}
		}
		HashPriorityQueue<Integer, Integer> Q = new HashPriorityQueue<Integer, Integer>(
				new InconsistentComparator());

		Q.add(0, 0);
		Q.add(1, 1);
		Q.add(2, 2);
		Q.add(3, 3);

		// is the correct element removed?
		// Only when a key is provided
		Q.remove(1, 1);
		assertEquals(true, Q.contains(0));
		assertEquals(false, Q.contains(1));
		assertEquals(true, Q.contains(2));
		assertEquals(true, Q.contains(3));
		Q.remove(0, 0);
		assertEquals(false, Q.contains(0));
		assertEquals(true, Q.contains(2));
		assertEquals(true, Q.contains(3));
		Q.remove(3, 3);
		assertEquals(true, Q.contains(2));
		assertEquals(false, Q.contains(3));

		Q.clear();
		Q.add(0, 0);
		Q.add(1, 1);
		Q.add(2, 2);
		Q.add(3, 3);

		int x = Q.poll();
		// due to inconsistent comparator,
		// all elements are removed
		assertEquals(0, Q.size());

		// if inconsistent would be working
		// assertEquals(0, x);
		// assertEquals(3, Q.size());
		// assertEquals(false, Q.contains(0));
		// assertEquals(true, Q.contains(1));
		// assertEquals(true, Q.contains(2));
		// assertEquals(true, Q.contains(3));

	}

}
