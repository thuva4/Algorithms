pub fn minimum_spanning_arborescence(arr: &[i32]) -> i32 {
    let mut n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut root = arr[2] as usize;
    let mut eu: Vec<usize> = Vec::new();
    let mut ev: Vec<usize> = Vec::new();
    let mut ew: Vec<i32> = Vec::new();
    for i in 0..m {
        eu.push(arr[3 + 3 * i] as usize);
        ev.push(arr[3 + 3 * i + 1] as usize);
        ew.push(arr[3 + 3 * i + 2]);
    }

    let inf = i32::MAX / 2;
    let mut res = 0i32;

    loop {
        let mut min_in = vec![inf; n];
        let mut min_edge = vec![0usize; n];

        for i in 0..eu.len() {
            if eu[i] != ev[i] && ev[i] != root && ew[i] < min_in[ev[i]] {
                min_in[ev[i]] = ew[i];
                min_edge[ev[i]] = eu[i];
            }
        }

        for i in 0..n {
            if i != root && min_in[i] == inf { return -1; }
        }

        let mut comp = vec![-1i32; n];
        comp[root] = root as i32;
        let mut num_cycles = 0i32;

        for i in 0..n {
            if i != root { res += min_in[i]; }
        }

        let mut visited = vec![-1i32; n];
        for i in 0..n {
            if i == root { continue; }
            let mut v = i;
            while visited[v] == -1 && comp[v] == -1 && v != root {
                visited[v] = i as i32;
                v = min_edge[v];
            }
            if v != root && comp[v] == -1 && visited[v] == i as i32 {
                let mut u = v;
                loop {
                    comp[u] = num_cycles;
                    u = min_edge[u];
                    if u == v { break; }
                }
                num_cycles += 1;
            }
        }

        if num_cycles == 0 { break; }

        for i in 0..n {
            if comp[i] == -1 {
                comp[i] = num_cycles;
                num_cycles += 1;
            }
        }

        let mut neu = Vec::new();
        let mut nev = Vec::new();
        let mut new_w = Vec::new();
        for i in 0..eu.len() {
            let nu = comp[eu[i]] as usize;
            let nv = comp[ev[i]] as usize;
            if nu != nv {
                neu.push(nu);
                nev.push(nv);
                new_w.push(ew[i] - min_in[ev[i]]);
            }
        }

        eu = neu; ev = nev; ew = new_w;
        root = comp[root] as usize;
        n = num_cycles as usize;
    }

    res
}
