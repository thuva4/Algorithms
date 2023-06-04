bubbleSort :: Ord a => [a] -> [a]
bubbleSort list = go list []
  where
    go [] sorted = sorted
    go (x:xs) (y:ys)
      | x > y = (x:ys) : go xs sorted
      | otherwise = (y:xs) : go (x:ys) sorted
