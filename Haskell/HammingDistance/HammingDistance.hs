
hamming :: String -> String -> Maybe Int
hamming xs ys
  | length xs /= length ys = Nothing
  | otherwise = Just . length . (filter id) $ zipWith (/=) xs ys

main = do
  print $ hamming "hello world" "hello world"
  print $ hamming "Hallo Welt!" "Hello World"
  print $ hamming "Hello World" "Goodbye"
