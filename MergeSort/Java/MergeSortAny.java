import java.lang.reflect.Array;
import java.util.ArrayList;

/**
 * @author Casper Rysgaard
 */
public class MergeSortAny<T extends MaxValue<T> & Comparable<T>>
{
    /*
     * java class used for sorting any type of list
     */

    public static <T extends MaxValue<T> & Comparable<T>> void sort(ArrayList<T> arrayList)
    {
        mergeSortSplit(arrayList, 0, arrayList.size()-1);
    }

    private static <T extends MaxValue<T> & Comparable<T>> void mergeSortSplit(ArrayList<T> listToSort, int start, int end)
    {
        if (start < end)
        {
            int middle = (start + end) / 2;
            mergeSortSplit(listToSort, start, middle);
            mergeSortSplit(listToSort, middle+1, end);
            merge(listToSort, start, middle, end);
        }
    }

    private static <T extends MaxValue<T> & Comparable<T>> void merge(ArrayList<T> listToSort, int start, int middle, int end)
    {
        ArrayList<T> A = new ArrayList<T>(listToSort.subList(start, middle+1));
        ArrayList<T> B = new ArrayList<T>(listToSort.subList(middle+1, end+1));
        A.add(A.get(0).getMaxObject());
        B.add(B.get(0).getMaxObject());

        int i = 0;
        int j = 0;

        for (int k = start; k <= end; k++)
        {
            if (A.get(i).compareTo(B.get(j)) <= 0)
            {
                listToSort.set(k, A.get(i));
                i++;
            }
            else
            {
                listToSort.set(k, B.get(j));
                j++;
            }
        }
    }


    public static <T extends MaxValue<T> & Comparable<T>> void sort(T[] array)
    {
        mergeSortSplitArray(array, 0, array.length-1);
    }

    private static <T extends MaxValue<T> & Comparable<T>> void mergeSortSplitArray(T[] listToSort, int start, int end)
    {
        if (start < end)
        {
            int middle = (start + end) / 2;
            mergeSortSplitArray(listToSort, start, middle);
            mergeSortSplitArray(listToSort, middle+1, end);
            mergeArray(listToSort, start, middle, end);
        }
    }

    private static <T extends MaxValue<T> & Comparable<T>> void mergeArray(T[] listToSort, int start, int middle, int end)
    {
        T[] A = (T[]) Array.newInstance(listToSort[0].getClass(),middle-start +2);
        T[] B = (T[]) Array.newInstance(listToSort[0].getClass(),end - middle +1);
        cloneArray(listToSort, A, start);
        cloneArray(listToSort, B, middle+1);

        int i = 0;
        int j = 0;

        for (int k = start; k <= end; k++)
        {
            if (A[i].compareTo(B[j]) <= 0)
            {
                listToSort[k] = A[i];
                i++;
            }
            else
            {
                listToSort[k] = B[j];
                j++;
            }
        }
    }

    private static <T extends MaxValue<T> & Comparable<T>> void cloneArray(T[] listIn, T[] cloneInto, int start)
    {
        for (int i = start; i < start+cloneInto.length-1; i++)
        {
            cloneInto[i - start] = listIn[i];
        }

        cloneInto[cloneInto.length-1] = listIn[0].getMaxObject();
    }
}
