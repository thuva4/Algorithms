pub struct Solution;

impl Solution {
    pub fn sort_array(nums: Vec<i32>) -> Vec<i32> {
        let mut nums = nums;
        if nums.len() > 1 {
            let mid = nums.len() / 2;
            let right = nums.split_off(mid);
            let sorted_l = Self::sort_array(nums);
            let sorted_r = Self::sort_array(right);

            let mut res = Vec::with_capacity(sorted_l.len() + sorted_r.len());
            let (mut i, mut j) = (0, 0);

            while i < sorted_l.len() && j < sorted_r.len() {
                if sorted_l[i] <= sorted_r[j] {
                    res.push(sorted_l[i]);
                    i += 1;
                } else {
                    res.push(sorted_r[j]);
                    j += 1;
                }
            }
            res.extend_from_slice(&sorted_l[i..]);
            res.extend_from_slice(&sorted_r[j..]);
            res
        } else {
            nums
        }
    }
}

fn main() {
    // Test with integers
    let numbers = vec![64, 34, 25, 12, 22, 11, 90];
    println!("Original array: {:?}", numbers);
    let sorted_numbers = Solution::sort_array(numbers);
    println!("Sorted array: {:?}", sorted_numbers);

    // Test with empty array
    let empty: Vec<i32> = vec![];
    println!("\nOriginal array: {:?}", empty);
    let sorted_empty = Solution::sort_array(empty);
    println!("Sorted array: {:?}", sorted_empty);

    // Test with single element
    let single = vec![42];
    println!("\nOriginal array: {:?}", single);
    let sorted_single = Solution::sort_array(single);
    println!("Sorted array: {:?}", sorted_single);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sort_array_integers() {
        let arr = vec![64, 34, 25, 12, 22, 11, 90];
        assert_eq!(Solution::sort_array(arr), vec![11, 12, 22, 25, 34, 64, 90]);
    }

    #[test]
    fn test_sort_array_already_sorted() {
        let arr = vec![1, 2, 3, 4, 5];
        assert_eq!(Solution::sort_array(arr), vec![1, 2, 3, 4, 5]);
    }

    #[test]
    fn test_sort_array_reverse_sorted() {
        let arr = vec![5, 4, 3, 2, 1];
        assert_eq!(Solution::sort_array(arr), vec![1, 2, 3, 4, 5]);
    }

    #[test]
    fn test_sort_array_empty() {
        let arr: Vec<i32> = vec![];
        assert_eq!(Solution::sort_array(arr), vec![]);
    }

    #[test]
    fn test_sort_array_single_element() {
        let arr = vec![42];
        assert_eq!(Solution::sort_array(arr), vec![42]);
    }
}
