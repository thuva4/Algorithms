#!/usr/bin/env ruby
def mul(a,b)
	r=a.size.times.map{[0]*b[0].size}
	a.size.times{|y|
		b[0].size.times{|x|
			r[y][x]=b.size.times.reduce(0){|s,i|(s+a[y][i]*b[i][x])}
		}
	}
	r
end
def fib(k)
	x=[[1,1],[1,0]]
	e=[[1,0],[0,1]]
	while k>0
		e=mul(e,x) if k%2>0
		x=mul(x,x)
		k/=2
	end
	e[0][1]
end
if $0==__FILE__
	p fib gets.to_i
end
