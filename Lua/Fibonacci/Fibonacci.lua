function Fibonacci(Num)
    local Num1 = 0
    local Num2 = 1

    for i = 2, Num do
        Num1, Num2 = Num2, Num1 + Num2
    end

    return Num2
end

Fibonacci(8) -- 21
