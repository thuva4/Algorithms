import qualified System.Random as Rnd

data Group a = Group {
  gen :: a,
  op :: a -> Integer -> a
}

sharedSecret :: Group a -> Integer -> a -> a
sharedSecret group secret other = op group other secret

publicKey :: Group a -> Integer -> a
publicKey group = op group (gen group)

-- Examples

-- Additive Group of Integeres Modulo n
add = Group {
  gen = 5,
  op = \a n -> mod (a * n) 23
}

-- Multiplicative Group of Integeres Modulo n
mult = Group {
  gen = 5,
  op = \a n -> mod (a ^ n) 23
}

keyAgreement :: Group Integer -> IO ()
keyAgreement group = do
  -- Alice
  aliceSecret <- Rnd.randomRIO (1, 22 :: Integer)
  let alicePublic = publicKey group aliceSecret
  putStrLn $ "  Alice: Secret = " ++ show aliceSecret
  putStrLn $ "  Alice: " ++ show alicePublic ++ " -> Bob"

  -- Bob
  bobSecret <- Rnd.randomRIO (1, 22 :: Integer)
  let bobPublic = publicKey group bobSecret
  putStrLn $ "  Bob: Secret = " ++ show bobSecret
  putStrLn $ "  Bob: Shared = " ++ show (sharedSecret group bobSecret alicePublic)
  putStrLn $ "  Bob: " ++ show bobPublic ++ " -> Alice"

  -- Alice
  putStrLn $ "  Alice: Shared = " ++ show (sharedSecret group aliceSecret bobPublic)

main = do
  putStrLn "Additive Group of Integeres Modulo n"
  keyAgreement add
  putStrLn "Multiplicative Group of Integeres Modulo n"
  keyAgreement mult
