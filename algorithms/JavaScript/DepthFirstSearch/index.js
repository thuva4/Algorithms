/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const DFS = (graph, source, target = -1) => {
  // Some error handling
  if (typeof graph.getNeighbors !== 'function') {
    throw new Error('Graph should implement a getNeighbors function');
  }
  if (typeof source !== 'number') {
    throw new Error('source should be a number');
  }

  const stack = []; // The stack that will be used
  const order = []; // Array to hold the order of visit. Mainly for unit testing
  const visited = {}; // Keep track of visited vertices

  let found = false;
  stack.push(source);
  visited[source] = true;
  while (stack.length !== 0) {
    const currentVertex = stack.pop();
    order.push(currentVertex);
    const neighbors = graph.getNeighbors(currentVertex);
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        stack.push(neighbor);
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
    },
  };

  return {
    getGraph() {
      const Graph = { ...GraphTemplate };
      Graph.init();
      return Graph;
    },
  };
})();

module.exports = { DFS, GraphFactory };
