def xor_swap(x, y)
  p "Before Swap: X = #{x}, Y = #{y}"

  x = x ^ y
  y = x ^ y
  x = x ^ y

  p "After Swap: X = #{x}, Y = #{y}"
end

xor_swap(10, 15)