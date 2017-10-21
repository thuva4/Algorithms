/**
 * An implementation of the Timsort sorting algorithm.
 *
 * This implementation is not as highly tuned for performance as is possible.
 * Instead, it is simplified somewhat, though still keeping the core mechanics
 * of the algorithm in place.
 */
public class TimSort {
    /**
     * The absolute minimum length of a sequence. No minrun shall be shorter
     * than this.
     */
    private final int MIN_SEQUENCE_SIZE = 32;
    
    /**
     * Controls when the algorithm leaves galloping mode - it leaves if both
     * runs win less often than {@code MAX_GALLOP_EXIT} consecutive times.
     */
    private final int MAX_GALLOP_EXIT = 7;
    
    /**
     * Controls when the algorithm enters galloping mode. Initially set to
     * MAX_GALLOP_EXIT, but is varied depending on the randomness of the data
     * (lower if more random, higher if more structured).
     */
    private int minGallopEntry;
    
    /**
     * The array being sorted.
     */
    private int[] array;
    
    /**
     * The following three variables make up a stack which contains information
     * about runs in {@code array}. This stack can be accessed from places
     * other than the top.
     */
    private int runStackSize;
    private int[] runStackStarts;
    private int[] runStackLengths;
    
    public void sort(int[] inputArray) {
        // Initialize sort
        array = inputArray;
        
        runStackSize = 0;
        runStackStarts = new int[findStackCapacity(array.length)];
        runStackLengths = new int[findStackCapacity(array.length)];
        
        int lowIndex = 0;
        int highIndex = array.length;
        
        // If array isn't long enough, fall back to insertion sort
        if (array.length < MIN_SEQUENCE_SIZE) {
            int runLength = findLengthOfRun(lowIndex, highIndex);
            insertionSort(lowIndex, lowIndex + runLength, highIndex);
            return;
        }
        
        // Else, do regular Timsort
        int remainingIndices = highIndex - lowIndex;
        int minRun = findMinRun(array.length);
        
        do {
            int runLength = findLengthOfRun(lowIndex, highIndex);
            
            // If run isn't long enough, make it longer
            if (runLength < minRun) {
                int forceLength = Math.min(remainingIndices, minRun);
                insertionSort(lowIndex, lowIndex + runLength,
                    lowIndex + forceLength);
                runLength = forceLength;
            }
            
            // Push run onto stack, merge if necessary
            pushRun(lowIndex, runLength);
            mergeRunsToMaintainInvariants();
            
            // Advance to next run
            lowIndex += runLength;
            remainingIndices -= runLength;
        } while (remainingIndices != 0);
        
        mergeAllRuns();
    }
    
    /**
     * Finds the minimum acceptable run length (minrun) for an array of the
     * specified length.
     */
    private int findMinRun(int length) {
        boolean anyOtherBits = false;
        
        while (length >= MIN_SEQUENCE_SIZE) {
            if ((length & 1) == 1) // If any "1" bits would be pushed off...
                anyOtherBits = true;
            
            length >>= 1;
        }
        
        return length + (anyOtherBits ? 1 : 0);
    }
    
    /**
     * Pushes a run onto the run stack.
     */
    private void pushRun(int start, int length) {
        runStackStarts[runStackSize] = start;
        runStackLengths[runStackSize] = length;
        runStackSize++;
    }
    
    /**
     * Merges runs on the run stack until the following invariants are
     * re-established, for the top three runs on the run stack X, Y and Z:
     *      |Z| > |Y| + |X|
     *      |Y| > |X|
     */
    private void mergeRunsToMaintainInvariants() {
        while (runStackSize > 1) {
            int n = runStackSize - 2;
            
            if (n > 0 && runStackLengths[n - 1] <=
                runStackLengths[n] + runStackLengths[n + 1]) {
                // |Z| > |Y| + |X| violated
                
                if (runStackLengths[n - 1] < runStackLengths[n + 1])
                    n--;
                
                mergeRunsAt(n);
            } else if (runStackLengths[n] <= runStackLengths[n + 1]) {
                // |Y| > |X| violated
                mergeRunsAt(n);
            } else {
                // Invariants are established
                break;
            }
        }
    }
    
    /**
     * Merges all runs on the run stack into one run. This finalizes the sort.
     */
    private void mergeAllRuns() {
        while (runStackSize > 1) {
            int n = runStackSize - 2;
            
            if (n > 0 && runStackLengths[n - 1] < runStackLengths[n + 1])
                n--;
            
            mergeRunsAt(n);
        }
    }
    
