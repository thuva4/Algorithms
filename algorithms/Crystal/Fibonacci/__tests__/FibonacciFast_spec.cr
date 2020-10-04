require "spec"
require "../FibonacciFast"

describe "FibonacciFast" do
	it "fib(1)" do
		fib(1).should eq 1
	end
	it "fib(2)" do
		fib(2).should eq 1
	end
	it "fib(3)" do
		fib(3).should eq 2
	end
	it "fib(70)" do
		fib(70).should eq 190392490709135
	end
	#it "fib(100)" do
	#	# not possible to make 128bit literal: https://github.com/crystal-lang/crystal/pull/5545
	#	fib(100).should eq 354224848179261915075_i128
	#end
end
