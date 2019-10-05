function dijkstra(g, source) {
    /* initially, all distances are infinite and all predecessors are null */
    for(var n in g.nodes)
        g.nodes[n].distance = Infinity;
        /* predecessors are implicitly null */

    source.distance = 0;
    var counter = 0;
    /* set of unoptimized nodes, sorted by their distance (but a Fibonacci heap
       would be better) */
    var q = new BinaryMinHeap(g.nodes, "distance");

    var node;
    /* get the node with the smallest distance */
    /* as long as we have unoptimized nodes */

    while(q.min() != undefined) {
        /* remove the latest */
        node = q.extractMin();
        node.optimized = true;

        /* no nodes accessible from this one, should not happen */
        if(node.distance == Infinity)
            throw "Orphaned node!";

        /* for each neighbour of node */
        for(e in node.edges) {
            if(node.edges[e].target.optimized)
                continue;

            /* look for an alternative route */
            var alt = node.distance + node.edges[e].weight;
            
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
