pub fn suffix_array(arr: &[i32]) -> Vec<i32> {
    let n = arr.len();
    if n == 0 {
        return vec![];
    }
    let mut sa: Vec<usize> = (0..n).collect();
    let mut rank: Vec<i64> = arr.iter().map(|&x| x as i64).collect();
    let mut tmp = vec![0i64; n];
    let mut k = 1;
    while k < n {
        let r = rank.clone();
        let step = k;
        sa.sort_by(|&a, &b| {
            let cmp1 = r[a].cmp(&r[b]);
            if cmp1 != std::cmp::Ordering::Equal {
                return cmp1;
            }
            let ra = if a + step < n { r[a + step] } else { -1 };
            let rb = if b + step < n { r[b + step] } else { -1 };
            ra.cmp(&rb)
        });
        tmp[sa[0]] = 0;
        for i in 1..n {
            tmp[sa[i]] = tmp[sa[i - 1]];
            let p0 = r[sa[i - 1]];
            let c0 = r[sa[i]];
            let p1 = if sa[i - 1] + step < n { r[sa[i - 1] + step] } else { -1 };
            let c1 = if sa[i] + step < n { r[sa[i] + step] } else { -1 };
            if p0 != c0 || p1 != c1 {
                tmp[sa[i]] += 1;
            }
        }
        rank = tmp.clone();
        if rank[sa[n - 1]] == (n as i64 - 1) {
            break;
        }
        k *= 2;
    }
    sa.iter().map(|&x| x as i32).collect()
}
