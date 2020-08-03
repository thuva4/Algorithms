import qualified Data.Map as Map
import qualified Data.List as List (nub)

newtype Vertex = Vertex Int deriving(Eq, Show, Ord)

data Edge = Edge {
    source :: Vertex,
    target :: Vertex,
    weight :: Float
} deriving(Show)

newtype Graph = Graph [Edge] deriving(Show)

type Distances = Map.Map Vertex Float
type Predecessors = Map.Map Vertex Vertex
type Paths = (Distances, Predecessors)
type Error = String

fromList :: [(Int, Int, Float)] -> Graph
fromList = Graph . map edge
    where edge (s, t, w) = Edge { source = Vertex s, target = Vertex t, weight = w }

bellmanFord :: Graph -> Vertex -> Either Error Paths
bellmanFord (Graph edges) start = foldr check (Right paths) edges
    where
        vertices = List.nub $ foldr (\Edge{source=a,target=b} acc -> a:b:acc) [] edges
        update Edge{source=u, target=v, weight=w} (dist, pred)
            | Map.notMember u dist = (dist, pred)
            | Map.notMember v dist = (alter v (dist Map.! u + w) dist, alter v u pred)
            | dist Map.! u + w < dist Map.! v = (alter v (dist Map.! u + w) dist, alter v u pred)
            | otherwise = (dist, pred)
            where alter k v = Map.alter (\_ -> Just v) k
        paths = foldr (\_ acc -> foldr update acc edges) (Map.fromList [(start, 0.0)], Map.empty) (tail vertices)
        check _ (Left error) = Left error
        check Edge{source=u, target=v, weight=w} (Right (dist, pred))
            | Map.notMember u dist = Right (dist, pred)
            | Map.notMember v dist = Right (dist, pred)
            | dist Map.! u + w < dist Map.! v = Left "Graph contains a negative-weight cycle"
            | otherwise = Right (dist, pred)

main = do
    print $ bellmanFord ok (Vertex 0)
    print $ bellmanFord ok (Vertex 1)
    print $ bellmanFord ok (Vertex 3)
    print $ bellmanFord err (Vertex 0)
        where ok = fromList [(0, 1, 2.0),
                             (0, 2, 0.1),
                             (1, 3, 0.2),
                             (2, 1, 0.4),
                             (2, 3, 4.0)]
              err = fromList [(0, 1, -1.0),
                              (1, 0, 0.5),
                              (0, 2, 1.0)]

