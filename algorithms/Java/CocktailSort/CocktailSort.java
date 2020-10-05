/**
 *
 * This is a class containing two generic sorting methods utilizing the cocktail sort algorithm
 * One of which is accepting arrays, while the other accepts any list
 * Both methods accept any comparable object
 * 
*/

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


public class CocktailSort{

    public static void test(){
        /** Tests the list with a shuffled arraylist and array including numbers from 0 to 99 */
        ArrayList<Integer> testList = new ArrayList<>();

        for(int i = 0; i < 100; i++){
            testList.add(i);
        }

        Collections.shuffle(testList);

        Integer[] testArray = testList.toArray(new Integer[0]);

        sort(testList);
        sort(testArray);

        System.out.println(testList);
        for(int i = 0; i < testArray.length; i++){
            System.out.printf("%d ", testArray[i]);
        }
    }

    /** Sorts a list */

    public static <T extends Comparable<T>> void sort(List<T> toSort){

        int startIndex = -1; /** indicates the lower bound of the partly unsorted array */
        int endIndex = toSort.size() - 2; /** indicates the the upper bound of the partly unsorted array */
        boolean swapped = false; /** Flag whether two elements have been swapped */

        do{

            swapped = false;
            startIndex++;

            /** Left to right sorting */

            for(int i = startIndex; i <= endIndex; i++){
                if(toSort.get(i).compareTo(toSort.get(i + 1)) > 0){
                    Collections.swap(toSort, i, i + 1);
                    swapped = true;
                }
            }

            /** If no elements have been swapped while sorting from left to right, the list has been sorted */
            if(!swapped) break;

            swapped = false;

            /** Right to left sorting */

            endIndex--;

            for(int i = endIndex; i >= startIndex; i--) {
                if (toSort.get(i).compareTo(toSort.get(i + 1)) > 0) {
                    Collections.swap(toSort, i, i + 1);
                    swapped = true;
                }
            }

        } while(swapped);


    }

    /** Sorts an array */

    public static <T extends Comparable<T>> void sort(T[] toSort){
        sort(Arrays.asList(toSort));
    }
}