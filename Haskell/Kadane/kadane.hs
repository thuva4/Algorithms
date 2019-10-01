main = print $ format $ kadane [-2, -3, 4, -1, -2, 1, 5, -3]

format :: Show a => (a, Int, Int) -> String
format (m,s,t) = "Max sum " ++ show m ++ " at " ++ show s ++ " to " ++ show t

kadane :: Num a => Ord a => [a] -> (a, Int, Int)
kadane xs = case foldl (\(cm, m, i, ls, s, t) x -> 
  let
    i' = i + 1    -- next index
    cm' = cm + x  -- maxsum with current
    neg = cm' < 0 -- caused negative
    exc = cm' > m -- caused new max
  in (
    if neg then 0 else cm',
    if exc then cm' else m,
    i',
    if neg then i' else ls,
    if exc then ls else s,
    if exc then i else t
  )) (0,0,0,0,0,-1) xs of
  (_,_,_,_,_,-1)  -> largest xs -- case of all negatives
  (_,m,_,_,s,t)   -> (m,s,t)    -- case some positives
-- m is c
-- i is current index
-- ls is last confirmed starting index
-- s is the current starting index
-- t is current ending index

largest :: Num a => Ord a => [a] -> (a, Int, Int)
largest xs = case foldl (\(m, i, s, t) x -> 
  let gm = x > m in (
    if gm then x else m,
    i + 1,
    if gm then i else s,
    if gm then i else t
  )) (0,0,0,-1) xs
  of
    (m,_,s,t) -> (m,s,t)