    /**
     * Merges the run at the specified index of the stack with the run above it.
     */
    private void mergeRunsAt(int index) {
        int start1 = runStackStarts[index];
        int length1 = runStackLengths[index];
        int start2 = runStackStarts[index + 1];
        int length2 = runStackLengths[index + 1];
        
        // Record length of combined runs
        runStackLengths[index] = length1 + length2;
        
        if (index == runStackSize - 3) {
            runStackStarts[index + 1] = runStackStarts[index + 2];
            runStackLengths[index + 1] = runStackLengths[index + 2];
        }
        
        runStackSize--;
        
        // Where does the first element of run 2 go in run 1?
        // Ignore prior elements in run 1, they're already in place
        int k = gallopRight(array[start2], array, start1, length1, 0);
        start1 += k;
        length1 -= k;
        
        if (length1 == 0)
            return;
        
        // Where does the last element of run 2 go in run 1? (ignore subsequent)
        length2 = gallopLeft(array[start1 + length1 - 1], array, start2,
            length2, length2 - 1);
        
        if (length2 == 0)
            return;
        
        if (length1 <= length2)
            mergeLow(start1, length1, start2, length2);
        else
            mergeHigh(start1, length1, start2, length2);
    }
    
    /**
     * Merges two adjacent runs, in place and in a stable fashion.
     *
     * Performs optimally when length1 < length2. Otherwise, use mergeHigh. If
     * length1 = length2, either method will suffice.
     */
    private void mergeLow(int start1, int length1, int start2, int length2) {
        // Copy first run into temporary array
        int[] tempArray = new int[length1];
        System.arraycopy(array, start1, tempArray, 0, length1);
        
        int cursor1 = 0;
        int cursor2 = start2;
        int destination = start1;
        
        array[destination++] = array[cursor2++];
        
        if (--length2 == 0) {
            System.arraycopy(tempArray, cursor1, array, destination, length1);
            return;
        }
        
        if (length1 == 1) {
            System.arraycopy(array, cursor2, array, destination, length2);
            array[destination + length2] = tempArray[cursor1];
            return;
        }
        
        // A break outerLoop statement will break out of this entire loop
    outerLoop:
        while (true) {
            int consecutiveWins1 = 0;
            int consecutiveWins2 = 0;
            
            // Merge the straightforward way (no runs consistently winning yet)
            do {
                if (array[cursor2] < tempArray[cursor1]) {
                    array[destination++] = array[cursor2++];
                    consecutiveWins2++;
                    consecutiveWins1 = 0;
                    
                    if (--length2 == 0)
                        break outerLoop;
                } else {
                    array[destination++] = tempArray[cursor1++];
                    consecutiveWins1++;
                    consecutiveWins2 = 0;
                    
                    if (--length1 == 0)
                        break outerLoop;
                }
            } while ((consecutiveWins1 | consecutiveWins2) < minGallopEntry);
            
            // If the algo gets here, one run is winning consistently enough
            // that galloping may be faster. Gallop until neither run wins
            // consistently
            do {
                consecutiveWins1 = gallopRight(array[cursor2], tempArray,
                    cursor1, length1, 0);
                
                if (consecutiveWins1 != 0) {
                    System.arraycopy(tempArray, cursor1, array, destination,
                        consecutiveWins1);
                    
                    destination += consecutiveWins1;
                    cursor1 += consecutiveWins1;
                    length1 -= consecutiveWins1;
                    
                    if (length1 <= 1)
                        break outerLoop;
                }
                
                array[destination++] = array[cursor2++];
                
                if (--length2 == 0)
                    break outerLoop;
                
                consecutiveWins2 = gallopLeft(tempArray[cursor1], array,
                    cursor2, length2, 0);
                
                if (consecutiveWins2 != 0) {
                    System.arraycopy(array, cursor2, array, destination,
                        consecutiveWins2);
                    
                    destination += consecutiveWins2;
                    cursor2 += consecutiveWins2;
                    length2 -= consecutiveWins2;
                    
                    if (length2 == 0)
                        break outerLoop;
                }
                
                array[destination++] = tempArray[cursor1++];
                
                if (--length1 == 1)
                    break outerLoop;
                
                // Gallop mode working so far, so make it easier to enter
                minGallopEntry--;
            } while (consecutiveWins1 >= MAX_GALLOP_EXIT |
                     consecutiveWins2 >= MAX_GALLOP_EXIT);
            
            if (minGallopEntry < 0)
                minGallopEntry = 0;
            
            // Gallop mode not working so great now, so make it harder to enter
            minGallopEntry += 2;
        }
        
        if (minGallopEntry < 1)
            minGallopEntry = 1;
        
        if (length1 == 1) {
            System.arraycopy(array, cursor2, array, destination, length2);
            array[destination + length2] = tempArray[cursor1];
        } else {
            System.arraycopy(tempArray, cursor1, array, destination, length1);
        }
    }
    
