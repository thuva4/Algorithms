# GCD function
def gcd(a, b)
    if a % b == 0
        b
    else
        gcd(b, a%b)
    end
end

# Reading input
a, b = gets.split.map(&:to_i)
p gcd(a,b)
