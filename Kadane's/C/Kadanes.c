
long long int inf=-999999999999;
long long int KadaneAlgo(long long int ar[] ,long long int size)
{
    long long int maximum=-inf;     //maximum contiguous sum of all the segments of array
    long long int max_of_present_segment=0;      //maximum contiguous sum of current segment
    for (long long int i = 0; i < size; i++)
    {
        max_of_present_segment = max_of_present_segment +ar[i];
        if(maximum < max_of_present_segment)
        {
            maximum = max_of_present_segment;       //storing the maximum segment sum till now
        }
        if(max_of_present_segment < 0)
        {
            max_of_present_segment=0;     //setting the current segment sum as 0 if it is negative
        }
    }
    return maximum;
}
