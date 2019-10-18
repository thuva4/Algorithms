function Factorial(Num)
    local Value = 1
    for i = 1, Num do
        Value = Value * i
    end
    return Value
end

Factorial(6) -- 720
