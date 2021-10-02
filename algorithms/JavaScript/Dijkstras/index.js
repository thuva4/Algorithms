/* eslint-disable no-unused-vars */
/* eslint-disable no-continue */
/* eslint-disable no-undef */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
function dijkstra(g, source) {
  /* initially, all distances are infinite and all predecessors are null */
  for (const n in g.nodes) g.nodes[n].distance = Infinity;
  /* predecessors are implicitly null */

  source.distance = 0;
  const counter = 0;
  /* set of unoptimized nodes, sorted by their distance (but a Fibonacci heap
       would be better) */
  const q = new BinaryMinHeap(g.nodes, 'distance');

  let node;
  /* get the node with the smallest distance */
  /* as long as we have unoptimized nodes */

  while (q.min() !== undefined) {
    /* remove the latest */
    node = q.extractMin();
    node.optimized = true;

    /* no nodes accessible from this one, should not happen */
    if (node.distance === Infinity) throw new Error('Orphaned node!');

    /* for each neighbour of node */
    for (const e in node.edges) {
      if (node.edges[e].target.optimized) continue;

      /* look for an alternative route */
      const alt = node.distance + node.edges[e].weight;

      /* update distance and route if a better one has been found */
      if (alt < node.edges[e].target.distance) {
        /* update distance of neighbour */
        node.edges[e].target.distance = alt;

        /* update priority queue */
        q.heapify();

        /* update path */
        node.edges[e].target.predecessor = node;
      }
    }
  }
}

module.exports = { dijkstra };
