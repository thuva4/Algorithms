# take two binary strings and returns the Hamming Distance between them
def hamming_distance(string1, string2)
  if string1.length != string2.length
    return "Strings must be the same length."
  else
    total = 0
    for i in 0...string1.length
      if string1[i] != string2[i]
        total += 1
      end
    end
    return total
  end
end
