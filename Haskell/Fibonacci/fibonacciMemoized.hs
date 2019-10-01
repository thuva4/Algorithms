
fib :: Int -> Int
fib n = fibs !! n
  where fibs = 0 : 1 : zipWith(+) fibs (tail fibs)

main = print $ map (fib) [1..10]