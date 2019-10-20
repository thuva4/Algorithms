public List<Node> GetShortestPathAstar()
{
    foreach (var node in Map.Nodes)
        node.StraightLineDistanceToEnd = node.StraightLineDistanceTo(End);
    AstarSearch();
    var shortestPath = new List<Node>();
    shortestPath.Add(End);
    BuildShortestPath(shortestPath, End);
    shortestPath.Reverse();
    return shortestPath;
}
private void AstarSearch()
{
    Start.MinCostToStart = 0;
    var prioQueue = new List<Node>();
    prioQueue.Add(Start);
    do {
        prioQueue = prioQueue.OrderBy(x => x.MinCostToStart + x.StraightLineDistanceToEnd).ToList();
        var node = prioQueue.First();
        prioQueue.Remove(node);
        NodeVisits++;
        foreach (var cnn in node.Connections.OrderBy(x => x.Cost))
        {
            var childNode = cnn.ConnectedNode;
            if (childNode.Visited)
                continue;
            if (childNode.MinCostToStart == null ||
                node.MinCostToStart + cnn.Cost < childNode.MinCostToStart)
            {
                childNode.MinCostToStart = node.MinCostToStart + cnn.Cost;
                childNode.NearestToStart = node;
                if (!prioQueue.Contains(childNode))
                    prioQueue.Add(childNode);
            }
        }
        node.Visited = true;
        if (node == End)
            return;
    } while (prioQueue.Any());
}
