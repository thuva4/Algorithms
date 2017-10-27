fn bin_search<T : PartialOrd>(array : &[T], item : &T)  -> Option<usize>  {
    let mut lowi=0;
    let mut highi=array.len();
    loop {
        if lowi>=highi {
            return None;
        }
        let mi=lowi+(highi-lowi)/2;
        if array[mi].lt(item) {
            lowi=mi+1;
        } else if array[mi].gt(item) {
            highi=mi;
        } else {
            return Some(mi);
        }
    }
}

fn main() {
    let array = [1, 2, 3, 4, 5, 10, 20, 50];
    let item = 10;
    let index = bin_search(&array, &item);
    
    if(index == None) {
        println!("Item not found");
    }
    else {
        println!("Item found at {}", index.unwrap());
    }
}
