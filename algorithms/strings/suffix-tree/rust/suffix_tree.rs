pub fn suffix_tree(arr: &[i32]) -> i32 {
    let n = arr.len();
    if n == 0 { return 0; }

    let mut sa: Vec<usize> = (0..n).collect();
    let mut rank: Vec<i64> = arr.iter().map(|&x| x as i64).collect();
    let mut tmp = vec![0i64; n];
    let mut k = 1;
    while k < n {
        let r = rank.clone();
        let step = k;
        sa.sort_by(|&a, &b| {
            let c = r[a].cmp(&r[b]);
            if c != std::cmp::Ordering::Equal { return c; }
            let ra = if a+step<n { r[a+step] } else { -1 };
            let rb = if b+step<n { r[b+step] } else { -1 };
            ra.cmp(&rb)
        });
        tmp[sa[0]] = 0;
        for i in 1..n {
            tmp[sa[i]] = tmp[sa[i-1]];
            let p0 = r[sa[i-1]]; let c0 = r[sa[i]];
            let p1 = if sa[i-1]+step<n { r[sa[i-1]+step] } else { -1 };
            let c1 = if sa[i]+step<n { r[sa[i]+step] } else { -1 };
            if p0 != c0 || p1 != c1 { tmp[sa[i]] += 1; }
        }
        rank = tmp.clone();
        if rank[sa[n-1]] == n as i64 - 1 { break; }
        k *= 2;
    }

    let mut inv_sa = vec![0usize; n];
    let mut lcp = vec![0i64; n];
    for i in 0..n { inv_sa[sa[i]] = i; }
    let mut h: usize = 0;
    for i in 0..n {
        if inv_sa[i] > 0 {
            let j = sa[inv_sa[i]-1];
            while i+h < n && j+h < n && arr[i+h] == arr[j+h] { h += 1; }
            lcp[inv_sa[i]] = h as i64;
            if h > 0 { h -= 1; }
        } else { h = 0; }
    }

    let total: i64 = n as i64 * (n as i64 + 1) / 2 - lcp.iter().sum::<i64>();
    total as i32
}
