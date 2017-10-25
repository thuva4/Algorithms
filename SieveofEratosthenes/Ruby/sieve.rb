def sieve(max)
  primes = (0..max).to_a
  primes[0] = primes[1] = nil
  
  counter = 0
  
  primes.each do |p|
    next unless p
    break if p*p > max

    counter += 1  
    (p*p).step(max,p) { |m| primes[m] = nil }
  end

  primes.compact
end
