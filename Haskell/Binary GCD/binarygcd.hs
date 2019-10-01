
gcd :: Int -> Int -> Int
gcd u v
  | u == v = u
  | u == 0 = v
  | v == 0 = u
  | otherwise = case (even u, even v) of
      (True, True)   -> 2 * Main.gcd (div u 2) (div v 2)
      (True, False)  -> Main.gcd (div u 2) v
      (False, True)  -> Main.gcd u (div v 2)
      (False, False) -> if u < v
        then Main.gcd (div (v - u) 2) u
        else Main.gcd (div (u - v) 2) v

main = do
  print $ Main.gcd 10 5
  print $ Main.gcd 5 10
  print $ Main.gcd 10 8
  print $ Main.gcd 8 10
  print $ Main.gcd 7000 2000
  print $ Main.gcd 2000 7000
  print $ Main.gcd 10 11
  print $ Main.gcd 11 7
  print $ Main.gcd 239 293