    /**
     * Merges two adjacent runs, in place and in a stable fashion.
     *
     * Performs optimally when length1 < length2. Otherwise, use mergeHigh. If
     * length1 = length2, either method will suffice.
     */
    private void mergeHigh(int start1, int length1, int start2, int length2) {
        int[] tempArray = new int[length2];
        System.arraycopy(array, start2, tempArray, 0, length2);
        
        int cursor1 = start1 + length1 - 1;
        int cursor2 = length2 - 1;
        int destination = start2 + length2 - 1;
        
        array[destination--] = array[cursor1--];
        
        if (--length1 == 0) {
            System.arraycopy(tempArray, 0, array, destination - length2 - 1,
                length2);
            return;
        }
        
        if (length2 == 1) {
            destination -= length1;
            cursor1 -= length1;
            System.arraycopy(array, cursor1 + 1, array, destination + 1,
                length1);
            array[destination] = tempArray[cursor2];
            return;
        }
        
        // A break outerLoop statement will break out of this entire loop
    outerLoop:
        while (true) {
            int consecutiveWins1 = 0;
            int consecutiveWins2 = 0;
            
            // Merge the straightforward way (no runs winning consistently yet)
            do {
                if (tempArray[cursor2] < array[cursor1]) {
                    array[destination--] = array[cursor1--];
                    consecutiveWins1++;
                    consecutiveWins2 = 0;
                    
                    if (--length1 == 0)
                        break outerLoop;
                } else {
                    array[destination--] = tempArray[cursor2--];
                    consecutiveWins2++;
                    consecutiveWins1 = 0;
                    
                    if (--length2 == 1)
                        break outerLoop;
                }
            } while ((consecutiveWins1 | consecutiveWins2) < minGallopEntry);
            
            // If the algo gets here, one run is winning consistently enough
            // that galloping may be faster. Gallop until neither run wins
            // consistently
            do {
                consecutiveWins1 = length1 - gallopRight(tempArray[cursor2],
                    array, start1, length1, length1 - 1);
                
                if (consecutiveWins1 != 0) {
                    destination -= consecutiveWins1;
                    cursor1 -= consecutiveWins1;
                    length1 -= consecutiveWins1;
                    System.arraycopy(array, cursor1 + 1, array, destination + 1,
                        consecutiveWins1);
                    
                    if (length1 == 0)
                        break outerLoop;
                }
                
                array[destination--] = tempArray[cursor2--];
                
                if (--length2 == 1)
                    break outerLoop;
                
                consecutiveWins2 = length2 - gallopLeft(array[cursor1],
                    tempArray, 0, length2, length2 - 1);
                
                if (consecutiveWins2 != 0) {
                    destination -= consecutiveWins2;
                    cursor2 -= consecutiveWins2;
                    length2 -= consecutiveWins2;
                    System.arraycopy(tempArray, cursor2 + 1, array,
                        destination + 1, consecutiveWins2);
                    
                    if (length2 <= 1)
                        break outerLoop;
                }
                
                array[destination--] = array[cursor1--];
                
                if (--length1 == 0)
                    break outerLoop;
                
                // Gallop mode working so far, so make it easier to enter
                minGallopEntry--;
            } while (consecutiveWins1 >= MAX_GALLOP_EXIT |
                     consecutiveWins2 >= MAX_GALLOP_EXIT);
            
            if (minGallopEntry < 0)
                minGallopEntry = 0;
            
            // Gallop mode not working so great now, so make it harder to enter
            minGallopEntry += 2;
        }
        
        if (minGallopEntry < 1)
            minGallopEntry = 1;
        
        if (length2 == 1) {
            destination -= length1;
            cursor1 -= length1;
            System.arraycopy(array, cursor1 + 1, array, destination + 1,
                length1);
            array[destination] = tempArray[cursor2];
        } else {
            System.arraycopy(tempArray, 0, array, destination - length2 + 1,
                length2);
        }
    }
    
