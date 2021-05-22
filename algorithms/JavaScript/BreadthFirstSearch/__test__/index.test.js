const {GraphFactory, BFS} = require('../index');

describe("BreadthFirstSearch", () => {
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
