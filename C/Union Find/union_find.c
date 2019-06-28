void initialize(int Arr[] , int n)    // Arr is the array and n is the size of data set
{
    for(int i=1;i<=n;i++)         // initializing the elements of array considering one indexing
        Arr[i]=i;
}

int root(int Arr[ ],int i)
{
    while(Arr[ i ] != i)           //chase parent of current element until it reaches root.
    {
     i = Arr[ i ];
    }
    return i;
}


bool union_find(int A,int B)     //the function to find whether a path exists between the given pair of vertice A and B or not.
{
    if( root(A)==root(B) )       //if A and B have same root,means they are connected.
    return true;
    else
    return false;
}
