import Data.List

primes :: Int -> [Int]
primes n
    | n < 2     = []
    | otherwise = sieve [2..n]
        where
            sieve []     = []
            sieve [x]    = [x]
            sieve (x:xs) = x : sieve (xs \\ [x,x+x..n])

main = print $ primes 100

