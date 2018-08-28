// Fully runnable code, along with test cases at https://codepen.io/sniper6/pen/KXrJqG/

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

describe("BFS", () => {
  let graph = null;

  beforeEach(() => {
    graph = GraphFactory.getGraph();
  });

  it("should throw error on bad graph", () => {
    expect(() => {
      BFS({});
    }).toThrow("Graph should implement a getNeighbors function");
  });

  it("should throw error on no source vertex", () => {
    expect(() => {
      BFS(graph);
    }).toThrow("source should be a number");
  });

  it("simple bi-directional graph where target is reachable", () => {
    graph.addEdge(0, 1);
    graph.addEdge(0, 3);
    graph.addEdge(1, 2);
    expect(BFS(graph, 0, 3)).toEqual({
      order: [0, 1, 3, 2],
      found: true
    });
  });

  it("complex bi-directional graph where target is reachable", () => {
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 3);
    graph.addEdge(3, 4);
    graph.addEdge(4, 2);
    expect(BFS(graph, 0, 3)).toEqual({
      order: [0, 1, 2, 3, 4],
      found: true
    });
  });
  
  it("complex uni-directional graph where target is reachable", () => {
    graph.addEdge(0, 1, false);
    graph.addEdge(0, 2, false);
    graph.addEdge(1, 3, false);
    graph.addEdge(3, 4, false);
    graph.addEdge(3, 5, false);
    graph.addEdge(4, 2, false);
    expect(BFS(graph, 0, 3)).toEqual({
      order: [0, 1, 2, 3, 4, 5],
      found: true
    });
  });

  it("simple bi-directional graph where target is not present", () => {
    graph.addEdge(0, 1);
    graph.addEdge(0, 3);
    graph.addEdge(1, 2);
    expect(BFS(graph, 0, 5)).toEqual({
      order: [0, 1, 3, 2],
      found: false
    });
  });
});
