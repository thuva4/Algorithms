#!/usr/bin/env crystal
def mul(a,b)
	r=a.size.times.map{[0_i128]*b[0].size}.to_a
	a.size.times{|y|
		b[0].size.times{|x|
			r[y][x]=b.size.times.reduce(0_i128){|s,i|(s+a[y][i]*b[i][x])}
		}
	}
	r
end
def fib(k)
	x=[[1_i128,1_i128],[1_i128,0_i128]]
	e=[[1_i128,0_i128],[0_i128,1_i128]]
	while k>0
		e=mul(e,x) if k%2>0
		x=mul(x,x)
		k//=2
	end
	e[0][1]
end
p fib gets.not_nil!.to_i
