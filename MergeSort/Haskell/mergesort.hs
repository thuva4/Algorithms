merge :: [Int] -> [Int] -> [Int]
merge x [] = x
merge [] y = y
merge (x:xs) (y:ys) = if(x<y) then x:(merge xs (y:ys)) else y:(merge (x:xs) ys)

half :: [Int] -> ([Int],[Int])
half l = splitAt (div ((length l) + 1) 2) l

mergesort :: [Int] -> [Int]
mergesort [] = []
mergesort [x] = [x]
mergesort l = let (l1,l2) = half l in
    merge (mergesort l1) (mergesort l2)

main = print (mergesort [18, 21, 3, 54, 21, 22, 4, 32, 17, 28, 2, 31, 74, 30])
