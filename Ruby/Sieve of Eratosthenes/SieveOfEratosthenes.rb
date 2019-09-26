def sieve(n)
  is_prime = []
  (2..n).each do |i|
    is_prime[i] = true
  end
  i = 2
  while i <= Math.sqrt(n) do
    j = i*2
    while j <= n do
      is_prime[j] = false
      j += i
    end
    i += 1
  end
  idx = 2
  is_prime.reduce([]) do |memo|
    if is_prime[idx]
      memo.push(idx)
    end
    idx += 1
    memo
  end
end
