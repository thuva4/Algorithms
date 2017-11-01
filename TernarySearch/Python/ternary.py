def ternary_search (L, key):
   left = 0
   right = len(L) - 1
   while left <= right:
      ind1 = left
      ind2 = left + (right - left) // 3
      ind3 = left + 2 * (right - left) // 3
      if key == L[left]:
         print("Key found at:" + str(left))
         return
      elif key == L[right]:
         print("Key found at:", str(right))
         return
      elif key < L[left] or key > L[right]:
         print("Unable to find key")
         return
      elif key <= L[ind2]:
         right = ind2
      elif key > L[ind2] and key <= L[ind3]:
         left = ind2 + 1
         right = ind3
      else:
         left = ind3 + 1
   return
