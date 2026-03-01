const {GraphFactory, dfs} = require('../index');

describe('dfs', () => {
  let graph = null;

  beforeEach(() => {
    graph = GraphFactory.getGraph();
  });

  it('should throw error on bad graph', () => {
    expect(() => {
      dfs({});
    }).toThrow('Graph should implement a getNeighbors function');
  });

  it('should throw error on no source vertex', () => {
    expect(() => {
      dfs(graph);
    }).toThrow('source should be a number');
  });

  it('simple bi-directional graph where target is reachable', () => {
    graph.addEdge(0, 1);
    graph.addEdge(0, 3);
    graph.addEdge(1, 2);
    expect(dfs(graph, 0, 3)).toEqual({
      order: [0, 3, 1, 2],
      found: true,
    });
  });

  it('complex bi-directional graph where target is reachable', () => {
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 3);
    graph.addEdge(3, 4);
    graph.addEdge(4, 2);
    expect(dfs(graph, 0, 3)).toEqual({
      order: [0, 2, 4, 3, 1],
      found: true,
    });
  });

  it('complex uni-directional graph where target is reachable', () => {
    graph.addEdge(0, 1, false);
    graph.addEdge(0, 2, false);
    graph.addEdge(1, 3, false);
    graph.addEdge(3, 4, false);
    graph.addEdge(4, 2, false);
    expect(dfs(graph, 0, 3)).toEqual({
      order: [0, 2, 1, 3, 4],
      found: true,
    });
  });

  it('simple bi-directional graph where target is not present', () => {
    graph.addEdge(0, 1);
    graph.addEdge(0, 3);
    graph.addEdge(1, 2);
    expect(dfs(graph, 0, 5)).toEqual({
      order: [0, 3, 1, 2],
      found: false,
    });
  });
});
