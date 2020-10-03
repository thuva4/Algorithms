require "spec"
require "./heap_sort"

describe "heap_sort" do
  it "sorts" do
    heap_sort([4, 2, 8, 1, 30, 0, 10, 16]).should eq [0, 1, 2, 4, 8, 10, 16, 30]
  end
end
