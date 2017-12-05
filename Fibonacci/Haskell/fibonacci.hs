-- naive version, works but has a terrible execute time of 2**n
fibo_rec_naive :: Int -> Int
fibo_rec_naive 0 = 0
fibo_rec_naive 1 = 1
fibo_rec_naive n = fibo_rec_naive (n-2) + fibo_rec_naive(n-1)

-- algorithm with terminal recursivity, with execute time of n. Way better !
fibo_rec_terminal :: Int -> Int -> Int -> Int
fibo_rec_terminal 0 a _ = a
fibo_rec_terminal n a b = fibo_rec_terminal (n-1) b (a+b)

main = do 
    let res1 = fibo_rec_naive 9 
    let res2 = fibo_rec_terminal 9 0 1
    print(show(res1) ++ " " ++ show(res2))
