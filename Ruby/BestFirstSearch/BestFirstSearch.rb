require 'bfsearch'

class BFsearchTest < Minitest::Unit::TestCase
  def test_smallest_tree
    tree = {
      name: :a,
      next: [
        {
          name: :b,
          next: [
            {
              name: :goal,
              next: []
            }
          ]
        },
        {
          name: :c,
          next: []
        }
      ]
    }

    distance = ->(n, m) { 1.0 }
    heuristic = ->(node) { 1.0 }
    neighbors = ->(node) { node[:next] }

    path = BFsearch.find_path(tree, tree[:next][0][:next][0],
                              distance, neighbors, heuristic)
    assert_equal 3, path.length
    assert_equal :goal, path[-1][:name]
  end

  def test_parallel_paths
    tree = {
      sb: {
        i: :sb,
        h: 222,
        n: { kl: 70, ka: 145 }
      },
      wu: {
        i: :wu,
        h: 0,
        n: {}
      },
      kl: {
        i: :kl,
        h: 158,
        n: { f: 103, lu: 53 }
      },
      hn: {
        i: :hn,
        h: 87,
        n: { wu: 102 }
      },
      ka: {
        i: :ka,
        h: 140,
        n: { hn: 84 }
      },
      f: {
        i: :f,
        h: 96,
        n: { wu: 116 }
      },
      lu: {
        i: :lu,
        h: 108,
        n: { wu: 183 }
      }
    }

    distance = ->(n, m) { n[:n][m[:i]] || 1000.0 }
    heuristic = ->(node) { node[:h] }
    neighbors = ->(node) { node[:n].keys.map { |k| tree[k] } }

    path = BFsearch.find_path(tree[:sb], tree[:wu],
                              distance, neighbors, heuristic)
    assert_equal 4, path.length
    assert_equal :sb, path[0][:i]
    assert_equal :kl, path[1][:i]
    assert_equal :f, path[2][:i]
    assert_equal :wu, path[3][:i]
  end

  def test_map
    map = "########" +
          "#    X #" +
          "#      #" +
          "#  ##  #" +
          "#   #  #" +
          "#      #" +
          "# S    #" +
          "########"
  end
end