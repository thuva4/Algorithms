/// Floyd-Warshall algorithm to find shortest paths between all pairs of vertices.
/// Input: distance matrix (2D vector).
/// Returns the shortest distance matrix.
fn floyd_warshall(matrix: &Vec<Vec<f64>>) -> Vec<Vec<f64>> {
    let n = matrix.len();
    let mut dist: Vec<Vec<f64>> = matrix.clone();

    for k in 0..n {
        for i in 0..n {
            for j in 0..n {
                if dist[i][k] != f64::INFINITY
                    && dist[k][j] != f64::INFINITY
                    && dist[i][k] + dist[k][j] < dist[i][j]
                {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    dist
}

fn main() {
    let inf = f64::INFINITY;
    let matrix = vec![
        vec![0.0, 3.0, inf, 7.0],
        vec![8.0, 0.0, 2.0, inf],
        vec![5.0, inf, 0.0, 1.0],
        vec![2.0, inf, inf, 0.0],
    ];

    let result = floyd_warshall(&matrix);

    println!("Shortest distance matrix:");
    for row in &result {
        let formatted: Vec<String> = row
            .iter()
            .map(|&v| {
                if v == inf {
                    "INF".to_string()
                } else {
                    format!("{}", v as i64)
                }
            })
            .collect();
        println!("{}", formatted.join("\t"));
    }
}
