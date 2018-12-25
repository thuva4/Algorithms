// 'low' is the lower index
// 'high' is the upper index
// 'key' is the element to be searched
int Ternary_search(inr ar[] , int low , int high , int key)     //A recursive implementation of Ternary Search
{
    if(high>=low)
    {
        int mid1 = low + (high - low)/3;
        int mid2 = high -  (high -low )/3;
        
        if(ar[mid1] == x)
            return mid1;     // returning mid1 if key is found at mid1 position
        if(ar[mid2] == x)
            return mid2;     // returning mid1 if key is found at mid1 position
        
        if(key > ar[mid2])
            return Ternarysearch(mid2+1,r,x);   //if key element is in the right potion
        
        else if(key < ar[mid1])
            return Ternarysearch(l,mid1-1,x);   //if key element is in the left potion
        
        else
            return Ternarysearch(mid1+1,mid2-1,x);    //if key element is in the middle potion

    }
    return -1;  //return -1 if the key element is not found.
}
