
class ExtendedEuclidean {

    /** This functions gives solution (x, y) of equation
     * ax + by = gcd(a, b)
     */
    static int[] extendedGcd(int a, int b) {
        // base case
        if (b == 0)
        {
            return new int[]{1, 0} ;
        }

        // recursive call
        int[] arr = extendedGcd(b, a%b) ;

        // calculating values of x and y for current call
        int x = arr[1] ;
        int y = arr[0] - (a/b)*(arr[1]) ;

        return new int[]{x, y} ;

    }

    public static void main(String[] args)
    {
        int a = 5, b = 8 ;
        int[] sol = extendedGcd(a, b) ;
        System.out.println("x= "+sol[0]+", y = "+ sol[1]);
    }

}
