const BFS = (graph, source, target = -1) => {
  // Some error handling
  if (typeof graph.getNeighbors !== "function") {
    throw "Graph should implement a getNeighbors function";
  }
  if (typeof source !== "number") {
    throw "source should be a number";
  }
  
  const Q = [], // The queue that will be used
    order = [], // Array to hold the order of visit. Mainly for unit testing
    visited = {}; // Keep track of visited vertices
  
  let found = false;
  Q.push(source);
  visited[source] = true;
  while (Q.length !== 0) {
    const currentVertex = Q.shift();
    order.push(currentVertex);
    const neighbors = graph.getNeighbors(currentVertex);
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        Q.push(neighbor);
        visited[neighbor] = true;
        if (neighbor === target) {
          found = true;
        }
      }
    }
  }
  return { order, found };
};

const GraphFactory = (() => {
  const GraphTemplate = {
    init() {
      this._graph = [];
    },
    getNeighbors(vertex) {
      return this._graph[vertex] || [];
    },
    addEdge(source, target, biDirectional = true) {
      this._addEdge(source, target);
      if (biDirectional) {
        this._addEdge(target, source);
      }
    },
    _addEdge(source, target) {
      this._graph[source] = this._graph[source] || [];
      this._graph[source].push(target);
    },
    printGraph() {
      console.log(JSON.stringify(this._graph, null, 2));
    }
  };
  
  return {
    getGraph() {
      const Graph = Object.assign({}, GraphTemplate);
      Graph.init();
      return Graph;
    }
  };
})();

module.exports = { GraphFactory,  BFS };