
sieve :: [Int]
sieve = s [2..]
  where s (x:xs) = x:(s $ filter (\y -> mod y x /= 0) xs)

main = print $ take 20 sieve