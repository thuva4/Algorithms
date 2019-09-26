main = print $ bubbleSort [18, 21, 3, 54, 21, 22, 4, 32, 17, 28, 2, 31, 74, 30];

bubbleSort :: Ord a => [a] -> [a]
bubbleSort xs = if again then bubbleSort xs' else xs'
  where (xs', again) = onePass xs

onePass :: Ord a => [a] -> ([a], Bool)
onePass (a:b:xs) = (a':xs', flag')
  where
    a' = min a b
    b' = max a b
    (xs',flag) = onePass (b':xs)
    flag' = if a > b then True else flag
onePass xs = (xs, False)