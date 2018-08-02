class Dfs:
	def __init__(self, graph, nodes):
		self.graph = graph
		self.nodes = nodes
		self.visited = [False for i in range(nodes)]

	def dfs(self):
		for node in range(self.nodes):
			if not self.visited[node]:
				self.visited[node] = True
				self.visit(node)

	def visit(self, node):
		print node

		for neighbour in graph[node]:
			if not self.visited[neighbour]:
				self.visited[neighbour] = True
				self.visit(neighbour)

# graph = [[1,3], [2], [], [2], [7], [6,7], [7], [], []]
# nodes = 9
# makeDFS = Dfs(graph, nodes)
# makeDFS.dfs()