    /**
     * Finds where to insert the specified element ({@code key}) into the 
     * sorted range in an array. If the range contains an element(s) equal to
     * {@code key}, the index will point to the first one.
     */
    private int gallopLeft(int key, int[] array, int start, int length,
        int hint) {
        int lastOffset = 0;
        int offset = 1;
        
        if (key > array[start + hint]) {
            int maxOffset = length - hint;
            
            // Gallop right
            while (offset < maxOffset && key > array[start + hint + offset]) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                
                if (offset <= 0) // If overflowed
                    offset = maxOffset;
            }
            
            if (offset > maxOffset)
                offset = maxOffset;
            
            // Make offsets relative to base
            lastOffset += hint;
            offset += hint;
        } else {
            int maxOffset = hint + 1;
            
            // Gallop left
            while (offset < maxOffset && key <= array[start + hint - offset]) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                
                if (offset <= 0) // If overflowed
                    offset = maxOffset;
            }
            
            if (offset > maxOffset)
                offset = maxOffset;
            
            // Make offsets relative to base
            int temp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - temp;
        }
        
        lastOffset++;
        
        // Binary search for the key. We now know that it's somewhere between
        // array[base + lastOffset] exclusive, array[base + offset] inclusive
        while (lastOffset < offset) {
            int m = lastOffset + ((offset - lastOffset) >>> 1);
            
            if (key > array[start + m])
                lastOffset = m + 1;
            else
                offset = m;
        }
        
        return offset;
    }
    
    /**
     * Like gallopLeft, but if the range contains an element(s) equal to
     * {@code key}, the index will point to the last one.
     */
    private int gallopRight(int key, int[] array, int start, int length,
        int hint) {
        int offset = 1;
        int lastOffset = 0;
        
        if (key < array[start + hint]) {
            int maxOffset = hint + 1;
            
            // Gallop left
            while (offset < maxOffset && key < array[start + hint - offset]) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                
                if (offset <= 0) // If overflowed
                    offset = maxOffset;
            }
            
            if (offset > maxOffset)
                offset = maxOffset;
            
            // Make offsets relative to base
            int temp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - temp;
        } else {
            int maxOffset = length - hint;
            
            // Gallop right
            while (offset < maxOffset && key >= array[start + hint + offset]) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                
                if (offset <= 0) // If overflowed
                    offset = maxOffset;
            }
            
            if (offset > maxOffset)
                offset = maxOffset;
            
            // Make offsets relative to base
            lastOffset += hint;
            offset += hint;
        }
        
        lastOffset++;
        
        // Binary search for the key. We now know that it's somewhere between
        // array[base + lastOffset] inclusive, array[base + offset] exclusive
        while (lastOffset < offset) {
            int m = lastOffset + ((offset - lastOffset) >>> 1);
            
            if (key < array[start + m])
                offset = m;
            else
                lastOffset = m + 1;
        }
        
        return offset;
    }
    
    /**
     * Finds the length of the run beginning at {@code lowIndex} and ending at
     * or before {@code highIndex}. A run can be either ascending or descending.
     * If the run is descending, it will be reversed to make it ascending.
     */
    private int findLengthOfRun(int start, int end) {
        int runEnd = start + 1;
        
        if (runEnd == end)
            return 1;
        
        if (array[runEnd++] < array[start]) { // Descending run
            while (runEnd < end && array[runEnd] < array[runEnd - 1])
               runEnd++;
            
            reverse(start, runEnd);
        } else { // Ascending run
            while (runEnd < end && array[runEnd] >= array[runEnd - 1])
                runEnd++;
        }
        
        return runEnd - start;
    }
    
    /**
     * Reverses the class array over the specified range.
     */
    private void reverse(int start, int end) {
        end--;
        
        while (start < end)
            swap(start++, end--);
    }
    
    /**
     * Finds a good capacity for the stack of runs. Ideally, this should be as
     * small as possible, but should not overflow or have to be made larger.
     */
    private int findStackCapacity(int arrayLength) {
        return arrayLength / MIN_SEQUENCE_SIZE;
    }
    
    /**
     * Sorts the specified portion of the class array using an insertion sort.
     * If the left part of the array (up to {@code unsortedStart}) is already
     * sorted, it will not be iterated over except to swap elements further up
     * the array into it. This improves performance somewhat.
     */
    private void insertionSort(int start, int unsortedStart, int end) {
        for (int i = start + 1; i < end; i++)
            for (int j = i; j > start && array[j - 1] > array[j]; j--)
                swap(j, j - 1);
    }
    
    /**
     * Swaps the class array at the two given indices.
     */
    private void swap(int i, int j) {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
