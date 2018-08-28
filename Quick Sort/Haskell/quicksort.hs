partition :: Int -> [Int] -> ([Int], [Int])
partition _ [] = ([], [])
partition p (t:q)
    |t < p = let
            (a, b) = partition p q
        in
            (t:a, b)
    |otherwise = let
            (a, b) = partition p q
        in
            (a, t:b)

quicksort :: [Int] -> [Int]
quicksort [] = []
quicksort (t:q) = let 
        (a, b) = partition t q
    in
        (quicksort a) ++ (t:quicksort b)

main = print(quicksort [18, 21, 3, 54, 21, 22, 4, 32, 17, 28, 2, 31, 74, 30])
